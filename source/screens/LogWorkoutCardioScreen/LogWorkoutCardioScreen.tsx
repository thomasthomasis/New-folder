import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Button, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, ScrollView} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {BSON} from 'realm';
import {useUser, useRealm, useQuery} from '@realm/react';
import {CardioWorkout} from '../../schemas/CardioWorkoutSchema';
import { Workouts } from '../../schemas/WorkoutSchema';
import { UserStatistics } from '../../schemas/UserStatisticsSchema';
import { ExtraExercises } from '../../schemas/ExtraExercisesSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { shadow } from '../../sharedStyling/Shadow';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './LogWorkoutCardioScreen.style';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp } from '@react-navigation/native'

type LogWorkoutCardioProps = {
  navigation: StackNavigationProp<RootStackParamList, 'LogWorkoutCardio'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'LogWorkoutCardio'>;
};

export const LogWorkoutCardioScreen = ({ navigation, route}: LogWorkoutCardioProps) => {
  const realm = useRealm();
  const user = useUser();

  const { continuingWorkout, navigationScreen } = route.params;

  const goBack = () => {
    navigation.goBack()
  }

  const goToSubmitCompletion = (levelUp:boolean, gainedXp:number) => {
    navigation.navigate("SubmitCompletion", {levelUp: levelUp, gainedXp: gainedXp, navigationScreen: navigationScreen})
  }

  const goToEditExercise = (exerciseId:string) => {
    navigation.navigate("EditCardioExercise", { exercise: exerciseId})
  }

  const [selectingExercise, setSelectingExercise] = useState(false)
  const [userStatistics, setUserStatistics] = useState<any>(realm.objects("UserStatistics").filtered("userId == $0", user.id));
  const [userData, setUserData] = useState<any>(realm.objects("Users").filtered("userId == $0", user.id));

  const [extraExercises, setExtraExercises] = useState<any>(realm.objects(ExtraExercises).filtered("userId == $0 && type == $1", user.id, "Cardio"));
  
  const [totalExercises, setTotalExercises] = useState<any>(null)

  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const [visible, setVisible] = useState<boolean>(false)
  const [modalInput, setModalInput] = useState<string>('')
  const [noNameAlert, setNoNameAlert] = useState<boolean>(false)
  const [visibleOptions, setVisibleOptions] = useState<boolean>(false)
  const [selectedExercise, setSelectedExercise] = useState<string>('')

  const [forms, setForms] = useState<any>([]);

  const normalExercises = [
  { id: "0", name: 'Running' },
  { id: "1", name: 'Cycling' },
  { id: "2", name: 'Swimming' },
  { id: "3", name: 'Jumping Rope' },
  { id: "4", name: 'Rowing' },
  { id: "5", name: 'Elliptical Training' },
  { id: "6", name: 'Hiking' },
  { id: "7", name: 'Dancing' },
  { id: "8", name: 'Kickboxing' },
  { id: "9", name: 'Stair Climbing' },
  { id: "10", name: 'Pilates' },
  { id: "11", name: 'Zumba' },
  { id: "12", name: 'Yoga' },
  { id: "13", name: 'High Knees' },
  { id: "14", name: 'Butt Kicks' },
  { id: "15", name: 'Mountain Climbers' },
  { id: "16", name: 'Burpees' },
  { id: "17", name: 'Side Shuffles' },
  { id: "18", name: 'Box Jumps' },
  { id: "19", name: 'Skipping' },
  { id: "20", name: 'Speed Skating' },
  { id: "21", name: 'Shadow Boxing' },
  { id: "22", name: 'Treadmill Running' },
  { id: "23", name: 'Stationary Bike' },
  { id: "24", name: 'Trampoline' },
  { id: "25", name: 'Staircase Running' },
  { id: "26", name: 'Speed Walking' },
  { id: "27", name: 'Inline Skating' },
  { id: "28", name: 'Plyometrics' },
  { id: "29", name: 'Boot Camp' },
  { id: "30", name: 'Circuit Training' },
  { id: "31", name: 'HIIT' },
  { id: "33", name: 'Sprints' },
  { id: "34", name: 'CrossFit' },
  { id: "35", name: 'Bodyweight Exercises' },
  { id: "36", name: 'Cardio Kickboxing' },
  { id: "37", name: 'Battle Ropes' },
  { id: "41", name: 'Racquetball' },
  { id: "42", name: 'Basketball' },
  { id: "43", name: 'Soccer' },
  { id: "44", name: 'Tennis' },
  { id: "45", name: 'Squash' },
  { id: "46", name: 'Badminton' },
  { id: "47", name: 'Frisbee' },
  { id: "48", name: 'Ultimate Frisbee' },
  { id: "49", name: 'Touch Football' },
  { id: "50", name: 'Beach Volleyball' },
  { id: "51", name: 'Paddleboarding' },
  { id: "52", name: 'Surfing' },
  { id: "53", name: 'Kayaking' },
  { id: "54", name: 'Canoeing' },
  { id: "55", name: 'Rowboat' },
  { id: "56", name: 'Stand-up Paddleboarding' },
  { id: "57", name: 'Rock Climbing' },
  { id: "60", name: 'Cross-country Skiing' },
  { id: "61", name: 'Downhill Skiing' },
  { id: "62", name: 'Snowboarding' },
  { id: "63", name: 'Snowshoeing' },
  { id: "64", name: 'Hockey' },
  { id: "65", name: 'Lacrosse' },
  { id: "66", name: 'Field Hockey' },
  { id: "67", name: 'Rugby' },
  { id: "68", name: 'Handball' },
  { id: "69", name: 'Water Polo' },
  { id: "70", name: 'Swimming Laps' },
  { id: "88", name: 'Rowing Machine' },
  { id: "89", name: 'Elliptical Machine' },
  { id: "90", name: 'Treadmill Walking' },
  { id: "91", name: 'Treadmill Jogging' },
  { id: "92", name: 'Outdoor Running' },
  { id: "93", name: 'Outdoor Walking' },
  { id: "95", name: 'Track Running' },
  { id: "96", name: 'Field Running' },
  { id: "97", name: 'Beach Running' },
  { id: "98", name: 'Parkour' },
  ];

  useEffect(() => {
    addExercisesToArray();

    setFilteredData(normalExercises)
  }, [extraExercises])

  const addExercisesToArray = () => {

    for(let i = 0; i < extraExercises.length; i++)
    {
      let id = extraExercises[i].exerciseId;
      let name = extraExercises[i].name; 


      let object = {
        id:id,
        name:name ?? ""
      }

      normalExercises.push(object)
    }

    setTotalExercises(normalExercises);

    console.log(totalExercises)
  }
  
  const getExerciseName = (id:string) => {

    console.log(id)

    for(let i = 0; i < totalExercises.length; i++)
    {
      if(totalExercises[i].id == id)
      {
        return totalExercises[i].name;
      }
    }
    
    return id;
  } 

  const handleAddForm = (exercise:string) => {
    const newForm = { id: forms.length + 1, exercise: {id: 1, value: exercise}, inputs: [{id: 1}], timeInputs: [{ id: 1, value: '' }], distanceInputs: [{ id: 1, value: ''}], extraNotes: {id: 1, value: ''} };
    setForms([...forms, newForm]);

    saveCurrentWorkout();
  };

  const handleRemoveForm = (formIndex:any) => {
    const updatedForms = forms.filter((_:any, i:any) => i !== formIndex);
    setForms(updatedForms);

    saveCurrentWorkout();
  };

  const handleAddInput = (formIndex:any) => {
    const newInput = {id: forms[formIndex].inputs.length + 1}
    const newTimeInput = { id: forms[formIndex].timeInputs.length + 1, value: '' };
    const newDistanceInput = {id: forms[formIndex].distanceInputs.length + 1, value: ''}
    const updatedForms = [...forms];
    updatedForms[formIndex].timeInputs.push(newTimeInput);
    updatedForms[formIndex].distanceInputs.push(newDistanceInput);
    updatedForms[formIndex].inputs.push(newInput)
    setForms(updatedForms);

    saveCurrentWorkout();
  };

  const handleRemoveInput = (formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].inputs = updatedForms[formIndex].inputs.filter((_:any, i:any) => i !== inputIndex)
    updatedForms[formIndex].timeInputs = updatedForms[formIndex].timeInputs.filter((_:any, i:any) => i !== inputIndex);
    updatedForms[formIndex].distanceInputs = updatedForms[formIndex].distanceInputs.filter((_:any, i:any) => i !== inputIndex);
    setForms(updatedForms);

    saveCurrentWorkout();
  };

  const handleTimeInputChange = (text:any, formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].timeInputs[inputIndex].value = text;
    setForms(updatedForms);

    saveCurrentWorkout();
  };

  const handleDistanceInputChange = (text:any, formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].distanceInputs[inputIndex].value = text;
    setForms(updatedForms);

    saveCurrentWorkout();
  };

  const handleExtraNotesInputChange = (text:any, formIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].extraNotes.value = text;
    setForms(updatedForms);

    saveCurrentWorkout();
  }

  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
  })

  const saveCurrentWorkout = () => {
    storage.save({
      key: 'currentWorkout',
      data: {
        forms,
      }
    })

    storage.save({
      key: 'workoutType',
      data: {
        workoutType: "Cardio",
      }
    })

    console.log("saved workout, forms: ", forms)
  }

  const loadCurrentWorkout = () => {
    storage.load({
      key: 'currentWorkout'
    })
    .then(ret => {setForms(ret.forms); console.log(ret.forms);})
    .catch(err => {
      console.warn(err.message);
    })
  }

  useEffect(() => {
    if(continuingWorkout)
      {
        loadCurrentWorkout()
      }
  }, [])

  const submitData = () => {
  
    let distances: string[] = [];
    let times: string[] = [];
    let exercises: string[] = [];
    let extraNotes: string[] = [];

    let totalTime:number = 0;
    let totalDistance:number = 0;
    let allExercises:string[] = [];

    for(let i = 0; i < forms.length; i++)
    {
      distances.push(JSON.stringify(forms[i].distanceInputs))
      times.push(JSON.stringify(forms[i].timeInputs))
      exercises.push(JSON.stringify(forms[i].exercise))
      extraNotes.push(JSON.stringify(forms[i].extraNotes))

      console.log(forms[i].timeInputs[0].value)

      forms[i].timeInputs.forEach(({item}:any) => {
        if(item && item.value != null)
          {
            totalTime += Number(item.value)
          }
      })

      forms[i].distanceInputs.forEach(({item}:any) => {
        if(item && item.value != null)
          {
            totalDistance += Number(item.value)
          }
        
      })
      if(!allExercises.includes(forms[i].exercise.value))
      {
        allExercises.push(forms[i].exercise.value)
      }
    }

    let previousLevel = userStatistics[0].lvl as number;

    const id = new BSON.ObjectID();
    createItem(id, exercises, times, distances, extraNotes, totalTime, totalDistance, allExercises)
    logWorkout(id, "Cardio")
    updateUserStatistics(totalTime, totalDistance)
    updateUserTitles(userStatistics[0].lvl as number)

    let postLevel = userStatistics[0].lvl as number;
    let levelUp = false;

    if(postLevel > previousLevel)
    {
      levelUp = true;
    }

    goToSubmitCompletion(levelUp, (totalDistance + totalTime + 100))
    
  }


  const createItem = useCallback(
    (id:BSON.ObjectId, exerciseDataJson:string[], timeDataJson:string[], distanceDataJson:string[], extraNotesJson:string[], totalTime:number, totalDistance:number, allExercises:string[]) => {
      // if the realm exists, create an Item

      realm.write(() => {
  
        return new CardioWorkout(realm, {
          _id: id,
          user_id: user?.id,
          dateCreated: new Date(),
          exercise: exerciseDataJson,
          time: timeDataJson,
          distance: distanceDataJson,
          extraNotes: extraNotesJson,
          totalTime: totalTime,
          totalDistance: totalDistance,
          allExercises: allExercises,
        });
      });
    },
    [realm, user],
  );

  const logWorkout = useCallback(
    (id:BSON.ObjectId ,workoutType:string) => {
      realm.write(() => {
        return new Workouts(realm, {
          _id: new BSON.ObjectID,
          userId: user?.id,
          dateCreated: new Date(),
          workoutId: id,
          workoutType: workoutType,
          userStatus: userData[0].status as string
        })
      })
    }, [realm, user])

  const updateUserStatistics = useCallback(
    (totalTime:number, totalDistance:number) => {

      let lvl = userStatistics[0].lvl as number;
      let xp = userStatistics[0].xp as number;

      let xpGained:number = totalTime + totalDistance + 100;

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

      let numWorkouts = userStatistics[0].numWorkouts as number;
      let numCardioWorkouts = userStatistics[0].numCardioWorkouts as number;


      realm.write(() => {
        userStatistics[0].lvl = newLvl,
        userStatistics[0].xp = newXp,
        userStatistics[0].numWorkouts = numWorkouts + 1,
        userStatistics[0].numCardioWorkouts = numCardioWorkouts + 1,
        userStatistics[0].xpTarget = newXpTarget
      })
    }, [realm, user])

    const updateUserTitles = useCallback(
      (level:any) => {
        let newUnlockedTitles:string[] = [];

        const titles = ["Newbie", "Starter", "Rookie", "Novice", "Fitness Enthusiast", "Active Achiever", "Workout Warrior", "Movement Monk", "Determined Disciple", "Fitness Pro", "Exercise Expert", "Strength Master", "Endurance Elite", "Power Performer", "Ultimate Athlete", "Fitness Guru", "Master Trainer", "Elite Champion", "Fitness God"];

        console.log(newUnlockedTitles)
        console.log(level)

        newUnlockedTitles.push(titles[0])

        if(level > 190)
        {
          if(!newUnlockedTitles.includes(titles[18])){
            newUnlockedTitles.push(titles[18])
          }
        }
        else if(level > 180)
        {
          if(!newUnlockedTitles.includes(titles[17])){
            newUnlockedTitles.push(titles[17])
          }
        }
        else if(level > 170)
        {
          if(!newUnlockedTitles.includes(titles[16])){
            newUnlockedTitles.push(titles[16])
          }
        }
        else if(level > 160)
        {
          if(!newUnlockedTitles.includes(titles[15])){
            newUnlockedTitles.push(titles[15])
          }
        }
        else if(level > 150)
        {
          if(!newUnlockedTitles.includes(titles[14])){
            newUnlockedTitles.push(titles[14])
          }
        }
        else if(level > 140)
        {
          if(!newUnlockedTitles.includes(titles[14])){
            newUnlockedTitles.push(titles[14])
          }
        }
        else if(level > 130)
        {
          if(!newUnlockedTitles.includes(titles[13])){
            newUnlockedTitles.push(titles[13])
          }
        }
        else if(level > 120)
        {
          if(!newUnlockedTitles.includes(titles[12])){
            newUnlockedTitles.push(titles[12])
          }
        }
        else if(level > 110)
        {
          if(!newUnlockedTitles.includes(titles[11])){
            newUnlockedTitles.push(titles[11])
          }
        }
        else if(level > 100)
        {
          if(!newUnlockedTitles.includes(titles[10])){
            newUnlockedTitles.push(titles[10])
          }
        }
        else if(level > 90)
        {
          if(!newUnlockedTitles.includes(titles[9])){
            newUnlockedTitles.push(titles[9])
          }
        }
        else if(level > 80)
        {
          if(!newUnlockedTitles.includes(titles[8])){
            newUnlockedTitles.push(titles[8])
          }
        }
        else if(level > 70)
        {
          if(!newUnlockedTitles.includes(titles[7])){
            newUnlockedTitles.push(titles[7])
          }
        }
        else if(level > 60)
        {
          if(!newUnlockedTitles.includes(titles[6])){
            newUnlockedTitles.push(titles[6])
          }
        }
        else if(level > 50)
        {
          if(!newUnlockedTitles.includes(titles[5])){
            newUnlockedTitles.push(titles[5])
          }
        }
        else if(level > 40)
        {
          if(!newUnlockedTitles.includes(titles[4])){
            newUnlockedTitles.push(titles[4])
          }
        }
        else if(level > 30)
        {
          if(!newUnlockedTitles.includes(titles[3])){
            newUnlockedTitles.push(titles[3])
          }
        }
        else if(level > 20)
        {
          if(!newUnlockedTitles.includes(titles[2])){
            newUnlockedTitles.push(titles[2])
          }
        }
        else if(level > 10)
        {
          if(!newUnlockedTitles.includes(titles[1])){
            newUnlockedTitles.push(titles[1])
          }
        }

        console.log(newUnlockedTitles)

        realm.write(() => {
          userData[0].titles = newUnlockedTitles
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
    if(forms.length == 0)
      {
        Alert.alert(
          "No Exercises", // Title of the alert
          "You must enter workout data before submitting", // Alert message
          [
            { text: "Close", onPress: () => console.log("Close Pressed") }
          ],
          { cancelable: true } // If false, the user cannot dismiss the alert by tapping outside
        );

        return 
      }

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
          onPress: () => goBack(),
        },
      ],
      { cancelable: false }
    );
  };

  const handleConfirmRemoveExercise = (formIndex:any) => {
    // Show confirmation popup
    
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to remove this exercise from your current workout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => handleRemoveForm(formIndex),
        },
      ],
      { cancelable: false }
    );
  };

  const handleConfirmDeleteAddedExercise = () => {
    // Show confirmation popup
    
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to delete this exercise permanently?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {onClose(); deleteExercise(selectedExercise)},
        },
      ],
      { cancelable: false }
    );
  };
 

  const handleSearch = (text:string) => {
    setSearchText(text);
    if(text === '')
    {
      setFilteredData(filteredData)
    }
    else
    {
      const filtered = totalExercises.filter((item:any) => item.name.toLowerCase().startsWith(text.toLowerCase()));
      setFilteredData(filtered);
    }
  };

  const onClose = () => {

    setVisible(false);
    setModalInput('')
    setNoNameAlert(false)
    setVisibleOptions(false)
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
          type: "Cardio",
          name: input.trim(),
          userId: user.id,
          exerciseId: new BSON.ObjectID().toString()
        })
      })

      onClose()
      updateExerciseList()
    }, [realm, user])

    const updateExerciseList = () => {

      let newList = extraExercises;
      console.log("Updated list: ", newList)

      let newTotalExercises = newList.concat(normalExercises)

      setTotalExercises(newTotalExercises)

      setFilteredData(totalExercises)
      
    }

  const deleteExercise = (exerciseId:string) => {

    const exercise = realm.objects(ExtraExercises).filtered("exerciseId == $0", exerciseId)

    realm.write(() => {
      realm.delete(exercise)
    })
  }

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(
        realm.objects(CardioWorkout),
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
    

  return (
    
    <>
    {
      !selectingExercise && 
      <View style={styles.header}>
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
      <View style={styles.header}>
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
      <>
        <View style={{backgroundColor: colors.red}}>
          <TextInput
          style={{ height: 40, width: '80%', marginRight: 'auto', marginLeft: 'auto', borderColor: 'black', backgroundColor: 'white', borderWidth: 1, borderRadius: 15, marginBottom: 20, padding: 10, }}
          placeholder="Search..."
          value={searchText}
          onChangeText={handleSearch}
          />
        </View>

        <ScrollView style={{width: '100%', backgroundColor: colors.red,}}>
        {
          searchText.length > 0 && 
          filteredData.map((item) => (
            <TouchableOpacity key={new BSON.ObjectID().toString()} style={[{ backgroundColor: 'lightgray', borderRadius: 20, padding: 10, marginBottom: 10, width: '80%', marginRight: 'auto', marginLeft: 'auto'}, shadow.shadow]} onPress={() => {
                let id = item.id;
                handleAddForm(id)
                setSelectingExercise(false)
              }} onLongPress={() => {
                setSelectedExercise(item.id)
                setVisibleOptions(true)
              }}>
                <Text  style={{fontSize: 20, fontWeight: '700', textAlign: 'center'}}>{getExerciseName(item.id)}</Text>
            </TouchableOpacity>
            
            
            ))
          }
          {
            searchText.length == 0 &&
            totalExercises.map((item:any) => (
              <TouchableOpacity key={new BSON.ObjectID().toString()} style={[{ backgroundColor: 'lightgray', borderRadius: 20, padding: 10, marginBottom: 10, width: '80%', marginRight: 'auto', marginLeft: 'auto'}, shadow.shadow]} onPress={() => {
                let id = item.id;
                handleAddForm(id)
                setSelectingExercise(false)
              }} onLongPress={() => {
                setSelectedExercise(item.id)
                setVisibleOptions(true)
              }}>
                <Text style={{fontSize: 20, fontWeight: '700', textAlign: 'center'}}>{getExerciseName(item.id)}</Text>
            </TouchableOpacity>
              
              
              ))
          }
      </ScrollView>
      </>
      
    }
    {
      !selectingExercise &&
    <View style={styles.container}>
      <ScrollView>
        
      {forms.map((form:any, formIndex:any) => (
        <View key={new BSON.ObjectID().toString()} style={styles.form}>
          <Text style={styles.exercise}>{getExerciseName(forms[formIndex].exercise.value)}</Text>
          <View style={styles.smallBorder}></View>
      {form.inputs.map((input:any, inputIndex:any) => (
        <View key={new BSON.ObjectID().toString()} style={styles.row}>
            <View style={styles.inputs}>
              <View style={styles.inputBoxes}>
                <View style={styles.inputContainer}>
                  {
                    inputIndex == 0 &&
                    <Text style={{fontSize: 14, color: 'black', marginBottom: 10, fontWeight: '700'}}>Time</Text>
                  }
                  {
                    inputIndex > 0 &&
                    <Text></Text>
                  }
                  <TextInput
                    placeholder=""
                    value={form.timeInputs[inputIndex].value}
                    onChangeText={(text) => handleTimeInputChange(text, formIndex, inputIndex)}
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  {
                    inputIndex == 0 &&
                    <Text style={{fontSize: 14, color: 'black', marginBottom: 10, fontWeight: '700'}}>Distance</Text>
                  }
                  {
                    inputIndex > 0 &&
                    <Text></Text>
                  }
                  <TextInput
                    placeholder=""
                    value={form.distanceInputs[inputIndex].value}
                    onChangeText={(text) => handleDistanceInputChange(text, formIndex, inputIndex)}
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
            </View>
            
            <View style={styles.inputContainer}>
              <View style={styles.removeButtonContainer}>
                <TouchableOpacity onPress={() => handleRemoveInput(formIndex, inputIndex)} style={styles.removeButton}>
                  <MaterialCommunityIcons name="delete" color={colors.red} size={30} style={{borderRadius: 40}}/>
                </TouchableOpacity>
              </View>
            </View>
             
              
        </View>
      ))}

      <View style={styles.textareaContainer}>
      <Text style={{fontSize: 14, color: 'black', marginBottom: 10, fontWeight: '700', marginTop: 30}}>Extra Info</Text>
        <TextInput 
          value={form.extraNotes.value} 
          onChangeText={(text) => handleExtraNotesInputChange(text, formIndex)} 
          style={styles.textarea} 
          multiline={true} 
          numberOfLines={20}
          placeholder="" 
          keyboardType="default" 
        />
      </View>
      
      <View style={styles.rowButtons}>
      <TouchableOpacity onPress={() => handleAddInput(formIndex)} style={[styles.addButton, shadow.shadow]}>
          <Text style={{color: 'gray', fontWeight: '800', fontSize: 15}}>Add Interval</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleConfirmRemoveExercise(formIndex)} style={[styles.addButton, shadow.shadow]}>
          <Text  style={{color: 'gray', fontWeight: '800', fontSize: 15}}>Remove Exercise</Text>
        </TouchableOpacity>
        
        </View>
      </View>
      
      ))}

      <TouchableOpacity onPress={() => setSelectingExercise(true)} style={[styles.button, shadow.shadow]}>
        <Text style={{color: 'gray', fontWeight: '800', fontSize: 20,}}>Add Exercise</Text>
      </TouchableOpacity>
      
      </ScrollView>
    </View>
    }

    <Modal
      isVisible={visible}
      swipeDirection={['down']}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      style={styles.modalView}
      >
          <View style={styles.modalContent}>
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
          </View>
        
          
      </Modal>

    <Modal isVisible={visibleOptions} swipeDirection={['down']} onSwipeComplete={onClose} onBackdropPress={onClose} style={styles.modalView}>
          <View style={styles.modalContent}>
           
            <TouchableOpacity onPress={() => {onClose(); goToEditExercise(selectedExercise)}} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Edit Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {handleConfirmDeleteAddedExercise()}} style={[styles.modalButton, {backgroundColor: colors.red}]}>
              <Text style={styles.modalButtonText}>Delete Exercise</Text>
            </TouchableOpacity>
          </View>
      </Modal>
    </>
  
)};




