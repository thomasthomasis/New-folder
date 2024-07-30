import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions} from 'react-native';
import { useRealm, useUser } from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserStatistics } from '../../schemas/UserStatisticsSchema';
import { shadow } from '../../sharedStyling/Shadow'
import styles from './CardioStatsScreen.style';

import { CardStyleInterpolators, StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp } from '@react-navigation/native'
import { colors } from '../../sharedStyling/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { Workouts } from '../../schemas/WorkoutSchema';
import { GeneralLineChartComponent } from '../../components/GeneralLineChartComponent/GeneralLineChartComponent';
import { GeneralPieChart } from '../../components/GeneralPieChartComponent/GeneralPieChartComponent';
import { StackedBarChartComponent } from '../../components/StackedBarChartComponent/StackedBarChartComponent';

import { ResistancePieChartComponent } from '../../components/ResistanceStatsComponents/ResistancePieChartComponent/ResistancePieChartComponent';
import { ExtraExercises } from '../../schemas/ExtraExercisesSchema';
import { CardioWorkout } from '../../schemas/CardioWorkoutSchema';
import { CardioLineChartComponent } from '../../components/CardioStatsComponents/CardioLineChartComponent/CardioLineChartComponent';
import { CardioBarChartComponent } from '../../components/CardioStatsComponents/CardioBarChartComponent/CardioBarChartComponent';

type CardioStatsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CardioStats'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'CardioStats'>;
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const CardioStatsScreen = ({ navigation, route }: CardioStatsScreenProps) => {

    const realm = useRealm();
    const user = useUser();

    const { userId } = route.params;

    const goBack = () => {
        navigation.goBack()
    }

    const goToWorkoutView = (workoutId:string) => {
        console.log("navigate to workout view screen")
    }

    const goToExerciseStats = (exerciseId:string) => {
        navigation.navigate("CardioExerciseStats", { userId:userId, exerciseId:exerciseId })
      }

    useEffect(() => {
        addExtraExercisesToSection()
    }, [])

    const [loading, setLoading] = useState(true)

    const [extraExercises, setExtraExercises] = useState<any>(realm.objects(ExtraExercises).filtered("userId == $0 && type == $1", user.id, "Cardio"));

    const [activeFilter, setActiveFilter] = useState(0)
    const [workoutData, setWorkoutData] = useState<any>(null)

    const [startDate, setStartDate] = useState<Date>(new Date(0))
    const [endDate, setEndDate] = useState<Date>(new Date())

    const [highestTimeSession, setHighestTimeSession] = useState<any>(null)
    const [highestDistanceSession, setHighestDistanceSession] = useState<any>(null)
    const [highestTimeAndDistanceSet, setHighestTimeAndDistanceSet] = useState<any>(null);

    const normalExercises = [
      { id: "0", name: 'Running' },
      { id: "1", name: 'Cycling' },
      { id: "2", name: 'Swimming' },
      { id: "3", name: 'Jumping Rope' },
      { id: "4", name: 'Rowing' },
      { id: "5", name: 'Elliptical Training' },
      { id: "6", name: 'Hiking' },
      { id: "7", name: 'Dancing' },
      { id: "8", name: 'Kickboxing' },
      { id: "9", name: 'Stair Climbing' },
      { id: "10", name: 'Pilates' },
      { id: "11", name: 'Zumba' },
      { id: "12", name: 'Yoga' },
      { id: "13", name: 'High Knees' },
      { id: "14", name: 'Butt Kicks' },
      { id: "15", name: 'Mountain Climbers' },
      { id: "16", name: 'Burpees' },
      { id: "17", name: 'Side Shuffles' },
      { id: "18", name: 'Box Jumps' },
      { id: "19", name: 'Skipping' },
      { id: "20", name: 'Speed Skating' },
      { id: "21", name: 'Shadow Boxing' },
      { id: "22", name: 'Treadmill Running' },
      { id: "23", name: 'Stationary Bike' },
      { id: "24", name: 'Trampoline' },
      { id: "25", name: 'Staircase Running' },
      { id: "26", name: 'Speed Walking' },
      { id: "27", name: 'Inline Skating' },
      { id: "28", name: 'Plyometrics' },
      { id: "29", name: 'Boot Camp' },
      { id: "30", name: 'Circuit Training' },
      { id: "31", name: 'HIIT' },
      { id: "33", name: 'Sprints' },
      { id: "34", name: 'CrossFit' },
      { id: "35", name: 'Bodyweight Exercises' },
      { id: "36", name: 'Cardio Kickboxing' },
      { id: "37", name: 'Battle Ropes' },
      { id: "41", name: 'Racquetball' },
      { id: "42", name: 'Basketball' },
      { id: "43", name: 'Soccer' },
      { id: "44", name: 'Tennis' },
      { id: "45", name: 'Squash' },
      { id: "46", name: 'Badminton' },
      { id: "47", name: 'Frisbee' },
      { id: "48", name: 'Ultimate Frisbee' },
      { id: "49", name: 'Touch Football' },
      { id: "50", name: 'Beach Volleyball' },
      { id: "51", name: 'Paddleboarding' },
      { id: "52", name: 'Surfing' },
      { id: "53", name: 'Kayaking' },
      { id: "54", name: 'Canoeing' },
      { id: "55", name: 'Rowboat' },
      { id: "56", name: 'Stand-up Paddleboarding' },
      { id: "57", name: 'Rock Climbing' },
      { id: "60", name: 'Cross-country Skiing' },
      { id: "61", name: 'Downhill Skiing' },
      { id: "62", name: 'Snowboarding' },
      { id: "63", name: 'Snowshoeing' },
      { id: "64", name: 'Hockey' },
      { id: "65", name: 'Lacrosse' },
      { id: "66", name: 'Field Hockey' },
      { id: "67", name: 'Rugby' },
      { id: "68", name: 'Handball' },
      { id: "69", name: 'Water Polo' },
      { id: "70", name: 'Swimming Laps' },
      { id: "88", name: 'Rowing Machine' },
      { id: "89", name: 'Elliptical Machine' },
      { id: "90", name: 'Treadmill Walking' },
      { id: "91", name: 'Treadmill Jogging' },
      { id: "92", name: 'Outdoor Running' },
      { id: "93", name: 'Outdoor Walking' },
      { id: "95", name: 'Track Running' },
      { id: "96", name: 'Field Running' },
      { id: "97", name: 'Beach Running' },
      { id: "98", name: 'Parkour' },
      ];
    

    useEffect(() => {

        let {startDate, endDate} = getDateRange(activeFilter)
        setStartDate(startDate)
        setEndDate(endDate)

        const cardioWorkouts = realm.objects(CardioWorkout).filtered("user_id == $0 AND dateCreated >= $1 AND dateCreated <= $2", userId, startDate, endDate)
        console.log(cardioWorkouts)
        setWorkoutData(cardioWorkouts)

        let highestTimeSessionObject = getHighestTimeSession(cardioWorkouts)
        setHighestTimeSession(highestTimeSessionObject)

        let highestDistanceSessionObject = getHighestDistanceSession(cardioWorkouts)
        setHighestDistanceSession(highestDistanceSessionObject)

        let highestTimeAndDistanceSetObject = getHighestTimeAndDistanceSet(cardioWorkouts)
        setHighestTimeAndDistanceSet(highestTimeAndDistanceSetObject)

        if(cardioWorkouts)
        {
            setLoading(false)
        }

    }, [activeFilter])

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            
            mutableSubs.add(
              realm.objects(CardioWorkout)
            )
        });
        }, [realm, user]);

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
        
        return { startDate, endDate };
        };

    const getHighestTimeSession = (data:any) => {

        let largestTime = 0;
        let workoutId = "";
        let date = new Date();

        for(let i = 0; i < data.length; i++)
        {
            if(data[i].totalTime > largestTime)
            {
              largestTime = data[i].totalTime;
                workoutId = data[i]._id;
                date = data[i].dateCreated;
            }
        }

        let object = {
            workoutId: workoutId,
            largestTime: largestTime,
            date: date,
        }

        return object;
    }

    const getHighestDistanceSession = (data:any) => {
        let highestDistance = 0;
        let workoutId = "";
        let date = new Date();

        for(let i = 0; i < data.length; i++)
        {
            if(data[i].totalDistance > highestDistance)
            {
              highestDistance = data[i].totalDistance;
                workoutId = data[i]._id;
                date = data[i].dateCreated;
            }
        }

        let object = {
            workoutId: workoutId,
            highestDistance: highestDistance,
            date: date,
        }

        return object;
    }

    const getHighestTimeAndDistanceSet = (data:any) => {
        let largestTime = 0;
        let largestDistance = 0;


        let workoutIdTime = "";
        let workoutIdDistance = "";
        let dateTime = new Date();
        let dateDistance = new Date();
        let exerciseIdTime = ""
        let exerciseIdDistance = ""

        console.log("new -------------------------")

        for(let i = 0; i < data.length; i++)
        {
            //console.log(data[i].weights.length)
            let numTimesArray = data[i].time.length;
            for(let j = 0; j < numTimesArray; j++)
            {
                //console.log(data[i].weights[j])
                let jsonDataTimes = JSON.parse(data[i].time[j]);
                let jsonDataDistances = JSON.parse(data[i].distance[j]);

                let jsonDataExercises = JSON.parse(data[i].exercise[j])
                
                console.log("______________________________")
                console.log("Exercises: ", jsonDataExercises);
                console.log("times: ", jsonDataTimes)
                console.log("distances: ", jsonDataDistances)

                let time = 0;
                let distance = 0;

                for(let k = 0; k < jsonDataTimes.length; k++)
                {
                    time = parseFloat(jsonDataTimes[k].value);
                    distance = parseFloat(jsonDataDistances[k].value);
                    
                    if(time > largestTime)
                    {
                        largestTime = time;
                        workoutIdTime = data[i]._id;
                        dateTime = data[i].dateCreated;
                        exerciseIdTime = jsonDataExercises.value;
                    }

                    if(distance > largestDistance)
                    {
                        largestDistance = distance;
                        workoutIdDistance = data[i]._id;
                        dateDistance = data[i].dateCreated;
                        exerciseIdDistance = jsonDataExercises.value;
                    }
                }
            }
            
        }

        let object = {
            workoutIdTime: workoutIdTime,
            workoutIdDistance: workoutIdDistance,
            largestTime: largestTime,
            largestDistance: largestDistance,
            dateTime: dateTime,
            dateDistance: dateDistance,
            exerciseIdTime: exerciseIdTime,
            exerciseIdDistance: exerciseIdDistance,
        }

        console.log(object)

        return object;
    }


    const getExerciseName = (id:string) => {
        
      for(let i = 0; i < normalExercises.length; i++)
      {
        if(normalExercises[i].id == id)
        {
          return normalExercises[i].name;
        }
      }
      
      return id;
    } 

    const addExtraExercisesToSection = () => {

        for(let i = 0; i < extraExercises.length; i++)
          {
            let id = extraExercises[i].exerciseId;
            let name = extraExercises[i].name;

            let object = {
              id: id,
              name: name,
            }

            normalExercises.push(object)
    
          }
      }

    return (
        <>
        {
            loading &&
            <ActivityIndicator size={'large'} />
        }
        {
            !loading &&
            <>
            <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.red}}>
                    <View style={styles.headerTitle}>
                        <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                            <MaterialCommunityIcons name="arrow-left" size={40} color={'white'}/>
                        </TouchableOpacity> 
                        <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20, color: 'white'}}>Cardio Stats</Text>
                    </View>
                </View>
                <ScrollView>
                
                {
                    workoutData.length == 0 &&
                    <View>
                        <View style={styles.containerFilters}>
                            <TouchableOpacity style={[styles.filterButton, activeFilter == 0 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(0)}>
                            <Text style={styles.filterButtonText}>Max</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.filterButton, activeFilter == 1 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(1)}>
                            <Text style={styles.filterButtonText}>1Y</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.filterButton, activeFilter == 2 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(2)}>
                            <Text style={styles.filterButtonText}>6M</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.filterButton, activeFilter == 3 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(3)}>
                            <Text style={styles.filterButtonText}>3M</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.filterButton, activeFilter == 4 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(4)}>
                            <Text style={styles.filterButtonText}>1M</Text>
                            </TouchableOpacity>
                        </View>
                        <Text>No Cardio Workout Data!!</Text>
                    </View>
                }
                {
                    workoutData.length > 0 &&
                    <View style={{minHeight: screenHeight * 2}}>
                        <View style={styles.containerFilters}>
                            <TouchableOpacity style={[styles.filterButton, activeFilter == 0 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(0)}>
                            <Text style={styles.filterButtonText}>Max</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.filterButton, activeFilter == 1 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(1)}>
                            <Text style={styles.filterButtonText}>1Y</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.filterButton, activeFilter == 2 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(2)}>
                            <Text style={styles.filterButtonText}>6M</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.filterButton, activeFilter == 3 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(3)}>
                            <Text style={styles.filterButtonText}>3M</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.filterButton, activeFilter == 4 && {backgroundColor: colors.green}]} onPress={() => setActiveFilter(4)}>
                            <Text style={styles.filterButtonText}>1M</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.container}>

                            <View>
                              <CardioLineChartComponent data={workoutData} startDate={startDate} endDate={endDate} filter={activeFilter}/>
                            </View>
                            <View>
                                <CardioBarChartComponent data={workoutData} />
                            </View>

                            <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={() => goToWorkoutView(highestDistanceSession.workoutId)}>
                                <Text style={{fontSize: 20, fontWeight: '500', color: colors.text,}}>Longest Distance Session</Text>
                                <Text style={{fontSize: 40, fontWeight: '900', color: colors.text}}>{highestDistanceSession.highestDistance}KM</Text>
                                <Text style={{fontSize: 15, fontWeight: '400', color: colors.text}}>{highestDistanceSession.date.toDateString()}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={() => goToWorkoutView(highestTimeSession.workoutId)}>
                                <Text style={{fontSize: 20, fontWeight: '500', color: colors.text,}}>Longest Time Session</Text>
                                <Text style={{fontSize: 40, fontWeight: '900', color: colors.text}}>{highestTimeSession.largestTime} Minutes</Text>
                                <Text style={{fontSize: 15, fontWeight: '400', color: colors.text}}>{highestTimeSession.date.toDateString()}</Text>
                            </TouchableOpacity> 
 
                            <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={() => goToWorkoutView(highestTimeAndDistanceSet.workoutIdDistance)}>
                                <Text style={{fontSize: 20, fontWeight: '500', color: colors.text,}}>Lognest Distance Interval</Text>
                                <Text style={{fontSize: 40, fontWeight: '900', color: colors.text}}>{highestTimeAndDistanceSet.largestDistance}KM</Text>
                                <Text style={{fontSize: 17, fontWeight: '700', color: colors.text}}>{getExerciseName(highestTimeAndDistanceSet.exerciseIdDistance)}</Text>
                                <Text style={{fontSize: 15, fontWeight: '400', color: colors.text}}>{highestTimeAndDistanceSet.dateDistance.toDateString()}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={() => goToWorkoutView(highestTimeAndDistanceSet.workoutIdTime)}>
                                <Text style={{fontSize: 20, fontWeight: '500', color: colors.text,}}>Longest Time Interval</Text>
                                <Text style={{fontSize: 40, fontWeight: '900', color: colors.text}}>{highestTimeAndDistanceSet.largestTime} Minutes</Text>
                                <Text style={{fontSize: 17, fontWeight: '700', color: colors.text}}>{getExerciseName(highestTimeAndDistanceSet.exerciseIdTime)}</Text>
                                <Text style={{fontSize: 15, fontWeight: '400', color: colors.text}}>{highestTimeAndDistanceSet.dateTime.toDateString()}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={() => goToExerciseStats("0")}>
                              <Text style={{fontSize: 20, fontWeight: '500', color: colors.text,}}>More Exercises</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                    
                 }

                
            </ScrollView>
            </>
            
        }
            
        </>
    );
}

