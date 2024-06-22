import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Animated} from 'react-native';
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
import { useNavigation } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp } from '@react-navigation/native';
import Modal from 'react-native-modal';

type LogWorkoutResistanceProps = {
  navigation: StackNavigationProp<RootStackParamList, 'LogWorkoutResistance'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'LogWorkoutResistance'>;
};

export const LogWorkoutResistanceScreen = ({ navigation, route}: LogWorkoutResistanceProps) => {
  const realm = useRealm();
  const user = useUser();

  const { continuingWorkout } = route.params;

  const goBack = () => {
    navigation.goBack()
  }

  const goToSubmitCompletion = (levelUp:boolean, gainedXp:number) => {
    navigation.navigate("SubmitCompletion", {levelUp: levelUp, gainedXp: gainedXp})
  }

  const goToAddExercise = () => {
    navigation.navigate("AddExercise")
  }

  const goToEditExercise = (exerciseId:string) => {
    navigation.navigate("EditResistanceExercise", { exercise: exerciseId })
  }

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

  const getExerciseName = (id:string) => {
    const exercise = extraExercises.filtered("userId == $0 AND exerciseId == $1", user.id, id)

    if(exercise.length == 0)
    {
      for (let section of sections) {
        let exercise = section.content.find(ex => ex.id === id);
        if (exercise) {
          return exercise.name
        }
      }
      return ""; // Return null if the exercise is not found
    }
  
    else
    {
      return exercise[0].name ?? ""
    }

    
  } 

  const convertIdToName = (id:string) => {
    console.log("id: ", id)

    let name = getExerciseName(id)

    console.log("name: ", name)

    return name;
  }


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

    console.log("exercise: ", exercise)

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
    if(continuingWorkout)
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

    goToSubmitCompletion(levelUp, (totalReps + totalVolume + 100))
    
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

      const addedExercisesArray = extraExercises.map(item => (getExerciseName(item.exerciseId) + "+" + item.exerciseId));
      let totalExercises = addedExercisesArray.concat(normalExercises);

      console.log(totalExercises)
      
    
      const [searchText, setSearchText] = useState<string>('')
      const [filteredData, setFilteredData] = useState<string[]>(addedExercisesArray.concat(normalExercises));
      //console.log(filteredData)
    
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

      const addExtraExercisesToSection = () => {

        for(let i = 0; i < extraExercises.length; i++)
          {
            let extraInformation = extraExercises[i].extraInformation ?? ""
            //console.log(extraExercises[i])

            if(extraInformation == "")
              {
                let section = sections.find(section => section.title == "Other")

                if(section)
                  {
                    let alreadyExists = section.content.some(item => item.name === getExerciseName(extraExercises[i].exerciseId))
                    if(alreadyExists) continue

                    let name = getExerciseName(extraExercises[i].exerciseId)
                    let newExercise = { id: extraExercises[i].exerciseId, name: name }
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
                    let name = getExerciseName(extraExercises[i].exerciseId)
                    let newExercise = { id: extraExercises[i].exerciseId, name: name }
                    section.content.push(newExercise)
                  }

                section = sections.find(section => section.title == "Other")

                if(section)
                  {
                    let alreadyExists = section.content.some(item => item.name === getExerciseName(extraExercises[i].exerciseId))
                    if(alreadyExists) continue
                    
                    let name = getExerciseName(extraExercises[i].exerciseId)
                    let newExercise = { id: extraExercises[i].exerciseId, name: name }
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
            { id: "0", name: "Neck Curls" },
            { id: "1", name: "Neck Raises" },
            { id: "2", name: "Side Raises" },
          ],
        },
        {
          title: "Back",
          content: [
            { id: "3", name: "Bar Pullover" },
            { id: "4", name: "Barbell Incline Row" },
            { id: "5", name: "Barbell Row" },
            { id: "6", name: "Barbell Upright Row" },
            { id: "7", name: "Cable Row" },
            { id: "8", name: "Chest Supported Row" },
            { id: "9", name: "Chin Up" },
            { id: "10", name: "Clean & Press" },
            { id: "11", name: "Deadlift" },
            { id: "12", name: "Dumbbell One Arm Row" },
            { id: "13", name: "Farmer Carry" },
            { id: "14", name: "Good Morning" },
            { id: "15", name: "Hyperextension" },
            { id: "16", name: "Iso-lateral Pulldown" },
            { id: "17", name: "Iso-lateral Row Machine" },
            { id: "18", name: "Lat Pulldown" },
            { id: "19", name: "Pendlay Row" },
            { id: "20", name: "Pull Up" },
            { id: "21", name: "Lat Pulldown" },
            { id: "22", name: "Rope Pullover" },
            { id: "23", name: "Seated Row Machine" },
            { id: "24", name: "Single Arm Lat Pulldown" },
            { id: "25", name: "T-Bar Row" },
            { id: "26", name: "Weighted Pullup" },
          ]
        },
        {
          title: "Shoulders",
          content: [
            { id: "27", name: "Arnold Press" },
            { id: "28", name: "Cable Front Raise" },
            { id: "29", name: "Cable Lateral Raise" },
            { id: "30", name: "Cable Rear Delt Fly" },
            { id: "31", name: "Cable Shoulder Press" },
            { id: "32", name: "Clean & Press" },
            { id: "33", name: "Dumbbell Front Raise" },
            { id: "34", name: "Dumbbell Lateral Raise" },
            { id: "35", name: "Dumbbell Rear Delt Fly" },
            { id: "36", name: "Dumbbell Shoulder Press" },
            { id: "37", name: "External Rotations" },
            { id: "38", name: "Face Pull" },
            { id: "39", name: "Internal Rotations" },
            { id: "40", name: "Lateral Raise Machine" },
            { id: "41", name: "Military Press" },
            { id: "42", name: "Rear Delt Fly Machine" },
            { id: "43", name: "Seated Lateral Raise" },
            { id: "44", name: "Shoulder Press Machine" },
            { id: "45", name: "Smith Machine Shoulder Press" },
            { id: "46", name: "Upright Row" },
          ]
        },
        {
          title: "Chest",
          content: [
            { id: "47", name: "Barbell Bench Press" },
            { id: "48", name: "Cable Chest Press" },
            { id: "49", name: "Cable Crossover" },
            { id: "50", name: "Cable Fly (high to low)" },
            { id: "51", name: "Cable Fly (low to high)" },
            { id: "52", name: "Close Grip Bench Press" },
            { id: "53", name: "Decline Bench Press" },
            { id: "54", name: "Decline Dumbbell Press" },
            { id: "55", name: "Decline Smith Machine Bench Press" },
            { id: "56", name: "Dips" },
            { id: "57", name: "Dumbbell Fly" },
            { id: "58", name: "Dumbbell Press" },
            { id: "59", name: "Incline Bench Press" },
            { id: "60", name: "Incline Cable Press" },
            { id: "61", name: "Incline Dumbbell Fly" },
            { id: "62", name: "Incline Dumbbell Press" },
            { id: "63", name: "Incline Smith Machine Press" },
            { id: "64", name: "Iso-lateral Chest Press" },
            { id: "65", name: "Pec Deck Machine" },
            { id: "66", name: "Push Up" },
            { id: "67", name: "Seated Chest Press Machine" },
            { id: "68", name: "Smith Machine Bench Press" },
            { id: "69", name: "Weighted Dips" },
          ]
        },
        {
          title: "Biceps",
          content: [
            { id: "70", name: "Barbell Bicep Curl" },
            { id: "71", name: "Barbell Preacher Curl" },
            { id: "72", name: "Bayesian Curl" },
            { id: "73", name: "Cable Curl" },
            { id: "74", name: "Cable Hammer Curl" },
            { id: "75", name: "Chin Up" },
            { id: "76", name: "Concentration Curl" },
            { id: "77", name: "Dumbbell Bicep Curl" },
            { id: "78", name: "Dumbbell Preacher Curl" },
            { id: "79", name: "EZ Bar Preacher Curl" },
            { id: "80", name: "Face Away Cable Curl" },
            { id: "81", name: "Hammer Curl" },
            { id: "82", name: "Preacher Curl Machine" },
            { id: "83", name: "Spider Curl" },
          ]
        },
        {
          title: "Triceps",
          content: [
            { id: "84", name: "Bar Pushdown" },
            { id: "85", name: "Barbell Skullcrusher" },
            { id: "86", name: "Cable Kickback" },
            { id: "87", name: "Cable Single Arm Extension" },
            { id: "88", name: "Close Grip Bench Press" },
            { id: "89", name: "Dips" },
            { id: "90", name: "Dumbbell Kickback" },
            { id: "91", name: "Dumbbell Skullcrusher" },
            { id: "92", name: "Dumbbell Tricep Extension" },
            { id: "93", name: "EZ Bar Skullcrusher" },
            { id: "94", name: "Katana Extension" },
            { id: "95", name: "Diamond Push Up" },
            { id: "96", name: "Rope Overhead Extension" },
            { id: "97", name: "Smith Machine JM Press" },
            { id: "98", name: "Tricep Extension" },
            { id: "99", name: "Weighted Dips" },
          ]
        },
        {
          title: "Forearms",
          content: [
            { id: "100", name: "Reverse Barbell Curl" },
            { id: "101", name: "Reverse Dumbbell Curl" },
            { id: "102", name: "Wrist Curl" },
          ]
        },
        {
          title: "Core",
          content: [
            { id: "103", name: "Ab Crunch" },
            { id: "104", name: "Back Extension" },
            { id: "105", name: "Cable Crunch" },
            { id: "106", name: "Ex Oblique Cable Twist" },
            { id: "107", name: "Farmer Carry" },
            { id: "108", name: "Good Morning" },
            { id: "109", name: "Russian Twist" },
            { id: "110", name: "Sit Up" },
          ]
        },
        {
          title: "Quads",
          content: [
            { id: "111", name: "Barbell Back Squat" },
            { id: "112", name: "Barbell Front Squat" },
            { id: "113", name: "Barbell Lunge" },
            { id: "114", name: "Bodyweight Pistol Squat" },
            { id: "115", name: "Bulgarian Split Squat" },
            { id: "116", name: "Clean" },
            { id: "117", name: "Deadlift" },
            { id: "118", name: "Dumbbell Lunge" },
            { id: "119", name: "Goblet Squat" },
            { id: "120", name: "Hack Squat" },
            { id: "121", name: "Leg Extension" },
            { id: "122", name: "Leg Press" },
            { id: "123", name: "Lunge" },
            { id: "124", name: "Pendulum Squat" },
            { id: "125", name: "Reverse Nordic" },
            { id: "126", name: "Single-Leg Leg Press" },
            { id: "127", name: "Sled Push" },
            { id: "128", name: "Smith Machine Squat" },
            { id: "129", name: "Snatch" },
            { id: "130", name: "Sumo Deadlift" },
          ]
        },
        {
          title: "Glutes",
          content: [
            { id: "131", name: "Barbell Back Squat" },
            { id: "132", name: "Barbell Front Squat" },
            { id: "133", name: "Barbell Lunge" },
            { id: "134", name: "Barbell RDL" },
            { id: "135", name: "Bulgarian Split Squat" },
            { id: "136", name: "Clean" },
            { id: "137", name: "Deadlift" },
            { id: "138", name: "Donkey Kick" },
            { id: "139", name: "Dumbbell Lunge" },
            { id: "140", name: "Glute Ham Raise" },
            { id: "141", name: "Glute Kickback" },
            { id: "142", name: "Good Morning" },
            { id: "143", name: "Hip Abductor" },
            { id: "144", name: "Hip Thrust" },
            { id: "145", name: "Leg Press" },
            { id: "146", name: "Lunge" },
            { id: "147", name: "Romanian Deadlift" },
            { id: "148", name: "Single-Leg Leg Press" },
            { id: 149, name: "Sled Push" },
            { id: 150, name: "Stiff Leg Deadlift" },
            { id: 151, name: "Sumo Deadlift" },
          ]
        },
        {
          title: "Hamstrings",
          content: [
            { id: "152", name: "Barbell Back Squat" },
            { id: "153", name: "Barbell Lunge" },
            { id: "154", name: "Barbell RDL" },
            { id: "155", name: "Bulgarian Split Squat" },
            { id: "156", name: "Deadlift" },
            { id: "157", name: "Dumbbell Lunge" },
            { id: "158", name: "Dumbbell RDL" },
            { id: "159", name: "Glute Ham Raise" },
            { id: "160", name: "Good Morning" },
            { id: "161", name: "Leg Curl" },
            { id: "162", name: "Lunge" },
            { id: "163", name: "Lying Leg Curl" },
            { id: "164", name: "Nordic Curls" },
            { id: "165", name: "Romanian Deadlift" },
            { id: "166", name: "Sled Push" },
            { id: "167", name: "Stiff Leg Deadlift" },
            { id: "168", name: "Sumo Deadlift" },
          ]
        },
        {
          title: "Hip Flexors",
          content: [
            { id: "169", name: "Hip March" },
            { id: "170", name: "Lying Reverse Squat" },
          ]
        },
        {
          title: "Groin",
          content: [
            { id: "171", name: "Hip Adductor" },
          ]
        },
        {
          title: "Calves",
          content: [
            { id: "172", name: "Seated Calf Raises" },
            { id: "173", name: "Standing Calf Raises" },
          ]
        },
        {
          title: "Other",
          content: [
            // Additional exercises can be added here
          ]
        },
      ];
      

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
                <>
                {
                  (item.id as string).length > 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length >= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length > 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length >= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length >= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length >= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length > 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length > 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length > 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length > 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length > 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length > 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length > 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length > 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
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
                <>
                {
                  (item.id as string).length > 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }} onLongPress={() => {setSelectedExercise(item.id as string); setVisibleOptions(true); }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                {
                  (item.id as string).length <= 3 &&
                  <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.accordionContent} onPress={() => { 
                      handleAddForm(item.id as string)
                      setSelectingExercise(false)
                    }}>
                    <Text style={styles.accordionContentText}>{item.name}</Text>
                  </TouchableOpacity>
                }
                
                </>
                
          ))
              
            }
          </Collapsible>
        </View>
        </>
        
      )
  }

  const scrollViewRef = useRef<ScrollView | null>(null)

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }

  const deleteExercise = (exerciseId:string) => {

    const exercise = realm.objects(ExtraExercises).filtered("exerciseId == $0", exerciseId)

    realm.write(() => {
      realm.delete(exercise)
    })
  }

  const [visibleOptions, setVisibleOptions] = useState<boolean>(false)
  const [selectedExercise, setSelectedExercise] = useState<string>('')

  const onClose = () => {

    setVisibleOptions(false)
  }

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
        <TouchableOpacity onPress={goToAddExercise}>
            <MaterialCommunityIcons name="plus" color={'white'} size={40} style={{marginRight: 10, backgroundColor: 'black', borderRadius: 40, padding: 5,}}/>
        </TouchableOpacity>
      </View>
    }

    
    

    {
      selectingExercise &&
      <>
      <View style={{backgroundColor: colors.black}}>
        <TextInput
          style={{ height: 40, width: '80%', marginRight: 'auto', marginLeft: 'auto', borderColor: 'black', backgroundColor: 'white', borderWidth: 1, borderRadius: 15, marginBottom: 20, padding: 10, }}
          placeholder="Search..."
          value={searchText}
          onChangeText={handleSearch}
          />
      </View>
      
      <ScrollView style={{width: '100%', backgroundColor: colors.black}}>
        
        {
          searchText.length > 0 && 
          filteredData.map((item) => (
            <TouchableOpacity key={new BSON.ObjectID().toString()} style={[{ backgroundColor: 'lightgray', borderRadius: 20, padding: 10, marginBottom: 10, width: '80%', marginRight: 'auto', marginLeft: 'auto'}, shadow.shadow]} onPress={() => {
              if(item.includes("+"))
              {
                let id = item.split("+")[1]
                handleAddForm(id)
                setSelectingExercise(false)
              }
              else
              {
                handleAddForm(item)
                setSelectingExercise(false)
              }
              }} onLongPress={() => {
                if(item.includes("+"))
                {
                  setSelectedExercise(item.split("+")[1])
                  setVisibleOptions(true)
                }
              }}>
                {
                  item.includes("+") &&
                  <Text  style={{fontSize: 20, fontWeight: '700', textAlign: 'center'}}>{item.split("+")[0]}</Text>
                }
                {
                  !item.includes("+") &&
                  <Text  style={{fontSize: 20, fontWeight: '700', textAlign: 'center'}}>{item}</Text>
                }
            </TouchableOpacity>
            
          ))
        }

        {
          searchText.length == 0 &&
          <AccordionView />
        }
        

        
      </ScrollView>
      </>
    }
    {
      !selectingExercise &&
     
    <View style={styles.container}>
       <ScrollView ref={scrollViewRef}>
        
      {forms.map((form:any, formIndex:any) => (
        <View key={new BSON.ObjectID().toString()} style={styles.form}>
          <Text style={styles.exercise}>{convertIdToName(forms[formIndex].exercise.value)}</Text>
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
      
      </ScrollView>
    </View>
    }

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