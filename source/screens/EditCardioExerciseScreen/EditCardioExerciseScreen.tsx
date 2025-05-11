import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {useUser, useRealm, useQuery} from '@realm/react';
import {ExtraExercises} from '../../schemas/ExtraExercisesSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './EditCardioExerciseScreen.style';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp} from '@react-navigation/native';

type EditCardioExerciseScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EditCardioExercise'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'EditCardioExercise'>;
};

export const EditCardioExerciseScreen = ({navigation, route}: EditCardioExerciseScreenProps) => {
  const realm = useRealm();
  const user = useUser();

  const {exercise} = route.params;

  const goBack = () => {
    console.log(navigation.goBack());
  };

  const selectedExercise = realm.objects(ExtraExercises).filtered('userId == $0 AND exerciseId == $1', user.id, exercise);

  const [exerciseName, setExerciseName] = useState<string>(selectedExercise[0].name ?? '');

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
            editExercise(exerciseName);
            goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const editExercise = (name: string) => {
    realm.write(() => {
      selectedExercise[0].name = name;
    });
  };

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: colors.red,
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
      <View style={styles.container}>
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
        </View>
      </View>
    </>
  );
};
