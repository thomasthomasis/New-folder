import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Image, Dimensions, Alert, ActivityIndicator} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import { LogWorkoutCardioScreen } from '../LogWorkoutCardioScreen/LogWorkoutCardioScreen'; 
import { LogWorkoutResistanceScreen } from '../LogWorkoutResistanceScreen/LogWorkoutResistanceScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SubmitCompletion } from '../SubmitCompletionScreen/SubmitCompletion';
import { shadow } from '../../sharedStyling/Shadow';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './LogWorkoutScreen.styles';
import Modal from 'react-native-modal';
import { useRealm, useUser } from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import { BarChart, PieChart } from 'react-native-gifted-charts';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { BSON } from 'realm';
import { UserStatistics } from '../../schemas/UserStatisticsSchema';
import { CardioWorkout } from '../../schemas/CardioWorkoutSchema';
import { ResistanceWorkout } from '../../schemas/ResistanceWorkoutSchema';
import { useFocusEffect } from '@react-navigation/native';

type LogWorkoutProps = {
    navigation: StackNavigationProp<RootStackParamList, 'LogWorkout'>;
}

type PieChartProps = {
  data:any
}

const PieChartExample = (props:PieChartProps) => {

  console.log("num cardio workout: ", props.data[0].numCardioWorkouts)
  console.log(props.data)

  let cardioWorkouts = props.data[0].numCardioWorkouts
  let resistanceWorkouts = props.data[1].numResistanceWorkouts

  console.log(resistanceWorkouts)

  const data = [
    { value: cardioWorkouts, label: 'Cardio', color: colors.red },
    { value: resistanceWorkouts, label: 'Resistance', color: colors.black },
  ];

  const getFocusedWorkoutType = () => {

    // Initialize variables to keep track of the maximum value and its corresponding label
    let maxLabel = '';
    let maxValue = -Infinity;

    // Iterate over each object in the data array
    data.forEach(item => {
      // Update maxLabel and maxValue if the current item's value is higher
      if (item.value > maxValue) {
        maxValue = item.value;
        maxLabel = item.label;
      }
    })

    return maxLabel;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -100, }}>
      <PieChart
        data={data}
        donut
        innerRadius={85}
      />
      <View style={{position: 'absolute'}}>
        {
          (data[0].value == 0 && data[1].value == 0) &&
          <Text style={{fontWeight: '800', fontSize: 20, textAlign: 'center'}}>No Workouts Logged {'\n'} This Week</Text>
        }
        {
          (data[0].value > 0 || data[1].value > 0) &&
          <Text style={{fontWeight: '800', fontSize: 20, textAlign: 'center'}}>You focused on {'\n'}{getFocusedWorkoutType()} {'\n'} most this week!</Text>
        }
        
      </View>
      {renderLegendComponent(data)}
    </View>
  )
}

const renderDot = (title:any, color:any) => {
  return (
    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
      <View style={{height: 30, width: 30, borderRadius: 10, backgroundColor: color, marginRight: 5,}}></View>
      <Text style={{fontSize: 20, fontWeight: '800'}}>{title}</Text>
    </View>
  );
};

const renderLegendComponent = (data:any) => {

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={{position: 'absolute', bottom: 20,}}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {
          data.map((item:any, index:any) => (
            <View key={new BSON.ObjectID().toString()} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: screenWidth - 220, }}>
              {renderDot(item.label, item.color)}
            </View>
          ))
        }
      </View>
    </View>
  );
};

const getMondayAndSunday = () => {
  const currentDate = new Date();
  
  // Get the current day of the week (0 is Sunday, 1 is Monday, etc.)
  const currentDay = currentDate.getDay();
  
  // Calculate the difference between the current day and Monday
  const diffToMonday = (currentDay === 0 ? 6 : currentDay - 1);
  
  // Calculate the difference between the current day and Sunday
  const diffToSunday = (currentDay === 0 ? 0 : 7 - currentDay);

  // Get the date for Monday
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0); // Set to start of the day

  // Get the date for Sunday
  const sunday = new Date(currentDate);
  sunday.setDate(currentDate.getDate() + diffToSunday);
  sunday.setHours(23, 59, 59, 999); // Set to end of the day

  return { monday, sunday };
}

type BarChartProps = {
  data:any
}

