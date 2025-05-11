import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Animated, FlatList, Dimensions, Keyboard} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {BSON, index} from 'realm';
import {useUser, useRealm, useQuery, useObject} from '@realm/react';
import {ResistanceWorkout} from '../../schemas/ResistanceWorkoutSchema';
import {Workouts} from '../../schemas/WorkoutSchema';
import {UserStatistics} from '../../schemas/UserStatisticsSchema';
import {ExtraExercises} from '../../schemas/ExtraExercisesSchema';
import {shadow} from '../../sharedStyling/Shadow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Collapsible from 'react-native-collapsible';
import {AddExerciseScreen} from '../AddExerciseScreen/AddExerciseScreen';
import styles from './ResistanceSetsSummaryScreen.style';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {Users} from '../../schemas/UsersSchema';
import {common} from '../../sharedStyling/CommonStyle';

type ResistanceSetsSummaryScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ResistanceSetsSummary'>; // Adjust according to your navigation stack
};

export const ResistanceSetsSummaryScreen = ({navigation}: ResistanceSetsSummaryScreenProps) => {
  const realm = useRealm();
  const user = useUser();
  const isFocused = useIsFocused();

  const goBackHome = () => {
    navigation.navigate('LogWorkout');
  };

  const editSets = (exerciseIndex: number, exerciseId: string) => {
    navigation.navigate('AddResistanceExerciseSets', {
      exerciseId: exerciseId,
      formIndex: exerciseIndex,
    });
  };

  const addExercise = () => {
    navigation.navigate('AddResistanceExercise', {firstVisit: false});
  };

  const goToSubmitCompletion = (levelUp: boolean, xp: number) => {
    navigation.navigate('SubmitCompletion', {
      levelUp: levelUp,
      gainedXp: xp,
      navigationScreen: 'LogWorkout',
    });
  };

  const extraExercises = useQuery(ExtraExercises).filtered('userId == $0 && type == $1', user.id, 'Resistance');
  const userData = useQuery(Users).filtered('userId == $0', user.id);
  const userStatistics = useQuery(UserStatistics).filtered('userId == $0', user.id);
  const [currentWorkout, setcurrentWorkout] = useState<any>([]);
  const [collapsed, setCollapsed] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [workoutName, setWorkoutName] = useState<string>('');
  const [workoutDate, setWorkoutDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;

    console.log(currentDate);

    // Run your function here based on event.type === "set" (OK button pressed)
    if (event.type === 'set') {
      // Call your function here
      console.log('Selected date:', currentDate);
      setShowDatePicker(false);
      setWorkoutDate(currentDate);
    }

    if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
  });

  const loadCurrentWorkout = async () => {
    try {
      await storage
        .load({
          key: 'currentWorkoutResistance',
        })
        .then(ret => {
          setcurrentWorkout(ret.currentWorkout);
          console.log('Current Workout Sets Summary: ', ret.currentWorkout);
          createCollapsedArray(ret.currentWorkout.length);
        })
        .catch(err => {
          console.warn(err.message);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const saveCurrentWorkout = (currentWorkout: any[]) => {
    storage.save({
      key: 'currentWorkoutResistance',
      data: {
        currentWorkout: currentWorkout,
      },
    });
  };

  const createCollapsedArray = (length: number) => {
    let collapsedArray = [];
    for (let i = 0; i < length; i++) {
      collapsedArray.push(true);
    }

    setCollapsed(collapsedArray);

    console.log(collapsedArray);
  };

  const toggleCollapsed = (index: number) => {
    let collapsedArray = [...collapsed];

    collapsedArray[index] = !collapsedArray[index];

    setCollapsed(collapsedArray);
  };

  const collapseAll = () => {
    let newCollapsed = [...collapsed];

    for (let i = 0; i < collapsed.length; i++) {
      newCollapsed[i] = true;
    }

    setCollapsed(newCollapsed);
  };

  const calculateTotalSets = (exerciseIndex: number) => {
    return currentWorkout[exerciseIndex].inputs.length.toString();
  };

  const calculateTotalVolume = (exerciseIndex: number) => {
    let repsArray = currentWorkout[exerciseIndex].repInputs;
    let weightsArray = currentWorkout[exerciseIndex].weightInputs;

    let totalVolume = 0;

    for (let i = 0; i < weightsArray.length; i++) {
      totalVolume += parseFloat(repsArray[i].value) * parseFloat(weightsArray[i].value);
    }

    if (userData[0].preferences) {
      if (userData[0].preferences[0] == 'lbs') {
        return totalVolume.toFixed(2).toString() + ' lbs';
      }
    }

    return totalVolume.toString() + ' kg';
  };

  const calculateTotalReps = (exerciseIndex: number) => {
    let repsArray = currentWorkout[exerciseIndex].repInputs;
    let totalReps = 0;

    for (let i = 0; i < repsArray.length; i++) {
      totalReps += parseInt(repsArray[i].value);
    }

    return totalReps.toString();
  };

  const deleteExerciseFromWorkout = (exerciseIndex: number) => {
    let currentWorkoutArray = [...currentWorkout];

    currentWorkoutArray.splice(exerciseIndex, 1);

    setcurrentWorkout(currentWorkoutArray);

    saveCurrentWorkout(currentWorkoutArray);
  };

  useEffect(() => {
    loadCurrentWorkout();
  }, []);

  const getExerciseName = (id: string) => {
    const exercise = realm.objects(ExtraExercises).filtered('exerciseId == $0', id);
    //console.log("Found exercise: ", exercise)

    if (exercise.length > 0) {
      return exercise[0].name ?? '';
    } else {
      for (let i = 0; i < sections.length; i++) {
        for (let j = 0; j < sections[i].content.length; j++) {
          if (id == sections[i].content[j].id) {
            return sections[i].content[j].name;
          }
        }
      }
    }
  };

  const addExtraExercisesToSection = () => {
    for (let i = 0; i < extraExercises.length; i++) {
      let extraInformation = extraExercises[i].extraInformation ?? '';
      //console.log(extraExercises[i])

      if (extraInformation == '') {
        let section = exerciseSections.find(section => section.title == 'Other');

        if (section) {
          let alreadyExists = section.content.some(item => item.name === getExerciseName(extraExercises[i].exerciseId));
          if (alreadyExists) continue;

          let name = getExerciseName(extraExercises[i].exerciseId) ?? '';
          let newExercise = {id: extraExercises[i].exerciseId, name: name};
          section.content.push(newExercise);
        }
        continue;
      }

      let muscleGroups = extraInformation.split(',');
      //console.log(muscleGroups)

      for (let j = 0; j < muscleGroups.length; j++) {
        //console.log(muscleGroups[j])
        if (muscleGroups[j] == '') {
          continue;
        }

        let section = exerciseSections.find(section => section.title == muscleGroups[j]);

        if (section) {
          let name = getExerciseName(extraExercises[i].exerciseId) ?? '';
          let newExercise = {id: extraExercises[i].exerciseId, name: name};
          section.content.push(newExercise);
        }

        section = exerciseSections.find(section => section.title == 'Other');

        if (section) {
          let alreadyExists = section.content.some(item => item.name === getExerciseName(extraExercises[i].exerciseId));
          if (alreadyExists) {
            continue;
          }

          let name = getExerciseName(extraExercises[i].exerciseId) ?? '';
          let newExercise = {id: extraExercises[i].exerciseId, name: name};
          section.content.push(newExercise);
        }
      }
    }

    setSections(exerciseSections);
    //console.log(exerciseSections[14])
  };

  const exerciseSections = [
    {
      title: 'Neck',
      content: [
        {id: '0', name: 'Neck Curls'},
        {id: '1', name: 'Neck Raises'},
        {id: '2', name: 'Side Raises'},
      ],
    },
    {
      title: 'Back',
      content: [
        {id: '3', name: 'Bar Pullover'},
        {id: '4', name: 'Barbell Incline Row'},
        {id: '5', name: 'Barbell Row'},
        {id: '6', name: 'Barbell Upright Row'},
        {id: '7', name: 'Cable Row'},
        {id: '8', name: 'Chest Supported Row'},
        {id: '9', name: 'Chin Up'},
        {id: '10', name: 'Clean & Press'},
        {id: '11', name: 'Deadlift'},
        {id: '12', name: 'Dumbbell One Arm Row'},
        {id: '13', name: 'Farmer Carry'},
        {id: '14', name: 'Good Morning'},
        {id: '15', name: 'Hyperextension'},
        {id: '16', name: 'Iso-lateral Pulldown'},
        {id: '17', name: 'Iso-lateral Row Machine'},
        {id: '18', name: 'Lat Pulldown'},
        {id: '19', name: 'Pendlay Row'},
        {id: '20', name: 'Pull Up'},
        {id: '21', name: 'Lat Pulldown'},
        {id: '22', name: 'Rope Pullover'},
        {id: '23', name: 'Seated Row Machine'},
        {id: '24', name: 'Single Arm Lat Pulldown'},
        {id: '25', name: 'T-Bar Row'},
        {id: '26', name: 'Weighted Pullup'},
      ],
    },
    {
      title: 'Shoulders',
      content: [
        {id: '27', name: 'Arnold Press'},
        {id: '28', name: 'Cable Front Raise'},
        {id: '29', name: 'Cable Lateral Raise'},
        {id: '30', name: 'Cable Rear Delt Fly'},
        {id: '31', name: 'Cable Shoulder Press'},
        {id: '32', name: 'Clean & Press'},
        {id: '33', name: 'Dumbbell Front Raise'},
        {id: '34', name: 'Dumbbell Lateral Raise'},
        {id: '35', name: 'Dumbbell Rear Delt Fly'},
        {id: '36', name: 'Dumbbell Shoulder Press'},
        {id: '37', name: 'External Rotations'},
        {id: '38', name: 'Face Pull'},
        {id: '39', name: 'Internal Rotations'},
        {id: '40', name: 'Lateral Raise Machine'},
        {id: '41', name: 'Military Press'},
        {id: '42', name: 'Rear Delt Fly Machine'},
        {id: '43', name: 'Seated Lateral Raise'},
        {id: '44', name: 'Shoulder Press Machine'},
        {id: '45', name: 'Smith Machine Shoulder Press'},
        {id: '46', name: 'Upright Row'},
      ],
    },
    {
      title: 'Chest',
      content: [
        {id: '47', name: 'Barbell Bench Press'},
        {id: '48', name: 'Cable Chest Press'},
        {id: '49', name: 'Cable Crossover'},
        {id: '50', name: 'Cable Fly (high to low)'},
        {id: '51', name: 'Cable Fly (low to high)'},
        {id: '52', name: 'Close Grip Bench Press'},
        {id: '53', name: 'Decline Bench Press'},
        {id: '54', name: 'Decline Dumbbell Press'},
        {id: '55', name: 'Decline Smith Machine Bench Press'},
        {id: '56', name: 'Dips'},
        {id: '57', name: 'Dumbbell Fly'},
        {id: '58', name: 'Dumbbell Press'},
        {id: '59', name: 'Incline Bench Press'},
        {id: '60', name: 'Incline Cable Press'},
        {id: '61', name: 'Incline Dumbbell Fly'},
        {id: '62', name: 'Incline Dumbbell Press'},
        {id: '63', name: 'Incline Smith Machine Press'},
        {id: '64', name: 'Iso-lateral Chest Press'},
        {id: '65', name: 'Pec Deck Machine'},
        {id: '66', name: 'Push Up'},
        {id: '67', name: 'Seated Chest Press Machine'},
        {id: '68', name: 'Smith Machine Bench Press'},
        {id: '69', name: 'Weighted Dips'},
      ],
    },
    {
      title: 'Biceps',
      content: [
        {id: '70', name: 'Barbell Bicep Curl'},
        {id: '71', name: 'Barbell Preacher Curl'},
        {id: '72', name: 'Bayesian Curl'},
        {id: '73', name: 'Cable Curl'},
        {id: '74', name: 'Cable Hammer Curl'},
        {id: '75', name: 'Chin Up'},
        {id: '76', name: 'Concentration Curl'},
        {id: '77', name: 'Dumbbell Bicep Curl'},
        {id: '78', name: 'Dumbbell Preacher Curl'},
        {id: '79', name: 'EZ Bar Preacher Curl'},
        {id: '80', name: 'Face Away Cable Curl'},
        {id: '81', name: 'Hammer Curl'},
        {id: '82', name: 'Preacher Curl Machine'},
        {id: '83', name: 'Spider Curl'},
      ],
    },
    {
      title: 'Triceps',
      content: [
        {id: '84', name: 'Bar Pushdown'},
        {id: '85', name: 'Barbell Skullcrusher'},
        {id: '86', name: 'Cable Kickback'},
        {id: '87', name: 'Cable Single Arm Extension'},
        {id: '88', name: 'Close Grip Bench Press'},
        {id: '89', name: 'Dips'},
        {id: '90', name: 'Dumbbell Kickback'},
        {id: '91', name: 'Dumbbell Skullcrusher'},
        {id: '92', name: 'Dumbbell Tricep Extension'},
        {id: '93', name: 'EZ Bar Skullcrusher'},
        {id: '94', name: 'Katana Extension'},
        {id: '95', name: 'Diamond Push Up'},
        {id: '96', name: 'Rope Overhead Extension'},
        {id: '97', name: 'Smith Machine JM Press'},
        {id: '98', name: 'Tricep Extension'},
        {id: '99', name: 'Weighted Dips'},
      ],
    },
    {
      title: 'Forearms',
      content: [
        {id: '100', name: 'Reverse Barbell Curl'},
        {id: '101', name: 'Reverse Dumbbell Curl'},
        {id: '102', name: 'Wrist Curl'},
      ],
    },
    {
      title: 'Core',
      content: [
        {id: '103', name: 'Ab Crunch'},
        {id: '104', name: 'Back Extension'},
        {id: '105', name: 'Cable Crunch'},
        {id: '106', name: 'Ex Oblique Cable Twist'},
        {id: '107', name: 'Farmer Carry'},
        {id: '108', name: 'Good Morning'},
        {id: '109', name: 'Russian Twist'},
        {id: '110', name: 'Sit Up'},
      ],
    },
    {
      title: 'Quads',
      content: [
        {id: '111', name: 'Barbell Back Squat'},
        {id: '112', name: 'Barbell Front Squat'},
        {id: '113', name: 'Barbell Lunge'},
        {id: '114', name: 'Bodyweight Pistol Squat'},
        {id: '115', name: 'Bulgarian Split Squat'},
        {id: '116', name: 'Clean'},
        {id: '117', name: 'Deadlift'},
        {id: '118', name: 'Dumbbell Lunge'},
        {id: '119', name: 'Goblet Squat'},
        {id: '120', name: 'Hack Squat'},
        {id: '121', name: 'Leg Extension'},
        {id: '122', name: 'Leg Press'},
        {id: '123', name: 'Lunge'},
        {id: '124', name: 'Pendulum Squat'},
        {id: '125', name: 'Reverse Nordic'},
        {id: '126', name: 'Single-Leg Leg Press'},
        {id: '127', name: 'Sled Push'},
        {id: '128', name: 'Smith Machine Squat'},
        {id: '129', name: 'Snatch'},
        {id: '130', name: 'Sumo Deadlift'},
      ],
    },
    {
      title: 'Glutes',
      content: [
        {id: '131', name: 'Barbell Back Squat'},
        {id: '132', name: 'Barbell Front Squat'},
        {id: '133', name: 'Barbell Lunge'},
        {id: '134', name: 'Barbell RDL'},
        {id: '135', name: 'Bulgarian Split Squat'},
        {id: '136', name: 'Clean'},
        {id: '137', name: 'Deadlift'},
        {id: '138', name: 'Donkey Kick'},
        {id: '139', name: 'Dumbbell Lunge'},
        {id: '140', name: 'Glute Ham Raise'},
        {id: '141', name: 'Glute Kickback'},
        {id: '142', name: 'Good Morning'},
        {id: '143', name: 'Hip Abductor'},
        {id: '144', name: 'Hip Thrust'},
        {id: '145', name: 'Leg Press'},
        {id: '146', name: 'Lunge'},
        {id: '147', name: 'Romanian Deadlift'},
        {id: '148', name: 'Single-Leg Leg Press'},
        {id: 149, name: 'Sled Push'},
        {id: 150, name: 'Stiff Leg Deadlift'},
        {id: 151, name: 'Sumo Deadlift'},
      ],
    },
    {
      title: 'Hamstrings',
      content: [
        {id: '152', name: 'Barbell Back Squat'},
        {id: '153', name: 'Barbell Lunge'},
        {id: '154', name: 'Barbell RDL'},
        {id: '155', name: 'Bulgarian Split Squat'},
        {id: '156', name: 'Deadlift'},
        {id: '157', name: 'Dumbbell Lunge'},
        {id: '158', name: 'Dumbbell RDL'},
        {id: '159', name: 'Glute Ham Raise'},
        {id: '160', name: 'Good Morning'},
        {id: '161', name: 'Leg Curl'},
        {id: '162', name: 'Lunge'},
        {id: '163', name: 'Lying Leg Curl'},
        {id: '164', name: 'Nordic Curls'},
        {id: '165', name: 'Romanian Deadlift'},
        {id: '166', name: 'Sled Push'},
        {id: '167', name: 'Stiff Leg Deadlift'},
        {id: '168', name: 'Sumo Deadlift'},
      ],
    },
    {
      title: 'Hip Flexors',
      content: [
        {id: '169', name: 'Hip March'},
        {id: '170', name: 'Lying Reverse Squat'},
      ],
    },
    {
      title: 'Groin',
      content: [{id: '171', name: 'Hip Adductor'}],
    },
    {
      title: 'Calves',
      content: [
        {id: '172', name: 'Seated Calf Raises'},
        {id: '173', name: 'Standing Calf Raises'},
      ],
    },
    {
      title: 'Other',
      content: [
        // Additional exercises can be added here
      ],
    },
  ];

  const [sections, setSections] = useState<any[]>(exerciseSections);

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
          onPress: () => {
            storage.remove({key: 'currentWorkoutResistance'});
            goBackHome();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleDeleteExerciseFromWorkout = (exerciseIndex: number) => {
    console.log('delete');
    // Show confirmation popup
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to delete this exercise from your workout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            deleteExerciseFromWorkout(exerciseIndex);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const submitData = () => {
    if (workoutName.length == 0) {
      Alert.alert('Please enter workout name!');
      return;
    }

    let weights: string[] = [];
    let reps: string[] = [];
    let exercises: string[] = [];

    let totalReps = 0;
    let totalVolume = 0;
    let allExercises: string[] = [];

    for (let i = 0; i < currentWorkout.length; i++) {
      if (userData[0].preferences) {
        if (userData[0].preferences[0] == 'lbs') {
          for (let j = 0; j < currentWorkout[i].weightInputs.length; j++) {
            let weight = parseFloat(currentWorkout[i].weightInputs[j].value);

            currentWorkout[i].weightInputs[j].value = (weight * 0.453592).toFixed(2);
          }
        }
      }

      weights.push(JSON.stringify(currentWorkout[i].weightInputs));
      reps.push(JSON.stringify(currentWorkout[i].repInputs));
      exercises.push(JSON.stringify(currentWorkout[i].exercise));

      for (let j = 0; j < currentWorkout[i].repInputs.length; j++) {
        if (currentWorkout[i].repInputs[j].value.length > 0) {
          totalReps += parseInt(currentWorkout[i].repInputs[j].value);
        }
      }

      for (let j = 0; j < currentWorkout[i].repInputs.length; j++) {
        if (currentWorkout[i].repInputs[j].value.length > 0 && currentWorkout[i].weightInputs[j].value.length > 0) {
          totalVolume += parseFloat((parseFloat(currentWorkout[i].repInputs[j].value) * parseFloat(currentWorkout[i].weightInputs[j].value)).toFixed(2));
        }
      }

      if (!allExercises.includes(currentWorkout[i].exercise.value)) {
        allExercises.push(currentWorkout[i].exercise.value);
      }
    }

    let previousLevel = userStatistics[0].lvl as number;

    let decimalTotalVolume = BSON.Decimal128.fromString(totalVolume.toFixed(2));

    const id = new BSON.ObjectID();
    createItem(id, exercises, reps, weights, totalReps, decimalTotalVolume, allExercises, workoutName, workoutDate);
    logWorkout(id, 'Resistance');
    updateUserStatistics(Math.round(totalVolume), totalReps);
    updateUserTitles(userStatistics[0].lvl as number);

    let postLevel = userStatistics[0].lvl as number;
    let levelUp = false;

    if (postLevel > previousLevel) {
      levelUp = true;
    }

    storage.remove({key: 'currentWorkoutResistance'});
    goToSubmitCompletion(levelUp, totalReps + Math.round(totalVolume) + 100);
  };

  const createItem = useCallback(
    (id: BSON.ObjectId, exerciseDataJson: string[], repsDataJson: string[], weightsDataJson: string[], totalReps: number, totalVolume: BSON.Decimal128, allExercises: string[], name: string, dateCreated: Date) => {
      // if the realm exists, create an Item

      realm.write(() => {
        return new ResistanceWorkout(realm, {
          _id: id,
          allExercises: allExercises,
          dateCreated: dateCreated,
          exercises: exerciseDataJson,
          name: name,
          reps: repsDataJson,
          totalReps: totalReps,
          totalVolume: totalVolume,
          userId: user?.id,
          weights: weightsDataJson,
        });
      });
    },
    [realm, user],
  );

  const logWorkout = useCallback(
    (id: BSON.ObjectId, workoutType: string) => {
      realm.write(() => {
        return new Workouts(realm, {
          _id: new BSON.ObjectID(),
          userId: user?.id,
          dateCreated: new Date(),
          workoutId: id,
          workoutType: workoutType,
          userStatus: userData[0].status as string,
        });
      });
    },
    [realm, user],
  );

  const updateUserStatistics = useCallback(
    (totalVolume: number, totalReps: number) => {
      let lvl = userStatistics[0].lvl as number;
      let xp = userStatistics[0].xp as number;

      let xpGained: number = totalVolume + totalReps + 100;

      let object = calculateLevel(lvl, xp, xpGained);

      let newLvl = userStatistics[0].lvl;
      let newXp = userStatistics[0].xp;
      let newXpTarget = userStatistics[0].xpTarget;

      if (object != null) {
        newLvl = object?.newLvl;
        newXp = object?.newXp;
        newXpTarget = object?.newXpTarget;
      }

      let numWorkouts = userStatistics[0].numWorkouts as number;
      let numResistanceWorkouts = userStatistics[0].numResistanceWorkouts as number;

      realm.write(() => {
        (userStatistics[0].lvl = newLvl), (userStatistics[0].xp = newXp), (userStatistics[0].numWorkouts = numWorkouts + 1), (userStatistics[0].numResistanceWorkouts = numResistanceWorkouts + 1), (userStatistics[0].xpTarget = newXpTarget);
      });
    },
    [realm, user],
  );

  const updateUserTitles = useCallback(
    (level: any) => {
      let newUnlockedTitles: any = [];

      const titles = ['Newbie', 'Starter', 'Rookie', 'Novice', 'Fitness Enthusiast', 'Active Achiever', 'Workout Warrior', 'Movement Monk', 'Determined Disciple', 'Fitness Pro', 'Exercise Expert', 'Strength Master', 'Endurance Elite', 'Power Performer', 'Ultimate Athlete', 'Fitness Guru', 'Master Trainer', 'Elite Champion', 'Fitness God'];

      console.log(newUnlockedTitles);
      console.log(level);

      newUnlockedTitles.push(titles[0]);

      if (level > 190) {
        if (!newUnlockedTitles.includes(titles[18])) {
          newUnlockedTitles.push(titles[18]);
        }
      } else if (level > 180) {
        if (!newUnlockedTitles.includes(titles[17])) {
          newUnlockedTitles.push(titles[17]);
        }
      } else if (level > 170) {
        if (!newUnlockedTitles.includes(titles[16])) {
          newUnlockedTitles.push(titles[16]);
        }
      } else if (level > 160) {
        if (!newUnlockedTitles.includes(titles[15])) {
          newUnlockedTitles.push(titles[15]);
        }
      } else if (level > 150) {
        if (!newUnlockedTitles.includes(titles[14])) {
          newUnlockedTitles.push(titles[14]);
        }
      } else if (level > 140) {
        if (!newUnlockedTitles.includes(titles[14])) {
          newUnlockedTitles.push(titles[14]);
        }
      } else if (level > 130) {
        if (!newUnlockedTitles.includes(titles[13])) {
          newUnlockedTitles.push(titles[13]);
        }
      } else if (level > 120) {
        if (!newUnlockedTitles.includes(titles[12])) {
          newUnlockedTitles.push(titles[12]);
        }
      } else if (level > 110) {
        if (!newUnlockedTitles.includes(titles[11])) {
          newUnlockedTitles.push(titles[11]);
        }
      } else if (level > 100) {
        if (!newUnlockedTitles.includes(titles[10])) {
          newUnlockedTitles.push(titles[10]);
        }
      } else if (level > 90) {
        if (!newUnlockedTitles.includes(titles[9])) {
          newUnlockedTitles.push(titles[9]);
        }
      } else if (level > 80) {
        if (!newUnlockedTitles.includes(titles[8])) {
          newUnlockedTitles.push(titles[8]);
        }
      } else if (level > 70) {
        if (!newUnlockedTitles.includes(titles[7])) {
          newUnlockedTitles.push(titles[7]);
        }
      } else if (level > 60) {
        if (!newUnlockedTitles.includes(titles[6])) {
          newUnlockedTitles.push(titles[6]);
        }
      } else if (level > 50) {
        if (!newUnlockedTitles.includes(titles[5])) {
          newUnlockedTitles.push(titles[5]);
        }
      } else if (level > 40) {
        if (!newUnlockedTitles.includes(titles[4])) {
          newUnlockedTitles.push(titles[4]);
        }
      } else if (level > 30) {
        if (!newUnlockedTitles.includes(titles[3])) {
          newUnlockedTitles.push(titles[3]);
        }
      } else if (level > 20) {
        if (!newUnlockedTitles.includes(titles[2])) {
          newUnlockedTitles.push(titles[2]);
        }
      } else if (level > 10) {
        if (!newUnlockedTitles.includes(titles[1])) {
          newUnlockedTitles.push(titles[1]);
        }
      }

      console.log(newUnlockedTitles);

      realm.write(() => {
        userData[0].titles = newUnlockedTitles;
      });
    },
    [realm, user],
  );

  const calculateLevel = (currLvl: number, currXp: number, xpGained: number) => {
    let newLvl = currLvl;
    let newXp = 0;
    let newXpTarget = 0;

    let object = {
      newLvl: newLvl,
      newXp: newXp,
      newXpTarget: newXpTarget,
      xpGained: xpGained,
    };

    let xpTarget = currLvl * 1000 + 1000;

    let continueLeveling = true;
    let xp = currXp + xpGained;

    while (continueLeveling) {
      if (xp < xpTarget) {
        continueLeveling = false;
        object.newXp = xp;
        object.newXpTarget = xpTarget;
        object.newLvl = newLvl;
        return object;
      }

      xp -= xpTarget;
      newLvl++;
      xpTarget = newLvl * 1000 + 1000;
    }
  };

  const handleConfirm = () => {
    // Show confirmation popup
    if (currentWorkout.length == 0) {
      Alert.alert(
        'No Exercises', // Title of the alert
        'You must enter exercises before submitting', // Alert message
        [
          {
            text: 'Close',
            onPress: () => console.log('Close Pressed'),
          },
        ],
        {cancelable: true}, // If false, the user cannot dismiss the alert by tapping outside
      );

      return;
    }

    setShowModal(true);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Format date as "17th Jul 2024"
    return `${day} ${month} ${year}`;
  };

  const formatTotalRepsAndVolume = () => {
    let totalReps: number = 0;
    let totalVolume: number = 0;

    for (let i = 0; i < currentWorkout.length; i++) {
      for (let j = 0; j < currentWorkout[i].repInputs.length; j++) {
        if (currentWorkout[i].repInputs[j].value.length > 0) {
          totalReps += parseFloat(currentWorkout[i].repInputs[j].value);
        }
      }

      for (let j = 0; j < currentWorkout[i].repInputs.length; j++) {
        if (currentWorkout[i].repInputs[j].value.length > 0 && currentWorkout[i].weightInputs[j].value.length > 0) {
          totalVolume += parseFloat(currentWorkout[i].repInputs[j].value) * parseFloat(currentWorkout[i].weightInputs[j].value);
        }
      }
    }

    if (userData[0].preferences) {
      if (userData[0].preferences[0] == 'kg') {
        return totalVolume + ' kg     ' + totalReps + ' reps';
      } else {
        return totalVolume + ' lbs     ' + totalReps + ' reps';
      }
    }

    return totalVolume + ' kg     ' + totalReps + ' reps';
  };

  useEffect(() => {
    addExtraExercisesToSection();
  }, []);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(extraExercises);

      mutableSubs.add(userData);

      mutableSubs.add(userStatistics);
    });
  }, [realm, user]);

  return (
    <>
      <View style={[styles.header, shadow.shadow]}>
        <TouchableOpacity onPress={handleCancel}>
          <MaterialCommunityIcons name="close" color={colors.text} size={32} style={{marginLeft: 16, borderRadius: 40, padding: 5}} />
        </TouchableOpacity>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Text style={common.h2}>Resistance</Text>
          <Text>{formatTotalRepsAndVolume()}</Text>
        </View>
        <TouchableOpacity onPress={handleConfirm}>
          <MaterialCommunityIcons name="check" color={colors.text} size={32} style={{marginRight: 16, borderRadius: 40, padding: 5}} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={[common.h2, {marginLeft: 32, marginBottom: 24}]}>Exercises Logged This Session</Text>
        {currentWorkout.map((form: any, formIndex: any) => {
          return (
            <View key={new BSON.ObjectID().toString()} style={{marginBottom: 8}}>
              <View
                style={[
                  styles.form,
                  !collapsed[formIndex] && {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    paddingBottom: 8,
                  },
                ]}>
                <Text style={[common.h2]}>{getExerciseName(form.exercise.value)}</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity onPress={() => editSets(formIndex, form.exercise.value)}>
                    <MaterialCommunityIcons name="pencil-outline" color={colors.text} size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleCollapsed(formIndex)}>
                    {collapsed[formIndex] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} style={{marginLeft: 24}} />}
                    {!collapsed[formIndex] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} style={{marginLeft: 24}} />}
                  </TouchableOpacity>
                </View>
              </View>
              <Collapsible collapsed={collapsed[formIndex]}>
                {!collapsed[formIndex] && (
                  <View style={styles.collapsibleContent}>
                    <Text style={{marginBottom: 8}}>Total Sets: {calculateTotalSets(formIndex)}</Text>
                    <Text style={{marginBottom: 8}}>Total Volume: {calculateTotalVolume(formIndex)}</Text>
                    <View
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}>
                      <Text>Total Reps: {calculateTotalReps(formIndex)}</Text>
                      <TouchableOpacity onPress={() => handleDeleteExerciseFromWorkout(formIndex)}>
                        <MaterialCommunityIcons name="delete-outline" color={colors.text} size={24} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Collapsible>
            </View>
          );
        })}
        <TouchableOpacity style={styles.addExerciseButton} onPress={addExercise}>
          <Text style={[common.h2, {color: colors.white}]}>Add Another Exercise</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal isVisible={showModal} swipeDirection={['down']} onSwipeComplete={closeModal} onBackdropPress={closeModal} style={styles.modalView}>
        <TouchableOpacity style={styles.modalContent} onPress={() => Keyboard.dismiss()}>
          <Text style={[common.h2, {marginTop: 16, marginBottom: 16}, shadow.shadow]}>Confirm and Log</Text>
          <TextInput style={styles.input} onChangeText={newText => setWorkoutName(newText)} value={workoutName} placeholder="Workout Name" placeholderTextColor={colors.unselectedItem} />
          <TouchableOpacity style={[styles.input, {display: 'flex', alignItems: 'center'}, shadow.shadow]} onPress={() => setShowDatePicker(true)}>
            <Text style={[{color: colors.text}, common.h2]}>{formatDate(workoutDate)}</Text>
            <MaterialCommunityIcons name="calendar" color={colors.text} size={24} />
          </TouchableOpacity>

          <TouchableOpacity onPress={submitData} style={[styles.confirmButton, shadow.shadow]}>
            <Text style={[common.h2, {color: colors.white}]}>Log Workout</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={workoutDate}
          mode="date" // Change this to 'time' for a time picker
          display="default"
          onChange={onChangeDate}
        />
      )}
    </>
  );
};
