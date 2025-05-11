import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Animated, FlatList, Dimensions, Keyboard} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {BSON} from 'realm';
import {useUser, useRealm, useQuery, useObject} from '@realm/react';
import {ExtraExercises} from '../../schemas/ExtraExercisesSchema';
import {shadow} from '../../sharedStyling/Shadow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './AddResistanceExerciseSetsScreen.style';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp, useIsFocused} from '@react-navigation/native';
import {Users} from '../../schemas/UsersSchema';
import {common} from '../../sharedStyling/CommonStyle';

type AddResistanceExerciseSetsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AddResistanceExerciseSets'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'AddResistanceExerciseSets'>;
};

const screenWidth = Dimensions.get('window').width;

export const AddResistanceExerciseSetsScreen = ({navigation, route}: AddResistanceExerciseSetsScreenProps) => {
  const realm = useRealm();
  const user = useUser();
  const isFocused = useIsFocused();

  const {exerciseId, formIndex} = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  console.log('formIndex:', formIndex);
  console.log('exerciseId:', exerciseId);

  //TO DO the sets summary screen
  const navigateToSetsSummary = () => {
    if (weights.length == 0 || weights.length == 0) {
      Alert.alert('Enter exercise data!!');
      return;
    }

    for (let i = 0; i < weights.length; i++) {
      if (weights[i] == '' || reps[i] == '') {
        Alert.alert('Make sure all sets have data!!');
        return;
      }
    }

    navigation.navigate('ResistanceSetsSummary');
  };

  const [weights, setWeights] = useState<string[]>(['']);
  const [reps, setReps] = useState<string[]>(['']);
  const [currentWorkout, setcurrentWorkout] = useState<any>([]);

  const extraExercises = useQuery(ExtraExercises).filtered('userId == $0 && type == $1', user.id.toString(), 'Resistance');
  const userData = useQuery(Users).filtered('userId == $0', user.id.toString());

  const calculateCurrentWorkoutSetsAndReps = (formIndex: number, currentWorkout: any) => {
    if (formIndex == -1) {
      return;
    }

    console.log('Current Workout Add Sets And Reps: ', currentWorkout);

    let weightsArray = currentWorkout[formIndex].weightInputs;
    let repsArray = currentWorkout[formIndex].repInputs;

    console.log(weightsArray);
    console.log(repsArray);

    let weightInputsArray = [];
    let repInputsArray = [];

    for (let i = 0; i < weightsArray.length; i++) {
      weightInputsArray.push(weightsArray[i].value);
      repInputsArray.push(repsArray[i].value);
    }

    setWeights(weightInputsArray);
    setReps(repInputsArray);
  };

  const setWeightText = (index: number, text: string) => {
    if (text == '.') {
      return;
    }

    const filteredText = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

    if (filteredText.length <= 7) {
      const weightArray = [...weights];
      weightArray[index] = filteredText;
      setWeights(weightArray);
    }

    if (formIndex > -1) {
      handleWeightInputChange(filteredText, formIndex, index);
    } else {
      handleWeightInputChange(filteredText, currentWorkout.length - 1, index);
    }
  };

  const setRepText = (index: number, text: string) => {
    const filteredText = text.replace(/[^0-9]/g, '');

    if (filteredText.length <= 3) {
      const repArray = [...reps];
      repArray[index] = filteredText;
      setReps(repArray);
    }

    if (formIndex > -1) {
      handleRepInputChange(filteredText, formIndex, index);
    } else {
      handleRepInputChange(filteredText, currentWorkout.length - 1, index);
    }
  };

  const addSet = () => {
    setWeights([...weights, '']);
    setReps([...reps, '']);

    Keyboard.dismiss();

    if (formIndex > -1) {
      handleAddInput(formIndex);
    } else {
      handleAddInput(currentWorkout.length - 1);
    }
  };

  const deleteSet = (index: number) => {
    let weightArray = [...weights];
    let repArray = [...reps];

    weightArray.splice(index, 1);
    repArray.splice(index, 1);

    setWeights(weightArray);
    setReps(repArray);

    if (formIndex > -1) {
      handleRemoveInput(formIndex, index);
    } else {
      handleRemoveInput(currentWorkout.length - 1, index);
    }
  };

  const handleRemoveForm = (formIndex: number) => {
    const currentWorkoutArray = [...currentWorkout];
    currentWorkoutArray.splice(formIndex);

    setcurrentWorkout(currentWorkoutArray);

    saveCurrentWorkout(currentWorkoutArray);
  };

  const handleAddInput = (formIndex: number) => {
    const newInput = {id: currentWorkout[formIndex].inputs.length + 1};
    const newrepInput = {
      id: currentWorkout[formIndex].repInputs.length + 1,
      value: '',
    };
    const newweightInput = {
      id: currentWorkout[formIndex].weightInputs.length + 1,
      value: '',
    };
    const updatedcurrentWorkout = [...currentWorkout];
    updatedcurrentWorkout[formIndex].repInputs.push(newrepInput);
    updatedcurrentWorkout[formIndex].weightInputs.push(newweightInput);
    updatedcurrentWorkout[formIndex].inputs.push(newInput);
    setcurrentWorkout(updatedcurrentWorkout);

    saveCurrentWorkout(updatedcurrentWorkout);
  };

  const handleRemoveInput = (formIndex: number, inputIndex: number) => {
    const updatedcurrentWorkout = [...currentWorkout];
    updatedcurrentWorkout[formIndex].inputs = updatedcurrentWorkout[formIndex].inputs.filter((_: any, i: any) => i !== inputIndex);
    updatedcurrentWorkout[formIndex].repInputs = updatedcurrentWorkout[formIndex].repInputs.filter((_: any, i: any) => i !== inputIndex);
    updatedcurrentWorkout[formIndex].weightInputs = updatedcurrentWorkout[formIndex].weightInputs.filter((_: any, i: any) => i !== inputIndex);
    setcurrentWorkout(updatedcurrentWorkout);

    saveCurrentWorkout(updatedcurrentWorkout);
  };

  const handleRepInputChange = (text: any, formIndex: number, inputIndex: number) => {
    const updatedcurrentWorkout = [...currentWorkout];
    updatedcurrentWorkout[formIndex].repInputs[inputIndex].value = text;
    setcurrentWorkout(updatedcurrentWorkout);

    saveCurrentWorkout(updatedcurrentWorkout);
  };

  const handleWeightInputChange = (text: any, formIndex: number, inputIndex: number) => {
    const updatedcurrentWorkout = [...currentWorkout];
    updatedcurrentWorkout[formIndex].weightInputs[inputIndex].value = text;
    setcurrentWorkout(updatedcurrentWorkout);

    saveCurrentWorkout(updatedcurrentWorkout);
  };

  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
  });

  const saveCurrentWorkout = async (currentWorkout: any) => {
    try {
      await storage.save({
        key: 'currentWorkoutResistance',
        data: {
          currentWorkout: currentWorkout,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const loadCurrentWorkout = async () => {
    try {
      await storage
        .load({
          key: 'currentWorkoutResistance',
        })
        .then(ret => {
          setcurrentWorkout(ret.currentWorkout);
          calculateCurrentWorkoutSetsAndReps(formIndex, ret.currentWorkout);
          console.log('Current Workout Add Sets: ', ret.currentWorkout);
        })
        .catch(err => {
          console.warn(err.message);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadCurrentWorkout();
  }, [isFocused]);

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
          onPress: () => goBack(),
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    addExtraExercisesToSection();
  }, [isFocused]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(ExtraExercises));

      mutableSubs.add(realm.objects(Users));
    });
  }, [realm, user]);

  let flatListRef: any;
  const scrollToTop = () => {
    flatListRef.scrollToOffset({offset: weights.length * 300, animated: true});
  };

  return (
    <>
      <View style={[styles.header, shadow.shadow]}>
        {formIndex > -1 && <MaterialCommunityIcons name="chevron-left" color={colors.white} size={24} />}
        {formIndex == -1 && (
          <TouchableOpacity
            onPress={() => {
              handleRemoveForm(currentWorkout.length - 1);
              goBack();
            }}>
            <MaterialCommunityIcons name="chevron-left" color={colors.text} size={24} />
          </TouchableOpacity>
        )}
        {formIndex > -1 && <Text style={common.h2}>Edit {getExerciseName(exerciseId)}</Text>}
        {formIndex == -1 && <Text style={common.h2}>{getExerciseName(exerciseId)}</Text>}
        <TouchableOpacity onPress={navigateToSetsSummary}>
          {formIndex == -1 && <MaterialCommunityIcons name="plus" color={colors.text} size={24} />}
          {formIndex > -1 && <MaterialCommunityIcons name="check" color={colors.text} size={24} />}
        </TouchableOpacity>
      </View>

      <View style={styles.flatListContainer}>
        <FlatList
          inverted
          data={weights}
          contentContainerStyle={styles.flatlist}
          ref={ref => {
            flatListRef = ref;
          }}
          renderItem={({item, index}) => {
            return (
              <View>
                {index == weights.length - 1 && (
                  <TouchableOpacity
                    onPress={() => {
                      addSet();
                      scrollToTop();
                    }}
                    style={[styles.addSetButton, shadow.shadow]}>
                    <Text style={[common.h2, {color: colors.white}]}>Add Another Set</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.setHeader}>
                  <Text style={common.h2}>Set {index + 1}</Text>
                  <TouchableOpacity onPress={() => deleteSet(index)}>
                    <MaterialCommunityIcons name="close" color={colors.text} size={32} style={{marginRight: 16, borderRadius: 40, padding: 5}} />
                  </TouchableOpacity>
                </View>

                <View style={styles.weightInputContainer}>
                  <TextInput style={styles.input} onChangeText={newText => setWeightText(index, newText)} value={item} placeholder="Weight" keyboardType="numeric" maxLength={7} placeholderTextColor={colors.unselectedItem} />
                  <View style={styles.weightType}>
                    {userData[0].preferences && userData[0].preferences[0] == 'kg' && <Text style={common.h2}>kg</Text>}
                    {userData[0].preferences && userData[0].preferences[0] == 'lbs' && <Text style={common.h2}>lbs</Text>}
                  </View>
                </View>

                <TextInput style={[styles.input, {width: screenWidth - 72}, index == 0 && {marginBottom: 200}]} onChangeText={newText => setRepText(index, newText)} value={reps[index]} placeholder="Reps" keyboardType="numeric" maxLength={3} placeholderTextColor={colors.unselectedItem} />
              </View>
            );
          }}
        />
        {weights.length == 0 && (
          <TouchableOpacity
            onPress={() => {
              addSet();
              scrollToTop();
            }}
            style={[styles.addSetButton, shadow.shadow]}>
            <Text style={[common.h2, {color: colors.white}]}>Add Another Set</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};
