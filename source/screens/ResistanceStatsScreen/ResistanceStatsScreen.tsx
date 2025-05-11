import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions} from 'react-native';
import {useRealm, useUser} from '@realm/react';
import {Users} from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserStatistics} from '../../schemas/UserStatisticsSchema';
import {shadow} from '../../sharedStyling/Shadow';
import styles from './ResistanceStatsScreen.style';

import {CardStyleInterpolators, StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp} from '@react-navigation/native';
import {colors} from '../../sharedStyling/Colors';
import {useFocusEffect} from '@react-navigation/native';
import {Workouts} from '../../schemas/WorkoutSchema';
import {GeneralLineChartComponent} from '../../components/GeneralLineChartComponent/GeneralLineChartComponent';
import {GeneralPieChart} from '../../components/GeneralPieChartComponent/GeneralPieChartComponent';
import {StackedBarChartComponent} from '../../components/StackedBarChartComponent/StackedBarChartComponent';
import {ResistanceWorkout} from '../../schemas/ResistanceWorkoutSchema';
import {ResistanceLineChartComponent} from '../../components/ResistanceStatsComponents/ResistanceLineChartComponent/ResistanceLineChartComponent';
import {ResistanceBarChartComponent} from '../../components/ResistanceStatsComponents/ResistanceBarChartComponent/ResistanceBarChartComponent';
import {ResistancePieChartComponent} from '../../components/ResistanceStatsComponents/ResistancePieChartComponent/ResistancePieChartComponent';
import {ExtraExercises} from '../../schemas/ExtraExercisesSchema';

type ResistanceStatsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ResistanceStats'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'ResistanceStats'>;
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const ResistanceStatsScreen = ({navigation, route}: ResistanceStatsScreenProps) => {
  const realm = useRealm();
  const user = useUser();

  const {userId} = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const goToWorkoutView = (workoutId: string) => {
    console.log('navigate to workout view screen');
  };

  const goToExerciseStats = (exerciseId: string) => {
    navigation.navigate('ResistanceExerciseStats', {
      userId: userId,
      exerciseId: exerciseId,
    });
  };

  const sections = [
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

  useEffect(() => {
    addExtraExercisesToSection();
  }, []);

  const [loading, setLoading] = useState(true);

  const [extraExercises, setExtraExercises] = useState<any>(realm.objects(ExtraExercises).filtered('userId == $0 && type == $1', user.id, 'Resistance'));

  const [activeFilter, setActiveFilter] = useState(0);
  const [workoutData, setWorkoutData] = useState<any>(null);

  const [startDate, setStartDate] = useState<Date>(new Date(0));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [highestVolumeSession, setHighestVolumeSession] = useState<any>(null);
  const [highestRepSession, setHighestRepSession] = useState<any>(null);
  const [highestVolumeAndRepSet, setHighestVolumeAndRepSet] = useState<any>(null);

  useEffect(() => {
    let {startDate, endDate} = getDateRange(activeFilter);
    setStartDate(startDate);
    setEndDate(endDate);

    const resistanceWorkouts = realm.objects(ResistanceWorkout).filtered('userId == $0 AND dateCreated >= $1 AND dateCreated <= $2', userId, startDate, endDate);
    setWorkoutData(resistanceWorkouts);

    let highestVolumeSessionObject = getHighestVolumeSession(resistanceWorkouts);
    setHighestVolumeSession(highestVolumeSessionObject);

    let highestRepSessionObject = getHighestRepSession(resistanceWorkouts);
    setHighestRepSession(highestRepSessionObject);

    let highestVolumeAndRepSetObject = getHighestVolumeAndRepSet(resistanceWorkouts);
    setHighestVolumeAndRepSet(highestVolumeAndRepSetObject);

    //console.log("Workouts: ", resistanceWorkouts.length)

    if (resistanceWorkouts) {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(ResistanceWorkout));
    });
  }, [realm, user]);

  const setSpecificTime = (date: any, hours: any, minutes: any, seconds: any, milliseconds: any) => {
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(milliseconds);
    return date;
  };

  const getDateRange = (filter: number) => {
    const currentDate = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (filter) {
      case 0:
        startDate = new Date(0); // January 1, 1970 (Epoch time)
        endDate = currentDate;
        break;
      case 1:
        startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
        endDate = currentDate;
        break;
      case 2:
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, currentDate.getDate());
        endDate = currentDate;
        break;
      case 3:
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate());
        endDate = currentDate;
        break;
      case 4:
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
        endDate = currentDate;
        break;
      default:
        startDate = new Date(0);
        endDate = currentDate;
        break;
    }

    startDate = setSpecificTime(startDate, 1, 0, 0, 0);
    endDate = setSpecificTime(endDate, 24, 59, 59, 999);

    console.log(startDate);
    console.log(endDate);

    return {startDate, endDate};
  };

  const getHighestVolumeSession = (data: any) => {
    let largestVolume = 0;
    let workoutId = '';
    let date = new Date();

    for (let i = 0; i < data.length; i++) {
      if (data[i].totalVolume > largestVolume) {
        largestVolume = data[i].totalVolume;
        workoutId = data[i]._id;
        date = data[i].dateCreated;
      }
    }

    let object = {
      workoutId: workoutId,
      largestVolume: largestVolume,
      date: date,
    };

    return object;
  };

  const getHighestRepSession = (data: any) => {
    let mostReps = 0;
    let workoutId = '';
    let date = new Date();

    for (let i = 0; i < data.length; i++) {
      if (data[i].totalReps > mostReps) {
        mostReps = data[i].totalReps;
        workoutId = data[i]._id;
        date = data[i].dateCreated;
      }
    }

    let object = {
      workoutId: workoutId,
      mostReps: mostReps,
      date: date,
    };

    return object;
  };

  const getHighestVolumeAndRepSet = (data: any) => {
    let largestVolume = 0;
    let largestReps = 0;

    let workoutIdVolume = '';
    let workoutIdReps = '';
    let dateVolume = new Date();
    let dateReps = new Date();
    let exerciseIdVolume = '';
    let exerciseIdReps = '';

    let heaviestWeight = 0;
    let workoutIdWeight = '';
    let dateWeight = new Date();
    let exerciseIdWeight = '';

    console.log('new -------------------------');

    for (let i = 0; i < data.length; i++) {
      //console.log(data[i].weights.length)
      let numWeightsArray = data[i].weights.length;
      for (let j = 0; j < numWeightsArray; j++) {
        //console.log(data[i].weights[j])
        let jsonDataVolumes = JSON.parse(data[i].weights[j]);
        let jsonDataReps = JSON.parse(data[i].reps[j]);

        let jsonDataExercises = JSON.parse(data[i].exercises[j]);

        console.log('______________________________');
        console.log('Exercises: ', jsonDataExercises);
        console.log('weights: ', jsonDataVolumes);
        console.log('reps: ', jsonDataReps);

        let weight = 0;
        let reps = 0;

        for (let k = 0; k < jsonDataVolumes.length; k++) {
          weight = parseFloat(jsonDataVolumes[k].value);
          reps = parseFloat(jsonDataReps[k].value);

          let volume = weight * reps;
          console.log('volume of set: ', volume);
          if (volume > largestVolume) {
            largestVolume = volume;
            workoutIdVolume = data[i]._id;
            dateVolume = data[i].dateCreated;
            exerciseIdVolume = jsonDataExercises.value;
          }

          if (reps > largestReps) {
            largestReps = reps;
            workoutIdReps = data[i]._id;
            dateReps = data[i].dateCreated;
            exerciseIdReps = jsonDataExercises.value;
          }

          if (weight > heaviestWeight) {
            heaviestWeight = weight;
            workoutIdWeight = data[i]._id;
            dateWeight = data[i].dateCreated;
            exerciseIdWeight = jsonDataExercises.value;
          }
        }
      }
    }

    let object = {
      workoutIdVolume: workoutIdVolume,
      workoutIdReps: workoutIdReps,
      largestVolume: largestVolume,
      largestReps: largestReps,
      dateVolume: dateVolume,
      dateReps: dateReps,
      exerciseIdVolume: exerciseIdVolume,
      exerciseIdReps: exerciseIdReps,

      workoutIdWeight: workoutIdWeight,
      heaviestWeight: heaviestWeight,
      dateWeight: dateWeight,
      exerciseIdWeight: exerciseIdWeight,
    };

    console.log(object);

    return object;
  };

  const getExerciseName = (id: string) => {
    const exercise = extraExercises.filtered('userId == $0 AND exerciseId == $1', user.id, id);

    if (exercise.length == 0) {
      for (let section of sections) {
        let exercise = section.content.find(ex => ex.id === id);
        if (exercise) {
          return exercise.name;
        }
      }
      return ''; // Return null if the exercise is not found
    } else {
      return exercise[0].name ?? '';
    }
  };

  const addExtraExercisesToSection = () => {
    for (let i = 0; i < extraExercises.length; i++) {
      let extraInformation = extraExercises[i].extraInformation ?? '';

      if (extraInformation == '') {
        let section = sections.find(section => section.title == 'Other');

        if (section) {
          let alreadyExists = section.content.some(item => item.name === getExerciseName(extraExercises[i].exerciseId));
          if (alreadyExists) continue;

          let name = getExerciseName(extraExercises[i].exerciseId);
          let newExercise = {id: extraExercises[i].exerciseId, name: name};
          section.content.push(newExercise);
        }
        continue;
      }

      let muscleGroups = extraInformation.split(',');

      for (let j = 0; j < muscleGroups.length; j++) {
        if (muscleGroups[j] == '') continue;

        let section = sections.find(section => section.title == muscleGroups[j]);

        if (section) {
          let name = getExerciseName(extraExercises[i].exerciseId);
          let newExercise = {id: extraExercises[i].exerciseId, name: name};
          section.content.push(newExercise);
        }

        section = sections.find(section => section.title == 'Other');

        if (section) {
          let alreadyExists = section.content.some(item => item.name === getExerciseName(extraExercises[i].exerciseId));
          if (alreadyExists) continue;

          let name = getExerciseName(extraExercises[i].exerciseId);
          let newExercise = {id: extraExercises[i].exerciseId, name: name};
          section.content.push(newExercise);
        }
      }
    }
  };

  return (
    <>
      {loading && <ActivityIndicator size={'large'} />}
      {!loading && (
        <>
          <View
            style={{
              width: '100%',
              height: 60,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.black,
            }}>
            <View style={styles.headerTitle}>
              <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                <MaterialCommunityIcons name="arrow-left" size={40} color={'white'} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  marginLeft: 20,
                  color: 'white',
                }}>
                Resistance Stats
              </Text>
            </View>
          </View>
          <ScrollView>
            {workoutData.length == 0 && (
              <View>
                <View style={styles.containerFilters}>
                  <TouchableOpacity style={[styles.filterButton, activeFilter == 0 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(0)}>
                    <Text style={styles.filterButtonText}>Max</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterButton, activeFilter == 1 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(1)}>
                    <Text style={styles.filterButtonText}>1Y</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterButton, activeFilter == 2 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(2)}>
                    <Text style={styles.filterButtonText}>6M</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterButton, activeFilter == 3 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(3)}>
                    <Text style={styles.filterButtonText}>3M</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterButton, activeFilter == 4 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(4)}>
                    <Text style={styles.filterButtonText}>1M</Text>
                  </TouchableOpacity>
                </View>
                <Text>No Resistance Workout Data!!</Text>
              </View>
            )}
            {workoutData.length > 0 && (
              <View style={{minHeight: screenHeight * 2}}>
                <View style={styles.containerFilters}>
                  <TouchableOpacity style={[styles.filterButton, activeFilter == 0 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(0)}>
                    <Text style={styles.filterButtonText}>Max</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterButton, activeFilter == 1 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(1)}>
                    <Text style={styles.filterButtonText}>1Y</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterButton, activeFilter == 2 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(2)}>
                    <Text style={styles.filterButtonText}>6M</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterButton, activeFilter == 3 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(3)}>
                    <Text style={styles.filterButtonText}>3M</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.filterButton, activeFilter == 4 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(4)}>
                    <Text style={styles.filterButtonText}>1M</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.container}>
                  <View>
                    <ResistanceLineChartComponent data={workoutData} startDate={startDate} endDate={endDate} filter={activeFilter} />
                  </View>
                  <View>
                    <ResistanceBarChartComponent data={workoutData} />
                  </View>

                  <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={() => goToWorkoutView(highestVolumeSession.workoutId)}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '500',
                        color: colors.text,
                      }}>
                      Highest Volume Session
                    </Text>
                    <Text
                      style={{
                        fontSize: 40,
                        fontWeight: '900',
                        color: colors.text,
                      }}>
                      {highestVolumeSession.largestVolume}KG
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: colors.text,
                      }}>
                      {highestVolumeSession.date.toDateString()}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={() => goToWorkoutView(highestRepSession.workoutId)}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '500',
                        color: colors.text,
                      }}>
                      Highest Rep Session
                    </Text>
                    <Text
                      style={{
                        fontSize: 40,
                        fontWeight: '900',
                        color: colors.text,
                      }}>
                      {highestRepSession.mostReps} Reps
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: colors.text,
                      }}>
                      {highestRepSession.date.toDateString()}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={() => goToWorkoutView(highestVolumeAndRepSet.workoutIdVolume)}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '500',
                        color: colors.text,
                      }}>
                      Highest Volume Set
                    </Text>
                    <Text
                      style={{
                        fontSize: 40,
                        fontWeight: '900',
                        color: colors.text,
                      }}>
                      {highestVolumeAndRepSet.largestVolume}KG
                    </Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: '700',
                        color: colors.text,
                      }}>
                      {getExerciseName(highestVolumeAndRepSet.exerciseIdVolume)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: colors.text,
                      }}>
                      {highestVolumeAndRepSet.dateVolume.toDateString()}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={() => goToWorkoutView(highestVolumeAndRepSet.workoutIdReps)}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '500',
                        color: colors.text,
                      }}>
                      Highest Rep Set
                    </Text>
                    <Text
                      style={{
                        fontSize: 40,
                        fontWeight: '900',
                        color: colors.text,
                      }}>
                      {highestVolumeAndRepSet.largestReps} Reps
                    </Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: '700',
                        color: colors.text,
                      }}>
                      {getExerciseName(highestVolumeAndRepSet.exerciseIdReps)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: colors.text,
                      }}>
                      {highestVolumeAndRepSet.dateReps.toDateString()}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={() => goToWorkoutView(highestVolumeAndRepSet.workoutIdWeight)}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '500',
                        color: colors.text,
                      }}>
                      Heaviest Weight Lifted
                    </Text>
                    <Text
                      style={{
                        fontSize: 40,
                        fontWeight: '900',
                        color: colors.text,
                      }}>
                      {highestVolumeAndRepSet.heaviestWeight}KG
                    </Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: '700',
                        color: colors.text,
                      }}>
                      {getExerciseName(highestVolumeAndRepSet.exerciseIdWeight)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: colors.text,
                      }}>
                      {highestVolumeAndRepSet.dateWeight.toDateString()}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={() => goToExerciseStats('171')}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '500',
                        color: colors.text,
                      }}>
                      More Exercises
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </>
  );
};
