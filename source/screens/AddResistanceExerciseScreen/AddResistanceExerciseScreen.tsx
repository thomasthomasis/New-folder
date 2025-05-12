import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {Alert, Text, View, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {BSON} from 'realm';
import {useUser, useRealm, useQuery} from '@realm/react';
import {ResistanceWorkout} from '../../schemas/ResistanceWorkoutSchema';
import {Workouts} from '../../schemas/WorkoutSchema';
import {UserStatistics} from '../../schemas/UserStatisticsSchema';
import {ExtraExercises} from '../../schemas/ExtraExercisesSchema';
import {shadow} from '../../sharedStyling/Shadow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Collapsible from 'react-native-collapsible';
import styles from './AddResistanceExerciseScreen.style';
import {useIsFocused} from '@react-navigation/native';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp} from '@react-navigation/native';
import {Users} from '../../schemas/UsersSchema';
import {common} from '../../sharedStyling/CommonStyle';

type LogWorkoutResistanceProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AddResistanceExercise'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'AddResistanceExercise'>;
};

export const AddResistanceExerciseScreen = ({navigation, route}: LogWorkoutResistanceProps) => {
  const realm = useRealm();
  const user = useUser();
  const isFocused = useIsFocused();

  const {firstVisit} = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const goBackToSummaryScreen = () => {
    navigation.navigate('ResistanceSetsSummary');
  };

  const logResistanceWorkout = (exerciseId: string) => {
    navigation.navigate('AddResistanceExerciseSets', {
      exerciseId: exerciseId,
      formIndex: -1,
    });
  };

  const userData = useQuery(Users).filtered('userId == $0', user.id);
  const extraExercises = useQuery(ExtraExercises).filtered('userId == $0 && type == $1', user.id, 'Resistance');
  const [searchText, setSearchText] = useState<string>('');
  const [collapsed, setCollapsed] = useState<boolean[]>([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
  const [searcModalVisible, setSearchModalVisible] = useState<boolean>(false);
  const [searchedExercises, setSearchedExercises] = useState<string[]>([]);
  const [previousSearchedExercises, setPreviousSearchedExercises] = useState<string[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<any>([]);

  const exerciseSections = useMemo(() => {
    return [
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
          {id: '149', name: 'Sled Push'},
          {id: '150', name: 'Stiff Leg Deadlift'},
          {id: '151', name: 'Sumo Deadlift'},
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
  }, []);
  const [sections, setSections] = useState<any[]>(exerciseSections);

  const storage = React.useMemo(() => {
    return new Storage({
      size: 1000,
      storageBackend: AsyncStorage,
      defaultExpires: null,
    });
  }, []);

  const onClose = () => {
    setSearchModalVisible(false);
  };

  const handleAddForm = (exerciseId: string) => {
    let currentWorkoutArray = [...currentWorkout];

    const newForm = {
      id: currentWorkoutArray.length + 1,
      exercise: {id: 1, value: exerciseId},
      inputs: [{id: 1}],
      repInputs: [{id: 1, value: ''}],
      weightInputs: [{id: 1, value: ''}],
      extraNotes: {id: 1, value: ''},
    };

    currentWorkoutArray.push(newForm);
    console.log(currentWorkoutArray);

    saveCurrentWorkout(currentWorkoutArray, exerciseId);
  };

  const saveCurrentWorkout = async (array: any, exerciseId: string) => {
    try {
      await storage.save({
        key: 'currentWorkoutResistance',
        data: {
          currentWorkout: array,
        },
      });

      collapseAll();
      logResistanceWorkout(exerciseId);
    } catch (e) {
      console.log(e);
    }
  };

  const loadCurrentWorkout = useCallback(async () => {
    try {
      await storage
        .load({
          key: 'currentWorkoutResistance',
        })
        .then(ret => {
          setCurrentWorkout(ret.currentWorkout);
          console.log('Current Workout Add Exercise Screen: ', ret.currentWorkout);
        })
        .catch(err => {
          console.warn(err.message);
        });
    } catch (e) {
      console.log(e);
    }
  }, [storage]);

  useEffect(() => {
    loadCurrentWorkout();
  }, [isFocused, loadCurrentWorkout]);

  const toggleCollapsed = (index: any) => {
    let newCollapsed = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];

    if (collapsed[index] == false) {
      newCollapsed[index] = true;
    } else {
      newCollapsed[index] = false;
    }

    setCollapsed(newCollapsed);
  };

  const collapseAll = () => {
    let newCollapsed = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];

    setCollapsed(newCollapsed);
  };

  const getExerciseName = useCallback(
    (id: string) => {
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
    },
    [realm, sections],
  );

  const getExerciseIdNoIndex = (name: string) => {
    for (let i = 0; i < sections.length; i++) {
      for (let j = 0; j < sections[i].content.length; j++) {
        if (name == sections[i].content[j].name) {
          return sections[i].content[j].id;
        }
      }
    }
  };

  const getExerciseId = (exerciseIndex: number, sectionIndex: number) => {
    let id = sections[sectionIndex].content[exerciseIndex].id;

    if (id) {
      return id;
    }

    return '';
  };

  const getExerciseIdFavourite = (exerciseId: string) => {
    for (let i = 0; i < sections.length; i++) {
      for (let j = 0; j < sections[i].content.length; j++) {
        if (exerciseId == sections[i].content[j].id) {
          return sections[i].content[j].id;
        }
      }
    }

    return '';
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
      setSearchedExercises([]);
    } else {
      let array: string[] = [];
      for (let i = 0; i < exerciseSections.length; i++) {
        for (let j = 0; j < exerciseSections[i].content.length; j++) {
          let searchString = text.toLowerCase();
          let name = exerciseSections[i].content[j].name.toLowerCase();

          if (name.includes(searchString)) {
            if (array.length > 10) {
              break;
            }
            array.push(exerciseSections[i].content[j].name);
            console.log(array);
          }
        }
      }
      setSearchedExercises(array);
    }
  };

  const addExtraExercisesToSection = useCallback(() => {
    for (let i = 0; i < extraExercises.length; i++) {
      let extraInformation = extraExercises[i].extraInformation ?? '';
      //console.log(extraExercises[i])

      if (extraInformation == '') {
        let section = exerciseSections.find(section => section.title == 'Other');

        if (section) {
          let alreadyExists = section.content.some(item => item.name === getExerciseName(extraExercises[i].exerciseId));
          if (alreadyExists) {
            continue;
          }

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
  }, [exerciseSections, extraExercises, getExerciseName]);

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
            goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const favouriteExercise = (exerciseIndex: number, sectionIndex: number) => {
    let id = sections[sectionIndex].content[exerciseIndex].id;

    realm.write(() => {
      if (userData[0].favouriteExercises?.includes(id)) {
        let index = userData[0].favouriteExercises?.indexOf(id);
        if (index >= 0) {
          userData[0].favouriteExercises?.splice(index, 1);
        }
      } else {
        userData[0].favouriteExercises?.push(id);
      }
    });

    console.log(userData[0].favouriteExercises);
  };

  const favouriteExerciseNoIndexing = (exerciseId: string) => {
    realm.write(() => {
      if (userData[0].favouriteExercises?.includes(exerciseId)) {
        let index = userData[0].favouriteExercises?.indexOf(exerciseId);
        console.log('index: ', index);
        if (index >= 0) {
          userData[0].favouriteExercises?.splice(index, 1);
          console.log('yes');
        }
      } else {
        userData[0].favouriteExercises?.push(exerciseId);
      }
    });

    console.log(userData[0].favouriteExercises);
  };

  const saveSearchedExercises = (exerciseId: string) => {
    let oldArray = previousSearchedExercises;
    if (oldArray.includes(exerciseId)) {
      let index = oldArray.indexOf(exerciseId);
      oldArray.splice(index, 1);
    }

    oldArray.unshift(exerciseId);

    storage.save({
      key: 'recentSearchesResistance',
      data: {
        exerciseIdArray: oldArray,
      },
    });

    loadSearchedWorkouts();
  };

  const loadSearchedWorkouts = () => {
    storage
      .load({
        key: 'recentSearchesResistance',
      })
      .then(ret => {
        setPreviousSearchedExercises(ret.exerciseIdArray);
        console.log(ret.exerciseIdArray);
      })
      .catch(err => {
        console.warn(err.message);
      });
  };

  useEffect(() => {
    loadSearchedWorkouts();
  });

  useEffect(() => {
    addExtraExercisesToSection();
  }, [addExtraExercisesToSection, isFocused]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(ResistanceWorkout));

      mutableSubs.add(realm.objects(Workouts));

      mutableSubs.add(realm.objects(UserStatistics));

      mutableSubs.add(realm.objects(ExtraExercises));

      mutableSubs.add(realm.objects(Users));
    });
  }, [realm, user]);

  return (
    <>
      {searcModalVisible && (
        <View style={[styles.headerSearch, shadow.shadow]}>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="chevron-left" color={colors.text} size={24} />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} onChangeText={newText => handleSearch(newText)} value={searchText} placeholder="Search for an Exercise" placeholderTextColor={colors.unselectedItem} />
            <View>
              <MaterialCommunityIcons name="magnify" color={colors.text} size={24} style={styles.searchIcon} />
            </View>
          </View>
        </View>
      )}

      {!searcModalVisible && (
        <View style={[styles.header, shadow.shadow]}>
          {firstVisit && (
            <TouchableOpacity onPress={handleCancel}>
              <MaterialCommunityIcons name="chevron-left" color={colors.text} size={24} />
            </TouchableOpacity>
          )}
          {!firstVisit && (
            <TouchableOpacity onPress={goBackToSummaryScreen}>
              <MaterialCommunityIcons name="chevron-left" color={colors.text} size={24} />
            </TouchableOpacity>
          )}

          <Text style={common.h2}>Choose a Workout</Text>
          <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
            <MaterialCommunityIcons name="magnify" color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        {userData[0].favouriteExercises && userData[0].favouriteExercises.length > 0 && (
          <>
            <Text style={[styles.title, common.h2]}>Favourites</Text>
            <View style={[styles.containerFavourites]}>
              {userData[0].favouriteExercises?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.favouriteExercise, shadow.shadow]}
                  onPress={() => {
                    handleAddForm(item);
                  }}>
                  <Text style={common.h3}>{getExerciseName(item)}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExerciseNoIndexing(item);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseIdFavourite(item)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseIdFavourite(item)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={[styles.title, common.h2]}>All Exercises</Text>
        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(0)} style={[styles.accordionHeader, {borderTopLeftRadius: 32, borderTopRightRadius: 32}]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Neck</Text>
              {!collapsed[0] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[0] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[0]}>
            {!collapsed[0] &&
              sections[0].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h3}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 0);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 0)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 0)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(1)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Back</Text>
              {!collapsed[1] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[1] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[1]}>
            {!collapsed[1] &&
              sections[1].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 1);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 1)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 1)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>

        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(2)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Shoulders</Text>
              {!collapsed[2] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[2] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[2]}>
            {!collapsed[2] &&
              sections[2].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 2);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 2)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 2)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(3)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Chest</Text>
              {!collapsed[3] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[3] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[3]}>
            {!collapsed[3] &&
              sections[3].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 3);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 3)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 3)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(4)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Biceps</Text>
              {!collapsed[4] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[4] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[4]}>
            {!collapsed[4] &&
              sections[4].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 4);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 4)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 4)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>

        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(5)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Triceps</Text>
              {!collapsed[5] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[5] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[5]}>
            {!collapsed[5] &&
              sections[5].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 5);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 5)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 5)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(6)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Forearms</Text>
              {!collapsed[6] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[6] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[6]}>
            {!collapsed[6] &&
              sections[6].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 6);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 6)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 6)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(7)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Core</Text>
              {!collapsed[7] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[7] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[7]}>
            {!collapsed[7] &&
              sections[7].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 7);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 7)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 7)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>

        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(8)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Quads</Text>
              {!collapsed[8] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[8] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[8]}>
            {!collapsed[8] &&
              sections[8].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 8);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 8)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 8)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(9)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Glutes</Text>
              {!collapsed[9] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[9] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[9]}>
            {!collapsed[9] &&
              sections[9].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 9);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 9)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 9)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(10)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Hamstrings</Text>
              {!collapsed[10] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[10] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[10]}>
            {!collapsed[10] &&
              sections[10].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 10);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 10)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 10)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>

        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(11)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Hip Flexors</Text>
              {!collapsed[11] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[11] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[11]}>
            {!collapsed[11] &&
              sections[11].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 11);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 11)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 11)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(12)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Groin</Text>
              {!collapsed[12] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[12] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[12]}>
            {!collapsed[12] &&
              sections[12].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 12);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 12)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 12)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion]}>
          <TouchableOpacity onPress={() => toggleCollapsed(13)} style={[styles.accordionHeader]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Calves</Text>
              {!collapsed[13] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[13] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[13]}>
            {!collapsed[13] &&
              sections[13].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 13);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 13)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 13)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>
        <View style={[styles.containerAccordion, {marginBottom: 24}]}>
          <TouchableOpacity
            onPress={() => toggleCollapsed(14)}
            style={[
              styles.accordionHeader,
              collapsed[14] && {
                borderBottomRightRadius: 32,
                borderBottomLeftRadius: 32,
                borderBottomWidth: 0,
              },
              !collapsed[14] && {
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
                borderBottomWidth: 0,
              },
            ]}>
            <View style={styles.accordionHeaderText}>
              <Text style={common.h2}>Custom</Text>
              {!collapsed[14] && <MaterialCommunityIcons name="chevron-up" color={colors.text} size={24} />}
              {collapsed[14] && <MaterialCommunityIcons name="chevron-down" color={colors.text} size={24} />}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed[14]}>
            {!collapsed[14] &&
              sections[14].content.map((item: any, index: any) => (
                <TouchableOpacity
                  key={new BSON.ObjectID().toString()}
                  style={styles.accordionContent}
                  onPress={() => {
                    handleAddForm(item.id);
                  }}>
                  <Text style={common.h2}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(index, 14);
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseId(index, 14)) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseId(index, 14)) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </Collapsible>
        </View>

        <TouchableOpacity style={[styles.addButton, shadow.shadow]}>
          <Text style={[common.h3, {color: 'white'}]}>Add Custom Exercise</Text>
        </TouchableOpacity>
      </ScrollView>

      {searcModalVisible && (
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            {searchedExercises.length == 0 && searchText.length == 0 && previousSearchedExercises.length > 0 && (
              <>
                <TouchableOpacity>
                  <Text style={[common.h2, {textAlign: 'left', marginLeft: 32, marginTop: 24}]}>Recent Searches</Text>
                </TouchableOpacity>
                {userData[0].favouriteExercises &&
                  previousSearchedExercises.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.searchedExercise,
                        index == previousSearchedExercises.length - 1 && {
                          borderBottomWidth: 0,
                        },
                      ]}
                      onPress={() => {
                        saveSearchedExercises(item);
                        handleAddForm(item);
                      }}>
                      <Text style={[common.h3]}>{getExerciseName(item)}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          favouriteExerciseNoIndexing(item);
                        }}>
                        {userData[0].favouriteExercises?.includes(item) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                        {!userData[0].favouriteExercises?.includes(item) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
              </>
            )}

            {previousSearchedExercises.length == 0 && searchText.length == 0 && searchedExercises.length == 0 && <Text style={{marginLeft: 32, marginTop: 8}}>No Recently Searched Exercises...</Text>}
            {searchText.length > 0 && searchedExercises.length == 0 && (
              <View style={[styles.searchedExercise, {borderBottomWidth: 0}]}>
                <Text style={[{marginTop: 8}, common.h3]}>No Exercises Found...</Text>
              </View>
            )}
            {userData[0].favouriteExercises &&
              searchedExercises.length > 0 &&
              searchedExercises.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.searchedExercise,
                    index == searchedExercises.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                  onPress={() => {
                    saveSearchedExercises(getExerciseIdNoIndex(item.toString()));
                    handleAddForm(getExerciseIdNoIndex(item.toString()));
                  }}>
                  <Text style={common.h3}>{item.toString()}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExerciseNoIndexing(getExerciseIdNoIndex(item.toString()));
                    }}>
                    {userData[0].favouriteExercises?.includes(getExerciseIdNoIndex(item.toString())) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!userData[0].favouriteExercises?.includes(getExerciseIdNoIndex(item.toString())) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </View>
          <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        </View>
      )}
    </>
  );
};
