import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions} from 'react-native';
import { useRealm, useUser } from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserStatistics } from '../../schemas/UserStatisticsSchema';
import { shadow } from '../../sharedStyling/Shadow'
import styles from './StatisticsScreen.style';

import { CardStyleInterpolators, StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp } from '@react-navigation/native'
import { colors } from '../../sharedStyling/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { Workouts } from '../../schemas/WorkoutSchema';
import { GeneralLineChartComponent } from '../../components/GeneralLineChartComponent/GeneralLineChartComponent';
import { GeneralPieChart } from '../../components/GeneralPieChartComponent/GeneralPieChartComponent';
import { StackedBarChartComponent } from '../../components/StackedBarChartComponent/StackedBarChartComponent';

type StatisticsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Statistics'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'Statistics'>;
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const StatisticsScreen = ({ navigation, route}: StatisticsScreenProps) => {

  const realm = useRealm();
  const user = useUser();

  const { userId } = route.params;

  const goBack = () => {
    navigation.goBack()
  }

  const goToAppSettings = () => {
    navigation.navigate("AppSettings")
  }

  const goToProfileSettings = () => {
    navigation.navigate("ProfileSettings")
  }

  const goToStatsScreen = (type:string) => {
    if(type == "Resistance")
    {
      navigation.navigate("ResistanceStats", {userId: userId})
    }
    else if(type == "Cardio")
    {
      navigation.navigate("CardioStats", {userId: userId})
    }
  }



  const [userData, setUserData] = useState<any>(realm.objects("Users").sorted('_id').filtered("userId == $0", userId));

  useFocusEffect(
    React.useCallback(() => {
      let data = realm.objects("Users").sorted('_id').filtered("userId == $0", userId)
      setUserData(data)
    }, [])
  );

  const formatDate = (date:Date) => {
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear().toString();
  
    return `${day}.${month}.${year}`;
  }

  const [imageSource, setImageSource] = useState(require("../../assets/3.png"))

  useEffect(() => {
    //console.log(userData)
    let user = userData[0];
    let profilePicture:string = user.profilePicture as string;

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
        realm.objects(UserStatistics)
        )

        mutableSubs.add(
          realm.objects(Workouts)
        )
    });
    }, [realm, user]);


    const [loading, setLoading] = useState<boolean>(true)
    

    const [activeFilter, setActiveFilter] = useState(0)
    const [workoutData, setWorkoutData] = useState<any>(null)

    const [startDate, setStartDate] = useState<Date>(new Date(0))
    const [endDate, setEndDate] = useState<Date>(new Date())

    useEffect(() => {

      let {startDate, endDate} = getDateRange(activeFilter)
      setStartDate(startDate)
      setEndDate(endDate)

      const workouts = realm.objects(Workouts).filtered("userId == $0 AND dateCreated >= $1 AND dateCreated <= $2", userId, startDate, endDate)
      setWorkoutData(workouts)

      console.log("Workouts: ", workouts.length)

      if(workouts)
      {
        setLoading(false)
      }
      
      //setWorkoutData([])

    }, [activeFilter])

    const setSpecificTime = (date:any, hours:any, minutes:any, seconds:any, milliseconds:any) => {
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(seconds);
      date.setMilliseconds(milliseconds);
      return date;
    };

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
          startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
          endDate = currentDate;
          break;
        case 2:
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, currentDate.getDate());
          endDate = currentDate;
          break;
        case 3:
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate());
          endDate = currentDate;
          break;
        case 4:
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
          endDate = currentDate;
          break;
        default:
          startDate = new Date(0);
          endDate = currentDate;
          break;
      }

      startDate = setSpecificTime(startDate, 1, 0, 0, 0);
      endDate = setSpecificTime(endDate, 24, 59, 59, 999);

      console.log(startDate)
      console.log(endDate)
    
      return { startDate, endDate };
    };

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
        
      }, [userData])

    return (
      <>
      {
        loading &&
        <ActivityIndicator size={'large'} />
      }
      {
        !loading &&
        <ScrollView>

        <View style={styles.header}>
            <Text style={styles.headerText}>Statistics</Text>
            <View style={{marginRight: 15, display: 'flex', flexDirection: 'row',  alignItems: 'center'}} >
              <MaterialCommunityIcons name={"bell-outline"} size={35}/>
              <TouchableOpacity onPress={() => goToProfileSettings()}>
                <Image source={imageSource} style={styles.headerImage}/>
              </TouchableOpacity>
            </View>
            
        </View>

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
              <Text style={{fontSize: 30, fontWeight: '800', color: colors.black, textAlign: 'center'}}>Noob</Text>
              <View style={{width: screenWidth - 210, height: 15, borderRadius: 10, backgroundColor: colors.black,}}></View>
            </View>
            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: 50,}}>
              <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row',}}>
                <Text style={{fontWeight: '700', fontSize: 20,}}>0</Text>
                <MaterialCommunityIcons name="medal-outline" color={colors.black} size={40} style={{marginLeft: 5,}}/>
              </View>
              <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row',}}>
                <Text  style={{fontWeight: '700', fontSize: 20,}}>2</Text>
                <MaterialCommunityIcons name="account-group" color={colors.black} size={40} style={{marginLeft: 5,}}/>
              </View>
            </View>
          </View>
          
        </View>

        {
          workoutData.length == 0 &&
          <View style={{marginTop: 25, height: 400,}}>
            <Text style={{fontSize: 30, fontWeight: '800', color: colors.black}}>No Workout Data!</Text>
          </View>
        }
        {
          workoutData.length > 0 &&
          <>
          <View style={styles.containerFilters}>
            <TouchableOpacity style={[styles.filterButton, activeFilter == 0 && {backgroundColor: colors.blue}]} onPress={() => setActiveFilter(0)}>
              <Text style={styles.filterButtonText}>Max</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, activeFilter == 1 && {backgroundColor: colors.blue}]} onPress={() => setActiveFilter(1)}>
              <Text style={styles.filterButtonText}>1Y</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, activeFilter == 2 && {backgroundColor: colors.blue}]} onPress={() => setActiveFilter(2)}>
              <Text style={styles.filterButtonText}>6M</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, activeFilter == 3 && {backgroundColor: colors.blue}]} onPress={() => setActiveFilter(3)}>
              <Text style={styles.filterButtonText}>3M</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, activeFilter == 4 && {backgroundColor: colors.blue}]} onPress={() => setActiveFilter(4)}>
              <Text style={styles.filterButtonText}>1M</Text>
            </TouchableOpacity>
        </View>
         
         <View style={{marginTop: 25,}}>
          <GeneralLineChartComponent data={workoutData} startDate={startDate} endDate={endDate} filter={activeFilter}/>
         </View>
         
         <View style={styles.containerPieCharts}>
          <GeneralPieChart data={workoutData} type="workoutType"/>
          <GeneralPieChart data={workoutData} type="status"/>
         </View>

         <View>
          <StackedBarChartComponent data={workoutData} type={"workoutType"}/>
          <StackedBarChartComponent data={workoutData} type={"status"}/>
         </View>

         <View style={{width: screenWidth, display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row', marginTop: 25,}}>
          <TouchableOpacity style={{width: screenWidth/2 - 20, height: 70, borderRadius: 15, backgroundColor: colors.red, display: 'flex', justifyContent: 'center', alignItems: 'center'}} onPress={() => goToStatsScreen("Cardio")}><Text style={{fontSize: 20, fontWeight: '800', color: 'white'}}>Cardio</Text></TouchableOpacity>
          <TouchableOpacity style={{width: screenWidth/2 - 20, height: 70, borderRadius: 15, backgroundColor: colors.black, display: 'flex', justifyContent: 'center', alignItems: 'center'}} onPress={() => goToStatsScreen("Resistance")}><Text style={{fontSize: 20, fontWeight: '800', color: 'white' }}>Resistance</Text></TouchableOpacity>
         </View>
          </>
        }

       </View>
       </ScrollView>
          }
        </>
      
    );
}

