import React, {useCallback, useState, useEffect} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {BSON} from 'realm';
import {useUser, useRealm, useQuery} from '@realm/react';
import { ResistanceWorkout } from '../../schemas/ResistanceWorkoutSchema';
import { Workouts } from '../../schemas/WorkoutSchema';
import { UserStatistics } from '../../schemas/UserStatisticsSchema';
import { ExtraExercises } from '../../schemas/ExtraExercisesSchema';
import { shadow } from '../../sharedStyling/Shadow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Collapsible from 'react-native-collapsible';
import { AddExerciseScreen } from '../AddExerciseScreen/AddExerciseScreen';
import styles from './LogWorkoutResistanceScreen.style'

type LogWorkoutResistanceProps = {
  onPress:any,
  closeWorkout:any,
  continuingWorkout:boolean,
}

export const LogWorkoutResistanceScreen = (props:LogWorkoutResistanceProps) => {
  const realm = useRealm();
  const user = useUser();

  const [selectingExercise, setSelectingExercise] = useState(false)

  const userStatistics = realm.objects("UserStatistics").filtered("userId == $0", user.id);
  const userData = realm.objects("Users").filtered("userId == $0", user.id);

  let extraExercises = useQuery(ExtraExercises).filtered("userId == $0 && type == $1", user.id, "Resistance");

  const normalExercises = [
    "Neck Curls", "Neck Raises", "Side Raises",
    "Bar Pullover", "Barbell Incline Row", "Barbell Row", "Barbell Upright Row", "Cable Row", "Chest Supported Row", "Chin Up", "Clean & Press", "Deadlift", "Dumbbell One Arm Rown", "Farmer Carry", "Good Morning", "Hypeprextension", "Iso-lateral Pulldown", "Iso-lateral Row Machine", "Lat Pulldown", "Pendlay Row", "Pull Up", "Lat Pulldown", "Rope Pullover", "Seated Row Machine", "Single Arm Lat Pulldown", "T-Bar Row", "Weighted Pullup",
    "Arnold Press", "Cable Front Raise", "Cable Lateral Raise", "Cable Rear Delt Fly", "Cable Shoulder Press", "Clean & Press", "Dumbbell Front Raise", "Dumbbell Lateral Raise", "Dumbbell Rear Delt Fly", "Dumbbell Shoulder Press", "External Rotations", "Face Pull", "Internal Rotations", "Lateral Raise Machine", "Military Press", "Rear Delt Fly Machine", "Seated Lateral Raise", "Shoulder Press Machine", "Smit Machine Shoulder Press", "Upright Row",
    "Barbell Bench Press", "Cable Chest Press", "Cable Crossover", "Cable Fly (high to low)", "Cable Fly (low to high)", "Close Grip Bench Press", "Decline Bench Press", "Decline Dumbbell Press", "Decline Smith Machine Bench Press", "Dips", "Dumbbell Fly", "Dumbbell Press", "Incline Bench Press", "Incline Cable Press", "Incline Dumbbell Fly", "Incline Dumbbell Press", "Incline Smith Machine Press", "Iso-lateral Chest Press", "Pec Deck Machine", "Push Up", "Seated Chest Press Machine", "Smith Machine Bench Press", "Weighted Dips",
    "Barbell Bicep Curl", "Barbell Preacher Curl", "Bayesian Curl", "Cable Curl", "Cable Hammer Curl", "Chin Up", "Concentration Curl", "Dumbbell Bicep Curl", "Dumbbell Preacher Curl", "EZ Bar Preacher Curl", "Face Away Cable Curl", "Hammer Curl", "Preacher Curl Machine", "Spider Curl",
    "Bar Pushdown", "Barbell Skullcrusher", "Cable Kickback", "Cable Single Arm Extension", "Close Grip Bench Press", "Dips", "Dumbbell Kickback", "Dumbbell Skullcrusher", "Dumbbell Tricep Extension", "EZ Bar Skullcrusher", "Katana Extension", "Diamond Push Up", "Rope Overhead Extension", "Smith Machine JM Press", "Tricep Extension", "Weighted Dips",
    "Reverse Barbell Curl", "Reverse Dumbbell Curl", "Wrist Curl",
    "Ab Crunch", "Back Extension", "Cable Crunch", "Ex Oblique Cable Twist", "Farmer Carry", "Good Morning", "Russian Twist", "Sit Up",
    "Barbell Back Squat", "Barbell Front Squat", "Barbell Lunge", "Bodyweight Pistol Squat", "Bulgarian Split Squat", "Clean", "Deadlift", "Dumbbell Lunge", "Goblet Squat", "Hack Squat", "Leg Extension", "Leg Press", "Lunge", "Pendulum Squat", "Reverse Nordic", "Single-Leg Leg Press", "Sled Push", "Smith Machine Squat", "Snatch", "Sumo Deadlift",
    "Barbell Back Squat", "Barbell Front Squat", "Barbell Lunge", "Barbell RDL", "Bulgarian Split Squat", "Clean", "Deadlift", "Donkey Kick", "Dumbbell Lunge", "Glute Ham Raise", "Glute Kickback", "Good Morning", "Hip Abductor", "Hip Thrust", "Leg Press", "Lunge", "Romanian Deadlift", "Single-Leg Leg Press", "Sled Push", "Still Leg Deadlift", "Sumo Deadlift",
    "Barbell Back Squat", "Barbell Lunge", "Barbell RDL", "Bulgarian Split Squat", "Deadlift", "Dumbbell Lunge", "Dumbbell RDL", "Glute Ham Raise", "Good Morning", "Leg Curl", "Lunge", "Lying Leg Curl", "Nordic Curls", "Romanian Deadlift", "Sled Push", "Stiff Leg Deadlift", "Sumo Deadlift",
    "Hip March", "Lying Reverse Squat",
    "Hip Adductor",
    "Seated Calf Raises", "Standing Calf Raises"
  ];
  


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

    saveCurrentWorkout();
  };

  const handleRemoveForm = (formIndex:any) => {
    const updatedForms = forms.filter((_:any, i:any) => i !== formIndex);
    setForms(updatedForms);

    saveCurrentWorkout();
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

    saveCurrentWorkout();
  };

  const handleRemoveInput = (formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].inputs = updatedForms[formIndex].inputs.filter((_:any, i:any) => i !== inputIndex)
    updatedForms[formIndex].repInputs = updatedForms[formIndex].repInputs.filter((_:any, i:any) => i !== inputIndex);
    updatedForms[formIndex].weightInputs = updatedForms[formIndex].weightInputs.filter((_:any, i:any) => i !== inputIndex);
    setForms(updatedForms);

    saveCurrentWorkout();
  };

  const handleRepInputChange = (text:any, formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].repInputs[inputIndex].value = text;
    setForms(updatedForms);

    saveCurrentWorkout();
  };

  const handleWeightInputChange = (text:any, formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].weightInputs[inputIndex].value = text;
    setForms(updatedForms);

    saveCurrentWorkout();
  };

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
        workoutType: "Resistance",
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
    if(props.continuingWorkout)
      {
        loadCurrentWorkout()
      }
  }, [])

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

      forms[i].repInputs.forEach(({item}:any) => {
        if(item && item.value != null)
          {
            totalReps += Number(item.value)
          }
      })

      forms[i].weightInputs.forEach(({item}:any) => {
        if(item && item.value != null)
          {
            totalVolume += Number(item.value)
          }
      })

      if(!allExercises.includes(forms[i].exercise.value))
      {
        allExercises.push(forms[i].exercise.value)
      }
    }
  
    let previousLevel = userStatistics[0].lvl as number;

    const id = new BSON.ObjectID();
    createItem(id, exercises, reps, weights, totalReps, totalVolume, allExercises)
    logWorkout(id, "Resistance")
    updateUserStatistics(totalVolume, totalReps)
    updateUserTitles(userStatistics[0].lvl as number)

    let postLevel = userStatistics[0].lvl as number;
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
  
        let lvl = userStatistics[0].lvl as number;
        let xp = userStatistics[0].xp as number;
  
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

        let numWorkouts = userStatistics[0].numWorkouts as number;
        let numResistanceWorkouts = userStatistics[0].numResistanceWorkouts as number;
  
  
        realm.write(() => {
          userStatistics[0].lvl = newLvl,
          userStatistics[0].xp = newXp,
          userStatistics[0].numWorkouts = numWorkouts + 1,
          userStatistics[0].numResistanceWorkouts = numResistanceWorkouts + 1,
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
              onPress: () => props.closeWorkout(),
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
          const filtered = totalExercises.filter(item => item.toLowerCase().startsWith(text.toLowerCase()));
          setFilteredData(filtered);
        }
      };
    
      const [addingExercise, setAddingExercise] = useState<boolean>(false)
     
      const exitExerciseManipulation = () => {
        setAddingExercise(false)
      }
    
    
      const addExercise = useCallback(
        (input:string, selectedMuscles:string) => {
    
          realm.write(() => {
            return new ExtraExercises(realm, {
              _id: new BSON.ObjectID,
              extraInformation: selectedMuscles,
              type: "Resistance",
              name: input.trim(),
              userId: user.id,
            })
          })
    
          updateExerciseList()
        }, [realm, user])
    
        const updateExerciseList = () => {
    
          let newList = extraExercises.map(item => item.name ?? "");
          console.log("Updated list: ", newList)
    
          totalExercises = newList.concat(normalExercises)
          console.log(totalExercises)
    
          setFilteredData(totalExercises)
        }

        const addExtraExercisesToSection = () => {

          for(let i = 0; i < extraExercises.length; i++)
            {
              let extraInformation = extraExercises[i].extraInformation ?? ""

              if(extraInformation == "")
                {
                  let section = sections.find(section => section.title == "Other")

                  if(section)
                    {
                      let alreadyExists = section.content.some(item => item.name === extraExercises[i].name)
                      if(alreadyExists) continue

                      let name = extraExercises[i].name ?? ""
                      let newExercise = { name: name }
                      section.content.push(newExercise)
                    }
                  continue
                }


              let muscleGroups = extraInformation.split(",")

              for(let j = 0; j < muscleGroups.length; j++)
                {
                  if(muscleGroups[j] == "") continue;

                  let section = sections.find(section => section.title == muscleGroups[j])

                  if(section)
                    {
                      let name = extraExercises[i].name ?? ""
                      let newExercise = { name: name }
                      section.content.push(newExercise)
                    }

                  section = sections.find(section => section.title == "Other")

                  if(section)
                    {
                      let alreadyExists = section.content.some(item => item.name === extraExercises[i].name)
                      if(alreadyExists) continue
                      
                      let name = extraExercises[i].name ?? ""
                      let newExercise = { name: name }
                      section.content.push(newExercise)
                    }
                }
            }
        }

        useEffect(() => {
          addExtraExercisesToSection()
        })

  const sections = [
    {
      title: "Neck",
      content: [
        { name: "Neck Curls"},
        { name: "Neck Raises"},
        { name: "Side Raises"},
      ],
    },
    {
      title: "Back",
      content: [
        { name: "Bar Pullover"},
        { name: "Barbell Incline Row"},
        { name: "Barbell Row"},
        { name: "Barbell Upright Row"},
        { name: "Cable Row"},
        { name: "Chest Supported Row" },
        { name: "Chin Up"},
        { name: "Clean & Press"},
        { name: "Deadlift"},
        { name: "Dumbbell One Arm Rown"},
        { name: "Farmer Carry"},
        { name: "Good Morning"},
        { name: "Hypeprextension"},
        { name: "Iso-lateral Pulldown"},
        { name: "Iso-lateral Row Machine"},
        { name: "Lat Pulldown"},
        { name: "Pendlay Row"},
        { name: "Pull Up"},
        { name: "Lat Pulldown"},
        { name: "Rope Pullover"},
        { name: "Seated Row Machine"},
        { name: "Single Arm Lat Pulldown"},
        { name: "T-Bar Row"},
        { name: "Weighted Pullup"},
      ]
    },
    {
      title: "Shoulders",
      content: [
        { name: "Arnold Press"},
        { name: "Cable Front Raise"},
        { name: "Cable Lateral Raise"},
        { name: "Cable Rear Delt Fly"},
        { name: "Cable Shoulder Press"},
        { name: "Clean & Press"},
        { name: "Dumbbell Front Raise"},
        { name: "Dumbbell Lateral Raise" },
        { name: "Dumbbell Rear Delt Fly" },
        { name: "Dumbbell Shoulder Press" },
        { name: "External Rotations" },
        { name: "Face Pull" },
        { name: "Internal Rotations" },
        { name: "Lateral Raise Machine" },
        { name: "Military Press" },
        { name: "Rear Delt Fly Machine" },
        { name: "Seated Lateral Raise" },
        { name: "Shoulder Press Machine" },
        { name: "Smit Machine Shoulder Press" },
        { name: "Upright Row" },
      ]
    },
    {
      title: "Chest",
      content: [
        { name: "Barbell Bench Press" },
        { name: "Cable Chest Press" },
        { name: "Cable Crossover" },
        { name: "Cable Fly (high to low)" },
        { name: "Cable Fly (low to high)" },
        { name: "Close Grip Bench Press" },
        { name: "Decline Bench Press" },
        { name: "Decline Dumbbell Press" },
        { name: "Decline Smith Machine Bench Press" },
        { name: "Dips" },
        { name: "Dumbbell Fly" },
        { name: "Dumbbell Press" },
        { name: "Incline Bench Press" },
        { name: "Incline Cable Press" },
        { name: "Incline Dumbbell Fly" },
        { name: "Incline Dumbbell Press" },
        { name: "Incline Smith Machine Press" },
        { name: "Iso-lateral Chest Press" },
        { name: "Pec Deck Machine" },
        { name: "Push Up" },
        { name: "Seated Chest Press Machine" },
        { name: "Smith Machine Bench Press" },
        { name: "Weighted Dips" },
      ]
    },
    {
      title: "Biceps",
      content: [
        { name: "Barbell Bicep Curl" },
        { name: "Barbell Preacher Curl" },
        { name: "Bayesian Curl" },
        { name: "Cable Curl" },
        { name: "Cable Hammer Curl" },
        { name: "Chin Up" },
        { name: "Concentration Curl" },
        { name: "Dumbbell Bicep Curl" },
        { name: "Dumbbell Preacher Curl" },
        { name: "EZ Bar Preacher Curl" },
        { name: "Face Away Cable Curl" },
        { name: "Hammer Curl" },
        { name: "Preacher Curl Machine" },
        { name: "Spider Curl" },
      ]
    },
    {
      title: "Triceps",
      content: [
        { name: "Bar Pushdown" },
        { name: "Barbell Skullcrusher" },
        { name: "Cable Kickback" },
        { name: "Cable Single Arm Extension" },
        { name: "Close Grip Bench Press" },
        { name: "Dips" },
        { name: "Dumbbell Kickback" },
        { name: "Dumbbell Skullcrusher" },
        { name: "Dumbbell Tricep Extension" },
        { name: "EZ Bar Skullcrusher" },
        { name: "Katana Extension" },
        { name: "Diamond Push Up" },
        { name: "Rope Overhead Extension" },
        { name: "Smith Machine JM Press" },
        { name: "Tricep Extension" },
        { name: "Weighted Dips" },
      ]
    },
    {
      title: "Forearms",
      content: [
        { name: "Reverse Barbell Curl" },
        { name: "Reverse Dumbbell Curl" },
        { name: "Wrist Curl" },
      ]
    },
    {
      title: "Core",
      content: [
        { name: "Ab Crunch" },
        { name: "Back Extension" },
        { name: "Cable Crunch" },
        { name: "Ex Oblique Cable Twist" },
        { name: "Farmer Carry" },
        { name: "Good Morning" },
        { name: "Russian Twist" },
        { name: "Sit Up" },
        
      ]
    },
    {
      title: "Quads",
      content: [
        { name: "Barbell Back Squat" },
        { name: "Barbell Front Squat" },
        { name: "Barbell Lunge" },
        { name: "Bodyweight Pistol Squat" },
        { name: "Bulgarian Split Squat" },
        { name: "Clean" },
        { name: "Deadlift" },
        { name: "Dumbbell Lunge" },
        { name: "Goblet Squat" },
        { name: "Hack Squat" },
        { name: "Leg Extension" },
        { name: "Leg Press" },
        { name: "Lunge" },
        { name: "Pendulum Squat" },
        { name: "Reverse Nordic" },
        { name: "Single-Leg Leg Press" },
        { name: "Sled Push" },
        { name: "Smith Machine Squat" },
        { name: "Snatch" },
        { name: "Sumo Deadlift" },
      ]
    },
    {
      title: "Glutes",
      content: [
        { name: "Barbell Back Squat" },
        { name: "Barbell Front Squat" },
        { name: "Barbell Lunge" },
        { name: "Barbell RDL" },
        { name: "Bulgarian Split Squat" },
        { name: "Clean" },
        { name: "Deadlift" },
        { name: "Donkey Kick" },
        { name: "Dumbbell Lunge" },
        { name: "Glute Ham Raise" },
        { name: "Glute Kickback" },
        { name: "Good Morning" },
        { name: "Hip Abductor" },
        { name: "Hip Thrust" },
        { name: "Leg Press" },
        { name: "Lunge" },
        { name: "Romanian Deadlift" },
        { name: "Single-Leg Leg Press" },
        { name: "Sled Push" },
        { name: "Still Leg Deadlift" },
        { name: "Sumo Deadlift" },
      ]
    },
    {
      title: "Hamstrings",
      content: [
        { name: "Barbell Back Squat" },
        { name: "Barbell Lunge" },
        { name: "Barbell RDL" },
        { name: "Bulgarian Split Squat" },
        { name: "Deadlift" },
        { name: "Dumbbell Lunge" },
        { name: "Dumbbell RDL" },
        { name: "Glute Ham Raise" },
        { name: "Good Morning" },
        { name: "Leg Curl" },
        { name: "Lunge" },
        { name: "Lying Leg Curl" },
        { name: "Nordic Curls" },
        { name: "Romanian Deadlift" },
        { name: "Sled Push" },
        { name: "Stiff Leg Deadlift" },
        { name: "Sumo Deadlift" },
        
      ]
    },
    {
      title: "Hip Flexors",
      content: [
        { name: "Hip March" },
        { name: "Lying Reverse Squat" },
      ]
    },
    {
      title: "Groin",
      content: [
        { name: "Hip Adductor" },
      ]
    },
    {
      title: "Calves",
      content: [
        { name: "Seated Calf Raises" },
        { name: "Standing Calf Raises" },
      ]
    },
    {
      title: "Other",
      content: [
        
      ]
    },
    
  ]

  const AccordionView = () => {

    const [collapsed, setCollapsed] = useState<boolean[]>([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true])

    const toggleCollapsed = (index:any) => {
      setCollapsed((prevOpenCollapsibles) => {
        const newOpenCollapsibles = [...prevOpenCollapsibles];
        newOpenCollapsibles[index] = !newOpenCollapsibles[index];
        return newOpenCollapsibles;
      });
    }

      return (
        <>
        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(0)} style={[styles.accordionHeader, {borderTopLeftRadius: 10, borderTopRightRadius: 10} , !collapsed[0] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Neck</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[0]}>
          {
              !collapsed[0] && 
              
              sections[0].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
            
          </Collapsible>
        </View>
        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(1)} style={[styles.accordionHeader, !collapsed[1] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Back</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[1]}>
            {
              !collapsed[1] && 
              
              sections[1].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          
          </Collapsible>
        </View>

        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(2)} style={[styles.accordionHeader, !collapsed[2] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Shoulders</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[2]}>
          {
              !collapsed[2] && 
              
              sections[2].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          </Collapsible>
        </View>
        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(3)} style={[styles.accordionHeader, !collapsed[3] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Chest</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[3]}>
          {
              !collapsed[3] && 
              
              sections[3].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
            
          </Collapsible>
        </View>
        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(4)} style={[styles.accordionHeader, !collapsed[4] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Biceps</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[4]}>
          {
              !collapsed[4] && 
              
              sections[4].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          </Collapsible>
        </View>

        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(5)} style={[styles.accordionHeader, !collapsed[5] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Triceps</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[5]}>
          {
              !collapsed[5] && 
              
              sections[5].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          </Collapsible>
        </View>
        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(6)} style={[styles.accordionHeader, !collapsed[6] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Forearms</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[6]}>
          {
              !collapsed[6] && 
              
              sections[6].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          </Collapsible>
        </View>
        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(7)} style={[styles.accordionHeader, !collapsed[7] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Core</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[7]}>
          {
              !collapsed[7] && 
              
              sections[7].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          </Collapsible>
        </View>

        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(8)} style={[styles.accordionHeader, !collapsed[8] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Quads</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[8]}>
          {
              !collapsed[8] && 
              
              sections[8].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          </Collapsible>
        </View>
        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(9)} style={[styles.accordionHeader, !collapsed[9] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Glutes</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[9]}>
          {
              !collapsed[9] && 
              
              sections[9].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
            
          </Collapsible>
        </View>
        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(10)} style={[styles.accordionHeader, !collapsed[10] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Hip Flexors</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[10]}>
          {
              !collapsed[10] && 
              
              sections[10].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          </Collapsible>
        </View>

        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(11)} style={[styles.accordionHeader, !collapsed[11] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Groin</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[11]}>
          {
              !collapsed[11] && 
              
              sections[11].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          </Collapsible>
        </View>
        <View style={styles.containerAccordion}>
          <TouchableOpacity onPress={() => toggleCollapsed(12)} style={[styles.accordionHeader, !collapsed[12] && {backgroundColor: colors.blue}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Hamstrings</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[12]}>
          {
              !collapsed[12] && 
              
              sections[12].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(13)} style={[styles.accordionHeader, !collapsed[13] && {backgroundColor: colors.blue, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Calves</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[13]}>
          {
              !collapsed[13] && 
              
              sections[13].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion, {marginBottom: 100}]}>
          <TouchableOpacity onPress={() => toggleCollapsed(14)} style={[styles.accordionHeader, {borderBottomRightRadius: 10, borderBottomLeftRadius: 10}, !collapsed[14] && {backgroundColor: colors.blue, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}]}>
            <View>
              <Text style={styles.accordionHeaderText}>Other</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[14]}>
          {
              !collapsed[14] && 
              
              sections[14].content.map((item, index) => (
                <TouchableOpacity key={index} style={styles.accordionContent} onPress={() => {handleAddForm(item.name); setSelectingExercise(false)}}>
                  <Text style={styles.accordionContentText}>{item.name}</Text>
                </TouchableOpacity>
              ))
              
            }
          </Collapsible>
        </View>
        </>
        
      )
  }

  return (
    
    <>
    {
      (!selectingExercise && !addingExercise) && 
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
      (selectingExercise && !addingExercise) &&
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectingExercise(false)}>
            <MaterialCommunityIcons name="arrow-left" color={'white'} size={40} style={{marginLeft: 10, backgroundColor: 'black', borderRadius: 40, padding: 5,}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAddingExercise(true)}>
            <MaterialCommunityIcons name="plus" color={'white'} size={40} style={{marginRight: 10, backgroundColor: 'black', borderRadius: 40, padding: 5,}}/>
        </TouchableOpacity>
      </View>
    }
    

    {
      (selectingExercise && !addingExercise) &&
      <View style={{width: '100%', backgroundColor: colors.black}}>
        <TextInput
        style={{ height: 40, width: '80%', marginRight: 'auto', marginLeft: 'auto', borderColor: 'black', backgroundColor: 'white', borderWidth: 1, borderRadius: 15, marginBottom: 20, padding: 10, }}
        placeholder="Search..."
        value={searchText}
        onChangeText={handleSearch}
        />
        {
          searchText.length > 0 && 
          filteredData.map((item) => (
            <TouchableOpacity key={new BSON.ObjectID().toString()} style={[{ backgroundColor: 'lightgray', borderRadius: 20, padding: 10, marginBottom: 10, width: '80%', marginRight: 'auto', marginLeft: 'auto'}, shadow.shadow]} onPress={() => {handleAddForm(item); setSelectingExercise(false)}}>
              <Text  style={{fontSize: 20, fontWeight: '700', textAlign: 'center'}}>{item}</Text>
            </TouchableOpacity>
            
          ))
        }

        {
          searchText.length == 0 &&
          <AccordionView />
        }
        

        
      </View>
    }
    {
      (!selectingExercise && !addingExercise) &&
    <View style={styles.container}>
        
      {forms.map((form:any, formIndex:any) => (
        <View key={new BSON.ObjectID().toString()} style={styles.form}>
          <Text style={styles.exercise}>{forms[formIndex].exercise.value}</Text>
          <View style={styles.smallBorder}></View>
      {form.inputs.map((input:any, inputIndex:any) => (
        <View key={new BSON.ObjectID().toString()} style={styles.row}>
            <View style={styles.inputs}>
              <View style={styles.inputBoxes}>
              <View style={styles.inputContainer}>
                {
                  inputIndex == 0 &&
                  <Text style={{fontSize: 17, color: 'black', marginBottom: 10, fontWeight: '700'}}>Weight</Text>
                }
                {
                  inputIndex > 0 &&
                  <Text></Text>
                }
                <TextInput
                  placeholder=""
                  value={form.weightInputs[inputIndex].value}
                  onChangeText={(text) => handleWeightInputChange(text, formIndex, inputIndex)}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputContainer}>
                {
                  inputIndex == 0 &&
                  <Text style={{fontSize: 17, color: 'black', marginBottom: 10, fontWeight: '700'}}>Reps</Text>
                }
                {
                  inputIndex > 0 &&
                  <Text></Text>
                }
                <TextInput
                  placeholder=""
                  value={form.repInputs[inputIndex].value}
                  onChangeText={(text) => handleRepInputChange(text, formIndex, inputIndex)}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
              </View>
              
              
              <View style={styles.inputContainer}>
                <Text></Text>
                <View style={styles.removeButtonContainer}>
                  <TouchableOpacity onPress={() => handleRemoveInput(formIndex, inputIndex)} style={styles.removeButton}>
                  <MaterialCommunityIcons name="delete" color={colors.red} size={30} style={{borderRadius: 40}}/>
                  </TouchableOpacity>
                </View>
              </View>
              
            </View>
            
              
        </View>
      ))}
      
      <View style={styles.rowButtons}>
        <TouchableOpacity onPress={() => handleAddInput(formIndex)} style={[styles.addButton, shadow.shadow]}>
          <Text style={{color: 'gray', fontWeight: '800', fontSize: 15}}>Add Set</Text>
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
      
    </View>
    }

    {
      addingExercise &&
      <AddExerciseScreen addExercise={addExercise} exit={exitExerciseManipulation}/>
    }
    </>
  
)};