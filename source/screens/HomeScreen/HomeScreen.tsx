import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
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

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

export const HomeScreen = ({ navigation }: HomeScreenProps) => {

  const realm = useRealm()
  const user = useUser()
  const isFocused = useIsFocused()

  const logResitanceWorkout = () => {
    navigation.navigate("LogWorkoutResistance", {continuingWorkout: false})
  }

  const logCardioWorkout = () => {
    navigation.navigate("LogWorkoutCardio", { continuingWorkout: false})
  }

  const goToProfileSettings = () => {
    navigation.navigate("ProfileSettings")
  }

  const goToWorkoutDisplay = (data:any, dataType:string) => {
    navigation.navigate("WorkoutDisplay", { data:data, dataType:dataType})
  }
  

  const [userData, setUserData] = useState<any>(realm.objects("Users").sorted('_id').filtered("userId == $0", user.id));
  const currentDate = new Date()
  const [year, setYear] = useState<number>(currentDate.getFullYear())
  const [month, setMonth] = useState<number>(currentDate.getMonth())
  const [startOfMonth, setStartOfMonth] = useState<Date>(new Date(year, month, 1))
  const [endOfMonth, setEndOfMonth] = useState<Date>(new Date(year, month + 1, 0))
  const [workouts, setWorkouts] = useState<any>([])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [imageSource, setImageSource] = useState(require("../../assets/3.png"))

  const [selectedDay, setSelectedDay] = useState<string>('')

  const [workoutObjectsOfCurrentDay, setWorkoutObjectsOfCurrentDay] = useState<any>(null)
  const [currentWorkout, setCurrentWorkout] = useState<any>([]);
  const [currentWorkoutType, setCurrentWorkoutType] = useState<string>('')
  const [continuingWorkout, setContinuingWorkout] = useState<boolean>(false)

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
    loadCurrentWorkout()

    console.log("Current Workout: ", currentWorkout)
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

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const closeModal = () => {
    setModalVisible(false)
  }

  const setWorkoutsFromCalendarComponent = (workouts:any) => {
    
    divideWorkoutsIntoSections(workouts)

    console.log("Workouts passed from component: ", workouts)
  }

  useEffect(() => {
    let workouts = realm.objects(Workouts).sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1 AND userId == $2', startOfMonth, endOfMonth, user.id);
    divideWorkoutsIntoSections(workouts)
  }, [])

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
  }

  const selectDay = (day:string) => {
    if(day == selectedDay)
    {
      setSelectedDay('')
      let workouts = realm.objects(Workouts).sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1 AND userId == $2', startOfMonth, endOfMonth, user.id);
      divideWorkoutsIntoSections(workouts)
      return;
    }
    else
    {
      setSelectedDay(day)
    }

    console.log(day)

    const newDate = new Date(year, month, Number(day))
    const startOfDay = new Date(newDate)
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(newDate)
    endOfDay.setHours(23, 59, 59, 999)

    let workoutsOfDay = realm.objects(Workouts).sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1 AND userId == $2', startOfDay, endOfDay, user.id);
    console.log("Workouts of day: ", workoutsOfDay)
   
    divideWorkoutsIntoSections(workoutsOfDay)
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

  const calculateTotalVolumeAndReps = (workout:any) => {
    let totalVolume = workout[0].totalVolume;
    let totalReps = workout[0].totalReps;

    return totalReps + "reps" + "; " + totalVolume + "kg"
  }

  const calculateTotalDistanceAndTime = (workout:any) => {
    let totalDistance = workout[0].totalDistance;
    let totalTime = workout[0].totalTime;

    return totalDistance + "km" + "; " + totalTime + "m"
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
    }

    setIsLoading(false)
      
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
        <View style={styles.header}>
            <Text style={styles.headerText}>History</Text>
            <View style={{marginRight: 15, display: 'flex', flexDirection: 'row',  alignItems: 'center'}} >
              <MaterialCommunityIcons name={"bell-outline"} size={35}/>
              <TouchableOpacity onPress={() => goToProfileSettings()}>
                <Image source={imageSource} style={styles.headerImage}/>
              </TouchableOpacity>
            </View>
            
        </View>

        <TouchableOpacity style={[{position: 'absolute', bottom: 20, right: 20, backgroundColor: colors.blue, width: 70, height: 70, borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2}, shadow.shadow]} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name={"plus"} size={50} color={'white'}/>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.container}>
        <CalendarComponent onPress={selectDay} setWorkouts={setWorkoutsFromCalendarComponent}/>
        <View style={styles.containerWorkouts}>
          <View style={{width: '100%', display: 'flex', justifyContent: 'flex-start'}}>
          <Text style={{textAlign: 'left', fontWeight: '800', fontSize: 20}}>Logged Workouts</Text>
          </View>
        
        <View style={styles.border}></View>
        {
          workouts.map((item:any, index:any) => (
            <View key={index}>
              <Text style={{fontWeight: '800', fontSize: 15, color: colors.text, marginBottom: 5, marginLeft: 10, marginTop: 20,}}>{formatDate(item.date)}</Text>
              {
                item.workouts.map((itemWorkout:any, indexWorkout:any) => {

                  let iconName = "heart"
                  let color = colors.red;
                  let name = "Cardio"
                  let object = null;
                  let shownData = ""
                  if(itemWorkout.workoutType == "Cardio")
                  {
                    iconName = "heart"
                    color = colors.red;
                    name = "Cardio"
                    object = realm.objects(CardioWorkout).filtered("_id == $0", itemWorkout.workoutId);
                    shownData = calculateTotalDistanceAndTime(object)
                  }
                  else if(itemWorkout.workoutType == "Resistance")
                  {
                    iconName = "dumbbell"
                    color = colors.black;
                    name = "Strength"
                    object = realm.objects(ResistanceWorkout).filtered("_id == $0", itemWorkout.workoutId);
                    shownData = calculateTotalVolumeAndReps(object)
                  }

                  return (
                    <TouchableOpacity key={new BSON.ObjectId().toString()} style={[styles.card, shadow.shadow]} onPress={() => goToWorkoutDisplay(itemWorkout.workoutId, itemWorkout.workoutType)}>
                      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <MaterialCommunityIcons name={iconName} size={45} color={color} style={{marginRight: 20,}}/>
                        <Text style={{fontWeight: '700', color: colors.text, fontSize: 18}}>{name}</Text>
                      </View>
                      <Text style={{fontWeight: '700'}}>{shownData}</Text>
                    
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
