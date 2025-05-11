import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Image, Dimensions, Alert, ActivityIndicator} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {LogWorkoutCardioScreen} from '../LogWorkoutCardioScreen/LogWorkoutCardioScreen';
import {LogWorkoutResistanceScreen} from '../LogWorkoutResistanceScreen/LogWorkoutResistanceScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SubmitCompletion} from '../SubmitCompletionScreen/SubmitCompletion';
import {shadow} from '../../sharedStyling/Shadow';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './LogWorkoutScreen.styles';
import Modal from 'react-native-modal';
import {useRealm, useUser} from '@realm/react';
import {Users} from '../../schemas/UsersSchema';
import {BarChart, PieChart} from 'react-native-gifted-charts';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {BSON} from 'realm';
import {UserStatistics} from '../../schemas/UserStatisticsSchema';
import {CardioWorkout} from '../../schemas/CardioWorkoutSchema';
import {ResistanceWorkout} from '../../schemas/ResistanceWorkoutSchema';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {HeaderComponent} from '../../components/HeaderComponent/HeaderComponent';

type LogWorkoutProps = {
  navigation: StackNavigationProp<RootStackParamList, 'LogWorkout'>;
};

export const LogWorkoutScreen = ({navigation}: LogWorkoutProps) => {
  const realm = useRealm();
  const user = useUser();
  const isFocused = useIsFocused();

  const logResitanceWorkout = () => {
    navigation.navigate('AddResistanceExercise', {firstVisit: true});
  };

  const goToSummaryScreen = (workoutType: string) => {
    if (workoutType == 'cardio') {
      navigation.navigate('CardioSetsSummary');
    } else if (workoutType == 'resistance') {
      navigation.navigate('ResistanceSetsSummary');
    }
  };

  const logCardioWorkout = () => {
    navigation.navigate('AddCardioExercise', {firstVisit: true});
  };

  const goToProfileSettings = () => {
    navigation.navigate('ProfileSettings');
  };

  let userData = realm.objects('Users').sorted('_id').filtered('userId == $0', user.id);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState(require('../../assets/3.png'));

  const [currentWorkoutResistance, setCurrentWorkoutResistance] = useState<any>([]);
  const [currentWorkoutCardio, setCurrentWorkoutCardio] = useState<any>([]);
  const [currentWorkoutType, setCurrentWorkoutType] = useState<string>('');
  const [continuingWorkout, setContinuingWorkout] = useState<boolean>(false);

  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
  });

  const loadCurrentWorkout = () => {
    storage
      .load({
        key: 'currentWorkoutResistance',
      })
      .then(ret => {
        setCurrentWorkoutResistance(ret.currentWorkout);
        console.log('Current Workout Resistance: ', ret.currentWorkout);
      })
      .catch(err => {
        console.warn(err.message);
      });

    storage
      .load({
        key: 'currentWorkoutCardio',
      })
      .then(ret => {
        setCurrentWorkoutCardio(ret.currentWorkout);
        console.log('Current Workout Cardio: ', ret.currentWorkout.length);
      })
      .catch(err => {
        console.warn(err.message);
      });
  };

  useEffect(() => {
    loadCurrentWorkout();
  }, [isFocused]);

  const continueWorkout = (workoutType: string) => {
    if (workoutType == 'resistance') {
      closeModal();
      goToSummaryScreen(workoutType);
    } else if (workoutType == 'cardio') {
      closeModal();
      goToSummaryScreen(workoutType);
    }
  };

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleConfirmDeleteCurrentWorkout = (workoutType: string) => {
    if (workoutType == 'Cardio') {
      closeModal();
      logCardioWorkout();
      return;
    } else if (workoutType == 'Resistance' && currentWorkoutResistance.length == 0) {
      closeModal();
      logResitanceWorkout();
      return;
    }

    // Show confirmation popup
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to delete your current ' + workoutType.toLowerCase() + ' workout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            if (workoutType == 'Resistance') {
              storage.remove({key: 'currentWorkoutResistance'});
              setCurrentWorkoutResistance([]);

              closeModal();
              logResitanceWorkout();
            } else if (workoutType == 'Cardio') {
              storage.remove({key: 'currentWorkoutCardio'});
              setCurrentWorkoutCardio([]);

              closeModal();
              logCardioWorkout();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  //set profile picture
  useEffect(() => {
    //console.log(userData)
    let profilePicture;
    if (userData[0]) {
      profilePicture = userData[0].profilePicture as string;
    }

    if (profilePicture) {
      console.log(profilePicture);
      if (profilePicture.includes('1')) {
        setImageSource(require('../../assets/1.png'));
      } else if (profilePicture.includes('2')) {
        setImageSource(require('../../assets/2.png'));
      } else if (profilePicture.includes('3')) {
        setImageSource(require('../../assets/3.png'));
      } else if (profilePicture.includes('4')) {
        setImageSource(require('../../assets/4.png'));
      } else {
        setImageSource(require('../../assets/defaultPFP.png'));
      }
    }
  }, [userData]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Users));

      mutableSubs.add(realm.objects(UserStatistics));

      mutableSubs.add(realm.objects(CardioWorkout));

      mutableSubs.add(realm.objects(ResistanceWorkout));
    });
  }, [realm, user]);

  const screenHeight = Dimensions.get('window').height;

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.green} />
      ) : (
        <>
          <HeaderComponent title={'UltiTracker'} goToProfileSettings={goToProfileSettings} />

          <TouchableOpacity style={[styles.modalButton, shadow.shadow]} onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons name={'plus'} size={40} color={'white'} />
          </TouchableOpacity>

          <Modal isVisible={modalVisible} swipeDirection={['down']} onSwipeComplete={closeModal} onBackdropPress={closeModal} style={styles.modalView}>
            <View style={styles.modalContent}>
              <View style={styles.containerModal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>Log a Workout</Text>
                </View>
                {currentWorkoutResistance.length > 0 && (
                  <View>
                    <TouchableOpacity style={[styles.modalCard, shadow.shadow]} onPress={() => continueWorkout('resistance')}>
                      <Text style={styles.buttonText}>Continue Strength Workout</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {currentWorkoutCardio.length > 0 && (
                  <View>
                    <TouchableOpacity style={[styles.modalCard, shadow.shadow]} onPress={() => continueWorkout('cardio')}>
                      <Text style={styles.buttonText}>Continue Cardio Workout</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.rowModal}>
                  <TouchableOpacity
                    style={[styles.modalCard, shadow.shadow]}
                    onPress={() => {
                      handleConfirmDeleteCurrentWorkout('Cardio');
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '800',
                        color: colors.text,
                      }}>
                      Cardio
                    </Text>
                    <MaterialCommunityIcons name="heart" color={colors.red} size={55} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalCard, shadow.shadow]}
                    onPress={() => {
                      handleConfirmDeleteCurrentWorkout('Resistance');
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '800',
                        color: colors.text,
                      }}>
                      Strength
                    </Text>
                    <MaterialCommunityIcons name="dumbbell" color={colors.black} size={55} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalCard, shadow.shadow]}
                    onPress={() => {
                      closeModal();
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '800',
                        color: colors.text,
                      }}>
                      Throwing
                    </Text>
                    <MaterialCommunityIcons name="disc" color={colors.green} size={55} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </>
  );
};
