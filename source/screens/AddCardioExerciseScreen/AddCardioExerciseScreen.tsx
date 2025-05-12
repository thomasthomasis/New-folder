import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {Alert, Text, View, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {BSON} from 'realm';
import {useUser, useRealm, useQuery} from '@realm/react';
import {Workouts} from '../../schemas/WorkoutSchema';
import {UserStatistics} from '../../schemas/UserStatisticsSchema';
import {ExtraExercises} from '../../schemas/ExtraExercisesSchema';
import {shadow} from '../../sharedStyling/Shadow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './AddCardioExerciseScreen.style';
import {useIsFocused} from '@react-navigation/native';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp} from '@react-navigation/native';
import {Users} from '../../schemas/UsersSchema';
import {common} from '../../sharedStyling/CommonStyle';
import {CardioWorkout} from '../../schemas/CardioWorkoutSchema';

type AddCardioExerciseScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AddCardioExercise'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'AddCardioExercise'>;
};

export const AddCardioExerciseScreen = ({navigation, route}: AddCardioExerciseScreenProps) => {
  const realm = useRealm();
  const user = useUser();
  const isFocused = useIsFocused();

  const {firstVisit} = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const goBackToSummaryScreen = () => {
    navigation.navigate('CardioSetsSummary');
  };

  const logCardioWorkout = (exerciseId: string) => {
    navigation.navigate('AddCardioExerciseSets', {
      exerciseId: exerciseId,
      formIndex: -1,
    });
  };

  const userData = useQuery(Users).filtered('userId == $0', user.id);
  const extraExercises = useQuery(ExtraExercises).filtered('userId == $0 && type == $1', user.id, 'Cardio');
  const [favouriteExercises, setFavouriteExercises] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searcModalVisible, setSearchModalVisible] = useState<boolean>(false);
  const [searchedExercises, setSearchedExercises] = useState<string[]>([]);
  const [previousSearchedExercises, setPreviousSearchedExercises] = useState<string[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<any>([]);

  // Removed duplicate declaration of 'storage' and wrapped initialization in useMemo
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
      distanceInputs: [{id: 1, value: ''}],
      timeInputs: [{id: 1, value: ''}],
      extraNotes: {id: 1, value: ''},
    };

    currentWorkoutArray.push(newForm);
    console.log(currentWorkoutArray);

    saveCurrentWorkout(currentWorkoutArray, exerciseId);
  };

  const saveCurrentWorkout = async (array: any, exerciseId: string) => {
    try {
      await storage.save({
        key: 'currentWorkoutCardio',
        data: {
          currentWorkout: array,
        },
      });

      logCardioWorkout(exerciseId);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const loadCurrentWorkout = async () => {
      try {
        await storage
          .load({
            key: 'currentWorkoutCardio',
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
    };
    loadCurrentWorkout();
  }, [isFocused, storage]);

  const getFavouriteExercises = useCallback(() => {
    let favouriteExercisesArray = [];

    let favourites = userData[0].favouriteExercises;
    if (favourites) {
      for (let i = 0; i < favourites.length; i++) {
        if (favourites[i].includes('?cardio')) {
          favouriteExercisesArray.push(favourites[i]);
        }
      }

      setFavouriteExercises(favouriteExercisesArray);
    }
  }, [userData]);

  useEffect(() => {
    getFavouriteExercises();
  }, [isFocused, getFavouriteExercises]);

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
            storage.remove({key: 'currentWorkoutCardio'});
            goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const getExerciseName = (id: string) => {
    id = id.split('?')[0];

    for (let i = 0; i < normalExercises.length; i++) {
      if (id == normalExercises[i].id) {
        return normalExercises[i].name;
      }
    }
  };

  const getExerciseId = (name: string) => {
    for (let i = 0; i < normalExercises.length; i++) {
      if (name == normalExercises[i].name) {
        return normalExercises[i].id ?? '';
      }
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
      setSearchedExercises([]);
    } else {
      let array: string[] = [];
      for (let i = 0; i < normalExercises.length; i++) {
        let searchString = text.toLowerCase();
        let name = normalExercises[i].name.toLowerCase();

        if (name.includes(searchString)) {
          if (array.length > 10) {
            break;
          }
          array.push(normalExercises[i].name);
        }
      }

      setSearchedExercises(array);
    }
  };

  const normalExercises = useMemo(() => {
    return [
      {id: '0', name: 'Running'},
      {id: '1', name: 'Cycling'},
      {id: '2', name: 'Swimming'},
      {id: '3', name: 'Rowing'},
      {id: '4', name: 'Elliptical'},
      {id: '5', name: 'Stair Climbing'},
      {id: '6', name: 'Skipping'},
    ];
  }, []);

  const addExtraExercises = useCallback(() => {
    for (let i = 0; i < extraExercises.length; i++) {
      let object = {
        id: '',
        name: '',
      };

      let name = extraExercises[i].name ?? '';
      let id = extraExercises[i].exerciseId;

      object.id = id;
      object.name = name;

      normalExercises.push(object);
    }
  }, [extraExercises, normalExercises]);

  const favouriteExercise = (exerciseId: string) => {
    let id = '';
    for (let i = 0; i < normalExercises.length; i++) {
      if ((normalExercises[i].id = exerciseId)) {
        id = normalExercises[0].id;
      }
    }

    realm.write(() => {
      if (userData[0].favouriteExercises?.includes(id + '?cardio')) {
        let index = userData[0].favouriteExercises?.indexOf(id + '?cardio');
        if (index >= 0) {
          userData[0].favouriteExercises?.splice(index, 1);
        }
      } else {
        userData[0].favouriteExercises?.push(id + '?cardio');
      }
    });

    getFavouriteExercises();

    console.log(userData[0].favouriteExercises);
  };

  // Removed duplicate declaration of 'storage'

  const saveSearchedExercises = (exerciseId: string) => {
    let oldArray = previousSearchedExercises;
    if (oldArray.includes(exerciseId)) {
      let index = oldArray.indexOf(exerciseId);
      oldArray.splice(index, 1);
    }

    oldArray.unshift(exerciseId);

    storage.save({
      key: 'recentSearchesCardio',
      data: {
        exerciseIdArray: oldArray,
      },
    });

    loadSearchedWorkouts();
  };

  const loadSearchedWorkouts = useCallback(() => {
    storage
      .load({
        key: 'recentSearchesCardio',
      })
      .then(ret => {
        setPreviousSearchedExercises(ret.exerciseIdArray);
        console.log(ret.exerciseIdArray);
      })
      .catch(err => {
        console.warn(err.message);
      });
  }, [storage]);

  useEffect(() => {
    loadSearchedWorkouts();
  }, [loadSearchedWorkouts]);

  useEffect(() => {
    addExtraExercises();
  }, [addExtraExercises, extraExercises]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(CardioWorkout));

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
        {favouriteExercises && favouriteExercises.length > 0 && (
          <>
            <Text style={[styles.title, common.h2]}>Favourites</Text>
            <View style={[styles.containerFavourites]}>
              {favouriteExercises?.map((item, index) => (
                <TouchableOpacity key={index} style={[styles.favouriteExercise, shadow.shadow]}>
                  <Text style={common.h3}>{getExerciseName(item)}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(item.split('?')[0]);
                    }}>
                    {favouriteExercises?.includes(item) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!favouriteExercises?.includes(item) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={[styles.title, common.h2]}>All Exercises</Text>
        {normalExercises.map(item => {
          return (
            <TouchableOpacity
              key={new BSON.ObjectID().toString()}
              style={styles.accordionHeader}
              onPress={() => {
                handleAddForm(item.id);
              }}>
              <Text style={common.h3}>{item.name}</Text>
              <TouchableOpacity
                onPress={() => {
                  favouriteExercise(item.id);
                }}>
                {favouriteExercises?.includes(item.id + '?cardio') && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                {!favouriteExercises?.includes(item.id + '?cardio') && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

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
                {favouriteExercises &&
                  previousSearchedExercises.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.searchedExercise,
                        index == previousSearchedExercises.length - 1 && {
                          borderBottomWidth: 0,
                        },
                      ]}
                      onPress={() => saveSearchedExercises(item)}>
                      <Text style={[common.h3]}>{getExerciseName(item)}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          favouriteExercise(item);
                        }}>
                        {favouriteExercises?.includes(item) && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                        {!favouriteExercises?.includes(item) && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
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
            {favouriteExercises &&
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
                  onPress={() => saveSearchedExercises(getExerciseId(item.toString()) ?? '')}>
                  <Text style={common.h3}>{item.toString()}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      favouriteExercise(getExerciseId(item.toString()) ?? '');
                    }}>
                    {favouriteExercises?.includes(getExerciseId(item.toString()) ?? '') && <MaterialCommunityIcons name="star" color={colors.green} size={24} />}
                    {!favouriteExercises?.includes(getExerciseId(item.toString()) ?? '') && <MaterialCommunityIcons name="star-outline" color={colors.lightGreen} size={24} />}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </View>
          <TouchableOpacity style={styles.backdrop} onPress={onClose}></TouchableOpacity>
        </View>
      )}
    </>
  );
};
