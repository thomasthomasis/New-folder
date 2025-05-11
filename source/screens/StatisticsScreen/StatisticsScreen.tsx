import React, {useState, useEffect} from 'react';
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useRealm, useUser} from '@realm/react';
import {Users} from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserStatistics} from '../../schemas/UserStatisticsSchema';
import {shadow} from '../../sharedStyling/Shadow';
import styles from './StatisticsScreen.style';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp} from '@react-navigation/native';
import {colors} from '../../sharedStyling/Colors';
import {useFocusEffect} from '@react-navigation/native';
import {Workouts} from '../../schemas/WorkoutSchema';
import Modal from 'react-native-modal';
import {GeneralLineChartComponent} from '../../components/GeneralLineChartComponent/GeneralLineChartComponent';
import {GeneralPieChart} from '../../components/GeneralPieChartComponent/GeneralPieChartComponent';
import {StackedBarChartComponent} from '../../components/StackedBarChartComponent/StackedBarChartComponent';
import {HeaderComponent} from '../../components/HeaderComponent/HeaderComponent';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StatisticsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Statistics'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'Statistics'>;
};

//const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const StatisticsScreen = ({
  navigation,
  route,
}: StatisticsScreenProps) => {
  const realm = useRealm();
  const user = useUser();

  const {userId} = route.params;

  const goToProfileSettings = () => {
    navigation.navigate('ProfileSettings');
  };

  const logResitanceWorkout = () => {
    navigation.navigate('LogWorkoutResistance', {
      continuingWorkout: false,
      navigationScreen: 'Home',
    });
  };

  const logCardioWorkout = () => {
    navigation.navigate('LogWorkoutCardio', {
      continuingWorkout: false,
      navigationScreen: 'Home',
    });
  };

  const goToStatsScreen = (type: string) => {
    if (type == 'Resistance') {
      navigation.navigate('ResistanceStats', {userId: userId});
    } else if (type == 'Cardio') {
      navigation.navigate('CardioStats', {userId: userId});
    }
  };

  const [userData, setUserData] = useState<any>(
    realm.objects('Users').sorted('_id').filtered('userId == $0', userId),
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentWorkout, setCurrentWorkout] = useState<any>([]);
  const [currentWorkoutType, setCurrentWorkoutType] = useState<string>('');

  console.log('Current Workout: ', currentWorkoutType);

  const closeModal = () => {
    setModalVisible(false);
  };

  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
  });

  useFocusEffect(
    React.useCallback(() => {
      let data = realm
        .objects('Users')
        .sorted('_id')
        .filtered('userId == $0', userId);
      setUserData(data);
    }, [realm, userId]),
  );

  const handleConfirmDeleteCurrentWorkout = (workoutType: string) => {
    // Show confirmation popup
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to delete your current workout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            storage.save({
              key: 'currentWorkout',
              data: {
                forms: [],
              },
            });

            storage.save({
              key: 'workoutType',
              data: {
                workoutType: '',
              },
            });
            setCurrentWorkout([]);
            setCurrentWorkoutType('');

            if (workoutType == 'Cardio') {
              closeModal();
              logCardioWorkout();
            } else if (workoutType == 'Resistance') {
              closeModal();
              logResitanceWorkout();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const [imageSource, setImageSource] = useState(require('../../assets/3.png'));
  console.log('Image Source: ', imageSource);

  useEffect(() => {
    //console.log(userData)
    let user = userData[0];
    let profilePicture: string = user.profilePicture as string;

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
      }
    }
  }, [userData]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Users));

      mutableSubs.add(realm.objects(UserStatistics));

      mutableSubs.add(realm.objects(Workouts));
    });
  }, [realm, user]);

  const [loading, setLoading] = useState<boolean>(true);

  const [activeFilter, setActiveFilter] = useState(0);
  const [workoutData, setWorkoutData] = useState<any>(null);

  const [startDate, setStartDate] = useState<Date>(new Date(0));
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
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
          startDate = new Date(
            currentDate.getFullYear() - 1,
            currentDate.getMonth(),
            currentDate.getDate(),
          );
          endDate = currentDate;
          break;
        case 2:
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 5,
            currentDate.getDate(),
          );
          endDate = currentDate;
          break;
        case 3:
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 3,
            currentDate.getDate(),
          );
          endDate = currentDate;
          break;
        case 4:
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            currentDate.getDate(),
          );
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

    let {startDate, endDate} = getDateRange(activeFilter);
    setStartDate(startDate);
    setEndDate(endDate);

    const workouts = realm
      .objects(Workouts)
      .filtered(
        'userId == $0 AND dateCreated >= $1 AND dateCreated <= $2',
        userId,
        startDate,
        endDate,
      );
    setWorkoutData(workouts);

    console.log('Workouts: ', workouts.length);

    if (workouts) {
      setLoading(false);
    }

    //setWorkoutData([])
  }, [activeFilter, realm, userId]);

  const setSpecificTime = (
    date: any,
    hours: any,
    minutes: any,
    seconds: any,
    milliseconds: any,
  ) => {
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(milliseconds);
    return date;
  };

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

  return (
    <>
      {loading && <ActivityIndicator size={'large'} />}
      {!loading && (
        <>
          <HeaderComponent
            title={'Statistics'}
            goToProfileSettings={goToProfileSettings}
          />

          <TouchableOpacity
            style={[styles.modalButton, shadow.shadow]}
            onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons name={'plus'} size={40} color={'white'} />
          </TouchableOpacity>
          <ScrollView>
            <View style={styles.container}>
              <View style={[styles.containerProfile, shadow.shadow]}>
                <Text style={styles.profileText}>Profile Stats</Text>
                <View style={styles.profileRow}>
                  <View style={styles.profileLevelContainer}>
                    <View style={styles.profileLevel}>
                      <Text style={styles.profileLevelText}>3</Text>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: '800',
                        color: colors.black,
                        textAlign: 'center',
                      }}>
                      Noob
                    </Text>
                    <View
                      style={{
                        width: screenWidth - 210,
                        height: 15,
                        borderRadius: 10,
                        backgroundColor: colors.black,
                      }}></View>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      width: 50,
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text style={{fontWeight: '700', fontSize: 20}}>0</Text>
                      <MaterialCommunityIcons
                        name="medal-outline"
                        color={colors.black}
                        size={40}
                        style={{marginLeft: 5}}
                      />
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text style={{fontWeight: '700', fontSize: 20}}>2</Text>
                      <MaterialCommunityIcons
                        name="account-group"
                        color={colors.black}
                        size={40}
                        style={{marginLeft: 5}}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {workoutData.length == 0 && (
                <View style={{marginTop: 25, height: 400}}>
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: '800',
                      color: colors.black,
                    }}>
                    No Workout Data!
                  </Text>
                </View>
              )}
              {workoutData.length > 0 && (
                <>
                  <View style={styles.containerFilters}>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        activeFilter === 0 && {backgroundColor: colors.green},
                      ]}
                      onPress={() => setActiveFilter(0)}>
                      <Text style={styles.filterButtonText}>Max</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        activeFilter === 1 && {backgroundColor: colors.green},
                      ]}
                      onPress={() => setActiveFilter(1)}>
                      <Text style={styles.filterButtonText}>1Y</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        activeFilter === 2 && {backgroundColor: colors.green},
                      ]}
                      onPress={() => setActiveFilter(2)}>
                      <Text style={styles.filterButtonText}>6M</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        activeFilter === 3 && {backgroundColor: colors.green},
                      ]}
                      onPress={() => setActiveFilter(3)}>
                      <Text style={styles.filterButtonText}>3M</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        activeFilter === 4 && {backgroundColor: colors.green},
                      ]}
                      onPress={() => setActiveFilter(4)}>
                      <Text style={styles.filterButtonText}>1M</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{marginTop: 25}}>
                    <GeneralLineChartComponent
                      data={workoutData}
                      startDate={startDate}
                      endDate={endDate}
                      filter={activeFilter}
                    />
                  </View>

                  <View style={styles.containerPieCharts}>
                    <GeneralPieChart data={workoutData} type="workoutType" />
                    <GeneralPieChart data={workoutData} type="status" />
                  </View>

                  <View>
                    <StackedBarChartComponent
                      data={workoutData}
                      type={'workoutType'}
                    />
                    <StackedBarChartComponent
                      data={workoutData}
                      type={'status'}
                    />
                  </View>

                  <View
                    style={{
                      width: screenWidth,
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginTop: 25,
                    }}>
                    <TouchableOpacity
                      style={{
                        width: screenWidth / 2 - 20,
                        height: 70,
                        borderRadius: 15,
                        backgroundColor: colors.red,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => goToStatsScreen('Cardio')}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '800',
                          color: 'white',
                        }}>
                        Cardio
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: screenWidth / 2 - 20,
                        height: 70,
                        borderRadius: 15,
                        backgroundColor: colors.black,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => goToStatsScreen('Resistance')}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '800',
                          color: 'white',
                        }}>
                        Resistance
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          <Modal
            isVisible={modalVisible}
            swipeDirection={['down']}
            onSwipeComplete={closeModal}
            onBackdropPress={closeModal}
            style={styles.modalView}>
            <View style={styles.modalContent}>
              <View style={styles.containerModal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>Log a Workout</Text>
                </View>
                {currentWorkout.length > 0 && (
                  <View>
                    <TouchableOpacity
                      style={[styles.modalCard, shadow.shadow]}
                      onPress={() => {
                        console.log('continue workout');
                      }}>
                      <Text style={styles.buttonText}>Continue Workout</Text>
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
                    <MaterialCommunityIcons
                      name="heart"
                      color={colors.red}
                      size={55}
                    />
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
                    <MaterialCommunityIcons
                      name="dumbbell"
                      color={colors.black}
                      size={55}
                    />
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
                    <MaterialCommunityIcons
                      name="disc"
                      color={colors.green}
                      size={55}
                    />
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
