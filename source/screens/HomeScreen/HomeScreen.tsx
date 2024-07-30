import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import { useRealm, useQuery, useUser} from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import styles from './HomeScreen.style';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { shadow } from '../../sharedStyling/Shadow';
import { useIsFocused } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Workouts } from '../../schemas/WorkoutSchema';
import { CalendarComponent } from '../../components/CalendarComponent/CalendarComponent';
import { colors } from '../../sharedStyling/Colors';
import { BSON } from 'realm';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { CardioWorkout } from '../../schemas/CardioWorkoutSchema';
import { ResistanceWorkout } from '../../schemas/ResistanceWorkoutSchema';
import { HeaderComponent } from '../../components/HeaderComponent/HeaderComponent';
import { common } from '../../sharedStyling/CommonStyle';
import { TrainingWorkout } from '../../schemas/TrainingWorkoutSchema';

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const HomeScreen = ({ navigation }: HomeScreenProps) => {

  const realm = useRealm()
  const user = useUser()
  const isFocused = useIsFocused()

  const logResitanceWorkout = () => {
    navigation.navigate("LogWorkoutResistance", {continuingWorkout: false, navigationScreen: 'Home'})
  }

  const logCardioWorkout = () => {
    navigation.navigate("LogWorkoutCardio", { continuingWorkout: false, navigationScreen: 'Home'})
  }

  const goToProfileSettings = () => {
    navigation.navigate("ProfileSettings")
  }

  const goToWorkoutDisplay = (specificWorkoutId:any, workoutType:string, generalWorkoutId:string) => {
    navigation.navigate("WorkoutDisplay", { specificWorkoutId:specificWorkoutId, workoutType:workoutType, generalWorkoutId:generalWorkoutId})
  }
  

  const [userData, setUserData] = useState<any>(realm.objects("Users").sorted('_id').filtered("userId == $0", user.id));
  const [workouts, setWorkouts] = useState<any>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [imageSource, setImageSource] = useState(require("../../assets/defaultPFP.png"))

  const [currentWorkout, setCurrentWorkout] = useState<any>([]);
  const [currentWorkoutType, setCurrentWorkoutType] = useState<string>('')
  const [continuingWorkout, setContinuingWorkout] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)


  const closeModal = () => {
    setModalVisible(false)
  }

  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
  })

  const loadCurrentWorkout = () => {
    storage.load({
      key: 'currentWorkout'
    })
    .then(ret => {setCurrentWorkout(ret.forms); console.log(ret.forms.length)})
    .catch(err => {
      console.warn(err.message);
    })

    storage.load({
      key: 'workoutType'
    })
    .then(ret => {setCurrentWorkoutType(ret.workoutType)})
    .catch(err => {
      console.warn(err.message);
    })
  }

  useEffect(() => {

    setLoading(true)

    console.log("main useEffect")
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    let workoutsArray = realm.objects(Workouts).sorted('dateCreated', true).filtered('dateCreated >= $0 AND dateCreated < $1 AND userId == $2', startOfMonth, endOfMonth, user.id).slice(0,10);

    divideWorkoutsIntoSections(workoutsArray)

  }, [])
 
  useEffect(() => {

  }, [isFocused])

  const handleConfirmDeleteCurrentWorkout = (workoutType:string) => {
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
              }
            })
        
            storage.save({
              key: 'workoutType',
              data: {
                workoutType: "",
              }
            })
            setCurrentWorkout([])
            setCurrentWorkoutType("")

            if(workoutType == "Cardio")
            {
              closeModal()
              logCardioWorkout()
              
            }
            else if(workoutType == "Resistance")
            {
              closeModal()
              logResitanceWorkout()
              
            }

            
          }
        },
      ],
      { cancelable: false }
    );
  };

  

  const setWorkoutsFromCalendarComponent = (workouts:any) => {
    
    divideWorkoutsIntoSections(workouts)

    console.log("Workouts passed from component: ", workouts)
  }

  const divideWorkoutsIntoSections = (workouts:any) => {

    let daysArray:any[] = [];
    let array:any[] = []

    for(let i = 0; i < workouts.length; i++)
    {
      let date = workouts[i].dateCreated;
      let day = date.toString().split(" ")[2]
      console.log(day)

      if(!daysArray.includes(day))
      {
        daysArray.push(day)
        let object = {
          date:date,
          workouts: [workouts[i]],
        }

        array.push(object)
      }
      else
      {
        let index = daysArray.indexOf(day)

        array[index].workouts.push(workouts[i])
      }
     
    }

    console.log(daysArray)
    console.log(array)

    setWorkouts(array)
    setLoading(false)
    
  }

  

  const formatDate = (date:Date) => {
   
    
    let dateString = date.toString()

    console.log(dateString)

    let day = dateString.split(" ")[0]
    let dayNum = dateString.split(" ")[2]
    let month = dateString.split(" ")[1]

    let prefix = ""

    if (parseInt(day) >= 11 && parseInt(day) <= 13) {
      prefix = 'th';
    }
  
    switch (parseInt(day) % 10) {
      case 1:
        prefix = 'st';
      case 2:
        prefix = 'nd';
      case 3:
        prefix = 'rd';
      default:
        prefix = 'th';
    }

    return day + " " + dayNum + prefix + " " + month;
    
  }

  const truncateText = (text:string, limit:number) => {
    if (text.length > limit) {
        return text.substring(0, limit) + '...';
      }
      return text;
}

  const calculateTotalVolumeAndReps = (workout:any) => {

    let totalVolume = workout[0].totalVolume;
    let totalReps = workout[0].totalReps;

    return { totalReps, totalVolume }
  }

  const calculateTotalDistanceAndTime = (workout:any) => {
    let totalDistance = workout[0].totalDistance;
    let totalTime = workout[0].totalTime;

    return { totalDistance, totalTime }
  }

  const getDuration = (amount:number) => {
    const diffInMs = amount;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30); // Approximation
    const diffInYears = Math.floor(diffInDays / 365); // Approximation
  
    if (diffInYears > 0) return `${diffInYears} years`;
    if (diffInMonths > 0) return `${diffInMonths} months`;
    if (diffInWeeks > 0) return `${diffInWeeks} weeks`;
    if (diffInDays > 0) return `${diffInDays} days`;
    if (diffInHours > 0) return `${diffInHours} hours`;
    if (diffInMinutes > 0) return `${diffInMinutes} minutes`;
    return `${diffInSeconds} seconds`;
}


  //set profile picture
  useEffect(() => {
    //console.log(userData)
    let profilePicture;
    if(userData[0])
    {
      profilePicture = userData[0].profilePicture as string;
    }
    
    if(profilePicture)
    {
      console.log(profilePicture)
      if(profilePicture.includes('1'))
        {
          setImageSource(require('../../assets/1.png'))
        }
        else if(profilePicture.includes('2'))
        {
          setImageSource(require('../../assets/2.png'))
        }
        else if(profilePicture.includes('3'))
        {
          setImageSource(require('../../assets/3.png'))
        }
        else if(profilePicture.includes('4'))
        {
          setImageSource(require('../../assets/4.png'))
        }
        else
        {
          setImageSource(require('../../assets/defaultPFP.png'))
        }
    }

    setLoading(false)
      
    }, [isFocused])
  
  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
        mutableSubs.add(
        realm.objects(Users),
        );
    });
    }, [realm, user]);

    return (
      <>
        <HeaderComponent goToProfileSettings={goToProfileSettings} title={'History'} />

        <TouchableOpacity style={[styles.modalButton, shadow.shadow]} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name={"plus"} size={40} color={'white'}/>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CalendarComponent setWorkouts={setWorkoutsFromCalendarComponent}/>
        <View style={styles.containerWorkouts}>
          <View style={{width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: 8, }}>
          <Text style={[{textAlign: 'left', }, common.h2]}>Logged Workouts</Text>
          </View>
          {
            loading &&
            <View style={{width: '100%', height: screenHeight, display: 'flex', justifyContent: 'center'}}>
              <ActivityIndicator size={'large'} color={colors.text} />
            </View>
          }
        {
          !loading &&
          workouts.map((item:any, index:any) => (
            <View key={index} style={[{paddingLeft: 8, paddingRight: 8}]}>
              <Text style={[common.h3, {marginBottom: 12, marginTop: 12}]}>{formatDate(item.date)}</Text>
              {
                item.workouts.map((itemWorkout:any) => {

                  if(!itemWorkout.isValid())
                  {
                    return null
                  }

                  let iconName = "heart"
                  let color = colors.red;
                  let name = "Test Name 123"
                  let object = null;
                  let data = null;
                  let shownData1 = "";
                  let shownData2 = "";
                  if(itemWorkout.workoutType == "Cardio")
                  {
                    iconName = "heart"
                    color = colors.red;
                    name = "Test Name 345"
                    object = realm.objects(CardioWorkout).filtered("_id == $0", itemWorkout.workoutId);
                    if(object.length > 0)
                    {
                      data = calculateTotalDistanceAndTime(object)
                      shownData1 = data.totalDistance + "km";
                      shownData2 = data.totalTime + "m";
                    }
                  }
                  else if(itemWorkout.workoutType == "Resistance")
                  {
                    iconName = "dumbbell"
                    color = colors.black;
                    name = "Time to grow some tree trunks"
                    object = realm.objects(ResistanceWorkout).filtered("_id == $0", itemWorkout.workoutId);
                    if(object.length > 0)
                    {
                      data = calculateTotalVolumeAndReps(object)
                      shownData1 = data.totalVolume + "kg";
                      shownData2 = data.totalReps + " reps";
                    }
                    
                  }
                  else if(itemWorkout.workoutType == "Training")
                  {
                    iconName = "soccer-field"
                    color = colors.orange;
                    name = "Tuesday Training"
                    object = realm.objects(TrainingWorkout).filtered("_id == $0", itemWorkout.workoutId);
                    if(object.length > 0)
                    {
                      data = getDuration(object[0].totalDuration ?? 0)
                      shownData1 = data;
                    }
                    
                  }

                  return (
                    <TouchableOpacity key={new BSON.ObjectId().toString()} style={[styles.card, shadow.shadow]} onPress={() => goToWorkoutDisplay(itemWorkout.workoutId, itemWorkout.workoutType, itemWorkout._id)}>
                      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <MaterialCommunityIcons name={iconName} size={24} color={color} style={{marginRight: 16}}/>
                        <Text style={[common.h3, {marginRight: 16, width: 96}]}>{truncateText(name, 24)}</Text>
                        <View style={styles.verticalBorder}></View>
                      </View>
                      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column'}}>
                        <Text style={[common.body, {opacity: 0.8}]}>{shownData1}</Text>
                        <Text style={[common.body, {opacity: 0.8}]}>{shownData2}</Text>
                      </View>
                      
                    
                  </TouchableOpacity>
                  )
                  
              })
              }
            </View>
          ))
        }
        </View>
        
      </ScrollView>

      <Modal
          isVisible={modalVisible}
          swipeDirection={['down']}
          onSwipeComplete={closeModal}
          onBackdropPress={closeModal}
          style={styles.modalView}
      >
          <View style={styles.modalContent}>
          <View style={styles.containerModal}> 
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Log a Workout</Text> 
            </View>
            {
              currentWorkout.length > 0 &&
              <View>
                <TouchableOpacity style={[styles.modalCard, shadow.shadow]} onPress={() => {console.log("continue workout")}}>
                  <Text style={styles.buttonText}>Continue Workout</Text>
                </TouchableOpacity>
              </View>
            }
            <View style={styles.rowModal}>
              <TouchableOpacity style={[styles.modalCard, shadow.shadow]} onPress={() => {handleConfirmDeleteCurrentWorkout("Cardio")}}>
                <Text style={{fontSize: 20, fontWeight: '800', color: colors.text}}>Cardio</Text>
                <MaterialCommunityIcons name="heart" color={colors.red} size={55}/>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalCard, shadow.shadow]} onPress={() => {handleConfirmDeleteCurrentWorkout("Resistance")}}>
                <Text style={{fontSize: 20, fontWeight: '800', color: colors.text}}>Strength</Text>
                <MaterialCommunityIcons name="dumbbell" color={colors.black} size={55}/>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalCard, shadow.shadow]} onPress={() => {closeModal();}}>
                <Text style={{fontSize: 20, fontWeight: '800', color: colors.text}}>Throwing</Text>
                <MaterialCommunityIcons name="disc" color={colors.green} size={55}/>
              </TouchableOpacity>
            </View>
            
          </View>
              
          </View>
      </Modal>

      </>
      
      );
}
