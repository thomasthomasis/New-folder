import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Alert, FlatList, ScrollView, Pressable, StyleSheet, Button, Switch, Text, View, TouchableOpacity, TextInput, Dimensions, Modal, TouchableWithoutFeedback, Keyboard} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import {colors} from '../Colors';
import {BSON} from 'realm';
import {useUser, useRealm, useQuery} from '@realm/react';
import { ResistanceWorkout } from '../schemas/ResistanceWorkoutSchema';
import { Workouts } from '../schemas/WorkoutSchema';
import { UserStatistics } from '../schemas/UserStatisticsSchema';
import { ExtraExercises } from '../schemas/ExtraExercisesSchema';
import { shadow } from '../Shadow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type LogWorkoutResistanceProps = {
  onPress:any,
  closeWorkout:any,
}

export const LogWorkoutResistance = (props:LogWorkoutResistanceProps) => {
  const realm = useRealm();
  const user = useUser();

  const [selectingExercise, setSelectingExercise] = useState(false)

  const userStatistics = useQuery(UserStatistics).filtered("userId == $0", user.id);

  let extraExercises = useQuery(ExtraExercises).filtered("userId == $0 && type == $1", user.id, "Resistance");
  const normalExercises = ["Squat", "Bench", "Deadlift"];

  useEffect(() => {
      realm.subscriptions.update(mutableSubs => {
        mutableSubs.add(
          realm.objects(ResistanceWorkout),
        );

        mutableSubs.add(
          realm.objects(Workouts),
        );

        mutableSubs.add(
          realm.objects(UserStatistics)
        )

        mutableSubs.add(
          realm.objects(ExtraExercises)
        )
      });
  }, [realm, user]);

  const [forms, setForms] = useState<any>([]);
  
  const handleAddForm = (exercise:string) => {
    const newForm = { id: forms.length + 1, exercise: {id: 1, value: exercise}, inputs: [{id: 1}], repInputs: [{ id: 1, value: '' }], weightInputs: [{ id: 1, value: ''}], extraNotes: {id: 1, value: ''} };
    setForms([...forms, newForm]);
  };

  const handleRemoveForm = (formIndex:any) => {
    const updatedForms = forms.filter((_:any, i:any) => i !== formIndex);
    setForms(updatedForms);
  };

  const handleAddInput = (formIndex:any) => {
    const newInput = {id: forms[formIndex].inputs.length + 1}
    const newrepInput = { id: forms[formIndex].repInputs.length + 1, value: '' };
    const newweightInput = {id: forms[formIndex].weightInputs.length + 1, value: ''}
    const updatedForms = [...forms];
    updatedForms[formIndex].repInputs.push(newrepInput);
    updatedForms[formIndex].weightInputs.push(newweightInput);
    updatedForms[formIndex].inputs.push(newInput)
    setForms(updatedForms);
  };

  const handleRemoveInput = (formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].inputs = updatedForms[formIndex].inputs.filter((_:any, i:any) => i !== inputIndex)
    updatedForms[formIndex].repInputs = updatedForms[formIndex].repInputs.filter((_:any, i:any) => i !== inputIndex);
    updatedForms[formIndex].weightInputs = updatedForms[formIndex].weightInputs.filter((_:any, i:any) => i !== inputIndex);
    setForms(updatedForms);
  };

  const handleRepInputChange = (text:any, formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].repInputs[inputIndex].value = text;
    setForms(updatedForms);
  };

  const handleWeightInputChange = (text:any, formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].weightInputs[inputIndex].value = text;
    setForms(updatedForms);
  };

  const submitData = () => {
    
    let weights: string[] = [];
    let reps: string[] = [];
    let exercises: string[] = [];

    let totalReps:number = 0;
    let totalVolume:number = 0;
    let allExercises:string[] = [];

    for(let i = 0; i < forms.length; i++)
    {
      weights.push(JSON.stringify(forms[i].weightInputs))
      reps.push(JSON.stringify(forms[i].repInputs))
      exercises.push(JSON.stringify(forms[i].exercise))

      forms[i].repInputs.forEach(({item}:any) => totalReps += Number(item.value))
      forms[i].weightInputs.forEach(({item}:any) => totalVolume += Number(item.value))
      if(!allExercises.includes(forms[i].exercise.value))
      {
        allExercises.push(forms[i].exercise.value)
      }
    }

    let previousLevel = userStatistics[0].lvl;

    const id = new BSON.ObjectID();
    createItem(id, exercises, reps, weights, totalReps, totalVolume, allExercises)
    logWorkout(id, "Resistance")
    updateUserStatistics(totalVolume, totalReps)

    let postLevel = userStatistics[0].lvl;
    let levelUp = false;

    if(postLevel > previousLevel)
    {
      levelUp = true;
    }
    props.onPress(levelUp, (totalVolume + totalReps + 100))
  }


  const createItem = useCallback(
    (id:BSON.ObjectId, exerciseDataJson:string[], repsDataJson:string[], weightsDataJson:string[], totalReps:number, totalVolume:number, allExercises:string[]) => {
      // if the realm exists, create an Item

      
      realm.write(() => {
  
        return new ResistanceWorkout(realm, {
          _id: id,
          allExercises: allExercises,
          dateCreated: new Date(),
          exercises: exerciseDataJson,
          reps: repsDataJson,
          totalReps: totalReps,
          totalVolume: totalVolume,
          userId: user?.id,
          weights: weightsDataJson
        });
      });
    },
    [realm, user],
  );

  const logWorkout = useCallback(
    (id:BSON.ObjectId, workoutType:string) => {
      realm.write(() => {
        return new Workouts(realm, {
          _id: new BSON.ObjectID,
          userId: user?.id,
          dateCreated: new Date(),
          workoutId: id,
          workoutType: workoutType
        })
      })
    }, [realm, user])

    const updateUserStatistics = useCallback(
      (totalVolume:number, totalReps:number) => {
  
        let lvl = userStatistics[0].lvl;
        let xp = userStatistics[0].xp;
  
        let xpGained:number = totalVolume + totalReps + 100;
  
        let object = calculateLevel(lvl, xp, xpGained)
  
        let newLvl = userStatistics[0].lvl;
        let newXp = userStatistics[0].xp;
        let newXpTarget = userStatistics[0].xpTarget;
  
        if(object != null)
        {
          newLvl = object?.newLvl;
          newXp = object?.newXp;
          newXpTarget = object?.newXpTarget;
        }
  
  
        realm.write(() => {
          userStatistics[0].lvl = newLvl,
          userStatistics[0].xp = newXp,
          userStatistics[0].numWorkouts++,
          userStatistics[0].numResistanceWorkouts++,
          userStatistics[0].xpTarget = newXpTarget
        })
      }, [realm, user])

      const calculateLevel = (currLvl:number, currXp:number, xpGained:number) => {

        let newLvl = currLvl;
        let newXp = 0;
        let newXpTarget = 0;
  
        let object = {
          newLvl: newLvl,
          newXp: newXp,
          newXpTarget: newXpTarget,
          xpGained: xpGained
        }
  
        let xpTarget = ((currLvl * 1000) + 1000)
  
        let continueLeveling = true;
        let xp = currXp + xpGained;
  
        while(continueLeveling)
        {
          if(xp < xpTarget)
          {
            continueLeveling = false;
            object.newXp = xp;
            object.newXpTarget = xpTarget;
            object.newLvl = newLvl;
            return object;  
          }
  
          xp -= xpTarget;
          newLvl++;
          xpTarget = ((newLvl * 1000) + 1000)
        }
  
      }

      const handleConfirm = () => {
        // Show confirmation popup
        Alert.alert(
          'Confirm Action',
          'Are you sure you want to log your workout?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => submitData(),
            },
          ],
          { cancelable: false }
        );
      };
    
      const handleCancel = () => {
        // Show confirmation popup
        Alert.alert(
          'Confirm Action',
          'Are you sure you want to delete your workout?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => props.closeWorkout(),
            },
          ],
          { cancelable: false }
        );
      };

      const addedExercisesArray = extraExercises.map(item => item.name ?? "");
      let totalExercises = addedExercisesArray.concat(normalExercises);
    
      const [searchText, setSearchText] = useState<string>('')
      const [filteredData, setFilteredData] = useState<string[]>(addedExercisesArray.concat(normalExercises));
    
      const handleSearch = (text:string) => {
        setSearchText(text);
        if(text === '')
        {
          setFilteredData(filteredData)
        }
        else
        {
          const filtered = totalExercises.filter(item => item.toLowerCase().includes(text.toLowerCase()));
          setFilteredData(filtered);
        }
      };
    
      const [visible, setVisible] = useState<boolean>(false)
      const [modalInput, setModalInput] = useState<string>('')
      const [noNameAlert, setNoNameAlert] = useState<boolean>(false)
    
      const onClose = () => {
    
        setVisible(false);
        setModalInput('')
        setNoNameAlert(false)
      }
    
    
      const addExercise = useCallback(
        (input:string) => {
    
          if(!input.trim())
          {
            setNoNameAlert(true)
            return;
          }
    
          realm.write(() => {
            return new ExtraExercises(realm, {
              _id: new BSON.ObjectID,
              type: "Resistance",
              name: input.trim(),
              userId: user.id,
            })
          })
    
          onClose()
          updateExerciseList()
        }, [realm, user])
    
        const updateExerciseList = () => {
    
          let newList = extraExercises.map(item => item.name ?? "");
          console.log("Updated list: ", newList)
    
          totalExercises = newList.concat(normalExercises)
          console.log(totalExercises)
    
          setFilteredData(totalExercises)
        }

  return (
    
    <>
    {
      !selectingExercise && 
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 10, backgroundColor: colors.black}}>
        <TouchableOpacity onPress={handleCancel}>
            <MaterialCommunityIcons name="arrow-left" color={'white'} size={40} style={{marginLeft: 10, backgroundColor: 'black', borderRadius: 40, padding: 5,}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleConfirm}>
            <MaterialCommunityIcons name="check" color={'white'} size={40} style={{marginRight: 10, backgroundColor: 'black', borderRadius: 40, padding: 5,}}/>
        </TouchableOpacity>
      </View>
    }
    {
      selectingExercise &&
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 10, backgroundColor: colors.black}}>
        <TouchableOpacity onPress={() => setSelectingExercise(false)}>
            <MaterialCommunityIcons name="arrow-left" color={'white'} size={40} style={{marginLeft: 10, backgroundColor: 'black', borderRadius: 40, padding: 5,}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setVisible(true)}>
            <MaterialCommunityIcons name="plus" color={'white'} size={40} style={{marginRight: 10, backgroundColor: 'black', borderRadius: 40, padding: 5,}}/>
        </TouchableOpacity>
      </View>
    }
    

    {
      selectingExercise &&
      <View style={{width: '100%', backgroundColor: colors.black}} onTouchStart={Keyboard.dismiss}>
        <TextInput
        style={{ height: 40, width: '80%', marginRight: 'auto', marginLeft: 'auto', borderColor: 'black', backgroundColor: 'white', borderWidth: 1, borderRadius: 15, marginBottom: 20, padding: 10, }}
        placeholder="Search..."
        value={searchText}
        onChangeText={handleSearch}
        />
        {
          filteredData.map((item) => (
            <TouchableOpacity key={new BSON.ObjectID().toString()} style={[{ backgroundColor: 'lightgray', borderRadius: 20, padding: 10, marginBottom: 10, width: '80%', marginRight: 'auto', marginLeft: 'auto'}, shadow.shadow]} onPress={() => {handleAddForm(item); setSelectingExercise(false)}}>
              <Text  style={{fontSize: 20, fontWeight: '700', textAlign: 'center'}}>{item}</Text>
            </TouchableOpacity>
            
          ))
        }
      </View>
    }
    {
      !selectingExercise &&
    <View style={styles.container}>
        
      {forms.map((form:any, formIndex:any) => (
        <View key={form.id} style={styles.form}>
          <Text style={styles.exercise}>{forms[formIndex].exercise.value}</Text>
      {form.inputs.map((input:any, inputIndex:any) => (
        <View key={input.id} style={styles.row}>
            <View style={styles.inputs}>
              <View style={styles.inputContainer}>
                {
                  inputIndex == 0 &&
                  <Text style={{fontSize: 16, color: 'white'}}>Weight</Text>
                }
                <TextInput
                  placeholder=""
                  value={input.value}
                  onChangeText={(text) => handleWeightInputChange(text, formIndex, inputIndex)}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputContainer}>
                {
                  inputIndex == 0 &&
                  <Text style={{fontSize: 16, color: 'white'}}>Reps</Text>
                }
                <TextInput
                  placeholder=""
                  value={input.value}
                  onChangeText={(text) => handleRepInputChange(text, formIndex, inputIndex)}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
              <View style={styles.removeButtonContainer}>
                <Pressable onPress={() => handleRemoveInput(formIndex, inputIndex)} style={styles.removeButton}>
                  <Text style={{color: 'white', fontSize: 20}}>X</Text>
                </Pressable>
              </View>
        </View>
      ))}
      
      <Pressable onPress={() => handleAddInput(formIndex)} style={styles.addButton}>
        <Text>Add Set</Text>
      </Pressable>

      <Pressable onPress={() => handleRemoveForm(formIndex)} style={styles.addButton}>
        <Text>Remove Exercise</Text>
      </Pressable>
      
      </View>
      ))}

      <Pressable onPress={() => setSelectingExercise(true)} style={styles.button}>
        <Text>Add Exercise</Text>
      </Pressable>
      
    </View>
    }

    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback  onPress={onClose}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
          <TouchableWithoutFeedback>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 , width: '80%',}}>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>Enter Exercise Name:</Text>
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
                placeholder="Enter name..."
                value={modalInput}
                onChangeText={setModalInput}
              />
              <Button title="Submit" onPress={() => addExercise(modalInput)} />
              {
                noNameAlert &&
                <Text style={{color: 'red', fontSize: 18, fontWeight: '800', textAlign: 'center'}}>A name is required!</Text>
              }
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </>
  
)};




const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  form: {
    backgroundColor: colors.black,
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 2, 
    borderBottomColor: 'black',
  },

  exercise: {
    textAlign: 'center',
    fontSize: 30,
    paddingTop: 10,
    fontWeight: '700',
    color: 'white',
  },

  dropdownButton: {
    width: '100%',
    borderRadius: 5,
    marginBottom: 10,
    height: 40,
  },

  row: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',

    marginBottom: 10,
  },

  inputs: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  inputContainer: {
    width: '48%',
    display: 'flex',
    flexDirection: 'column',

    alignItems: 'center',
  },

  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
    height: 40,
  },

  removeButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 30,
  },

  removeButton: {
    backgroundColor: 'black',
    height: 30,
    width: 30,
    borderRadius: 3,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textareaContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },

  textarea: {
    backgroundColor: '#F7D1D7',
    borderRadius: 5,
    width: '100%',
    height: 100,
    textAlignVertical: "top"
  },

  addButton: {
    width: 120,
    backgroundColor: 'white',
    borderRadius: 5,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 5,
  },

  button: {
    width: 150,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 5,
  },

  submitButton: {
    width: 200,
    height: 50,
    backgroundColor: colors.green,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 5,
  },
    
  });