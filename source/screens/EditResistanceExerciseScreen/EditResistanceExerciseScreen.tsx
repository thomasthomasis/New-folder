import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {useUser, useRealm, useQuery} from '@realm/react';
import {ExtraExercises} from '../../schemas/ExtraExercisesSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './EditResistanceExerciseScreen.style';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp} from '@react-navigation/native';

type EditExerciseScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EditResistanceExercise'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'EditResistanceExercise'>;
};

export const EditResistanceExerciseScreen = ({navigation, route}: EditExerciseScreenProps) => {
  const realm = useRealm();
  const user = useUser();

  const {exercise} = route.params;

  const goBack = () => {
    console.log(navigation.goBack());
  };

  const selectedExercise = realm.objects(ExtraExercises).filtered('userId == $0 AND exerciseId == $1', user.id, exercise);

  const muscles = ['Neck', 'Back', 'Shoulders', 'Chest', 'Biceps', 'Triceps', 'Forearms', 'Core', 'Quads', 'Glutes', 'Hip Flexors', 'Groin', 'Hamstrings', 'Calves', 'Other'];

  const [boxChecked, setBoxChecked] = useState<boolean[]>([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
  const [selectedMuscles, setSelectedMuscles] = useState<string>('');
  const [exerciseName, setExerciseName] = useState<string>(selectedExercise[0].name ?? '');

  const addSelectedMuscle = (muscle: string, index: any) => {
    console.log(muscle, index);

    let musclesBefore = selectedMuscles;

    if (!musclesBefore.includes(muscle)) {
      const newMuscles = musclesBefore + (muscle + ',');
      setSelectedMuscles(newMuscles);

      console.log(newMuscles);
    } else {
      const newMuscles = musclesBefore.replace(muscle + ',', '');
      setSelectedMuscles(newMuscles);

      console.log(newMuscles);
    }

    const newCheckedBoxes = boxChecked;
    newCheckedBoxes[index] = !newCheckedBoxes[index];
    setBoxChecked(newCheckedBoxes);

    console.log(newCheckedBoxes);
  };

  const handleConfirm = () => {
    // Show confirmation popup
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to edit this exercise?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            editExercise(exerciseName, selectedMuscles);
            goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const editExercise = (name: string, extraInformation: string) => {
    realm.write(() => {
      selectedExercise[0].name = name;
      selectedExercise[0].extraInformation = extraInformation;
    });
  };

  useEffect(() => {
    let extraInformation = selectedExercise[0].extraInformation;
    let muscleGroups = extraInformation?.split(',') ?? [''];
    setSelectedMuscles(extraInformation as string);

    let array = [false, false, false, false, false, false, false, false, false, false, false, false, false, false];

    for (let i = 0; i < muscleGroups.length; i++) {
      if (muscles.includes(muscleGroups[i])) {
        let index = muscles.indexOf(muscleGroups[i]);
        array[index] = true;
      }
    }

    setBoxChecked(array);
  }, []);

  return (
    <ScrollView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: colors.black,
          marginBottom: 10,
        }}>
        <TouchableOpacity onPress={goBack}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={'white'}
            size={40}
            style={{
              marginLeft: 10,
              backgroundColor: 'black',
              borderRadius: 40,
              padding: 5,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleConfirm}>
          <MaterialCommunityIcons
            name="check"
            color={'white'}
            size={40}
            style={{
              marginRight: 10,
              backgroundColor: 'black',
              borderRadius: 40,
              padding: 5,
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={{marginBottom: 100}}>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 10,
            textAlign: 'center',
            fontWeight: '800',
          }}>
          Enter Exercise Name:
        </Text>
        <TextInput
          style={{
            height: 40,
            width: '80%',
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 20,
            padding: 10,
            marginRight: 'auto',
            marginLeft: 'auto',
          }}
          placeholder="Enter name..."
          value={exerciseName}
          onChangeText={setExerciseName}
        />
        <View style={[styles.borderBottom, {width: '100%', backgroundColor: 'gray', height: 3}]}></View>

        <Text
          style={{
            fontSize: 18,
            marginBottom: 5,
            fontWeight: '900',
            textAlign: 'center',
          }}>
          Select Muscles Involved
        </Text>
        <View style={styles.borderBottom}></View>
        {muscles.map((item, index) => (
          <View key={index} style={styles.muscleChoice}>
            <TouchableOpacity style={[styles.checkbox, boxChecked[index] && {backgroundColor: colors.green}]} onPress={() => addSelectedMuscle(item, index)}>
              <Text style={styles.checkBoxText}>{item}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