const BarChartExample = (props:BarChartProps) => {
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  const barData = [{value: props.data[0].numCardioWorkouts, frontColor: colors.red}, {value: props.data[0].numResistanceWorkouts, frontColor: colors.black}];
    return (
      <View style={{height: screenHeight - 200 - (screenHeight - 250), width: screenWidth - 140, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
        <Text style={{textAlign: 'center', fontWeight: '800', fontSize: 20,}}>Lifetime Spread</Text>
        <BarChart
          frontColor={'#177AD5'}
          barWidth={(screenWidth/2 - 10)/2 - 20 }
          data={barData}
          hideYAxisText={true}
          yAxisThickness={0}
          hideRules={true}
          xAxisThickness={4}
          width={screenWidth/2 - 10}
          height={screenHeight - 150 - (screenHeight - 250)}
        />
      </View>
        
    );
}

export const LogWorkoutScreen = ({ navigation }: LogWorkoutProps) => {

  const realm = useRealm()
  const user = useUser()

  const logResitanceWorkout = () => {
    navigation.navigate("LogWorkoutResistance", {continuingWorkout: false})
  }

  const logCardioWorkout = () => {
    navigation.navigate("LogWorkoutCardio", { continuingWorkout: false})
  }

  let userData = realm.objects("Users").sorted('_id').filtered("userId == $0", user.id);
  let userStats = realm.objects("UserStatistics").filtered("userId == $0", user.id)

  const { monday, sunday } = getMondayAndSunday();

  console.log(user.id)

  let CardioObjectsOfWeek = realm.objects(CardioWorkout).filtered("user_id == $0 AND dateCreated >= $1 AND dateCreated <= $2", user.id, monday, sunday)
  let ResistanceObjectsOfWeek = realm.objects(ResistanceWorkout).filtered("userId == $0 AND dateCreated >= $1 AND dateCreated <= $2", user.id, monday, sunday)

  const userStatsWeek = [
    {
      numCardioWorkouts: CardioObjectsOfWeek.length,
    },
    {
      numResistanceWorkouts: ResistanceObjectsOfWeek.length,
    }
  ]

  useEffect(() => {
    CardioObjectsOfWeek = realm.objects(CardioWorkout).filtered("user_id == $0 AND dateCreated >= $1 AND dateCreated <= $2", user.id, monday, sunday)
    ResistanceObjectsOfWeek = realm.objects(ResistanceWorkout).filtered("userId == $0 AND dateCreated >= $1 AND dateCreated <= $2", user.id, monday, sunday)
  }, [userStats])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [imageSource, setImageSource] = useState()

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
  }, [])

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const closeModal = () => {
    setModalVisible(false)
  }

  //set profile picture
  useEffect(() => {
    //console.log(userData)
    let profilePicture:string = userData[0].profilePicture as string;

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
      
    }, [userData])

    useEffect(() => {
      realm.subscriptions.update(mutableSubs => {
          mutableSubs.add(
          realm.objects(Users),
          );

          mutableSubs.add(
            realm.objects(UserStatistics),
            );

          mutableSubs.add(
            realm.objects(CardioWorkout),
            );

          mutableSubs.add(
            realm.objects(ResistanceWorkout),
            );
      });
      }, [realm, user]);

    const screenHeight = Dimensions.get('window').height;

  return (
    <>
    {
      isLoading ? (
        <ActivityIndicator size="large" color={colors.blue}/>
      ) :
      (
        <View>

      

        <View style={styles.header}>
            <Text style={styles.headerText}>UltiTracker</Text>
            <View style={[{marginRight: 10,}, shadow.shadow]}>
              <Image source={require("../../assets/3.png")} style={styles.headerImage}/>
            </View>
        </View>

        <View style={[styles.container, {height: screenHeight - 50}]}>

          <View style={[styles.containerPieChart, shadow.shadow]}>
            <View style={styles.rowPieChart}>
              <TouchableOpacity onPress={() => console.log("back")}>
                <MaterialCommunityIcons name="arrow-left" color={'black'} size={40}/>
              </TouchableOpacity>
              <Text style={{fontSize: 20, fontWeight: '800'}}>This Week</Text>
              <TouchableOpacity onPress={() => console.log("pressed three dots")}>
                <MaterialCommunityIcons name="dots-horizontal" color={'black'} size={40}/>
              </TouchableOpacity>
            </View>
            <View style={styles.pieChart}>
              <PieChartExample data={userStatsWeek}/>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.containerBarChart, shadow.shadow]}>
              <BarChartExample data={userStats}/>
            </View>

            <TouchableOpacity style={[styles.logWorkoutButton, shadow.shadow]} onPress={() => {setModalVisible(true)}}>
              <MaterialCommunityIcons name="plus" color={'white'} size={50}/>
            </TouchableOpacity>
          </View>
          
        </View>

      {
        (currentWorkout.length > 0) &&
        <View style={[styles.container, {height: screenHeight - 50, alignItems: 'center'}]}>
          <TouchableOpacity style={styles.continueButton} onPress={() => {console.log("continue workout")}}>
            <Text style={styles.buttonText}>Continue Workout</Text>
          </TouchableOpacity>
        </View>
      }

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
            <View style={styles.rowModal}>
              <TouchableOpacity style={[styles.gridOption, {backgroundColor: '#ED97A5'}, shadow.shadow]} onPress={() => {closeModal(); logCardioWorkout()}}>
                <View style={[styles.circle, {backgroundColor: colors.red}]}>
                  <Image style={styles.image} source={require('../../assets/Heart.png')} />
                </View>
                <Text style={styles.plus}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gridOption, {backgroundColor: '#afb0b2'}, shadow.shadow]} onPress={() => {closeModal(); logResitanceWorkout()}}>
                <View style={[styles.circle, {backgroundColor: colors.black}]}>
                  <MaterialCommunityIcons name="weight" color={'black'} size={80}/>
                </View>
                <Text style={styles.plus}>+</Text>
              </TouchableOpacity>
            </View>
            
          </View>
              
          </View>
      </Modal>

    </View>
      )
    }
    </>
    
  
  )
}