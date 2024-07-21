import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ScrollView, Linking, Dimensions} from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { colors } from '../../../sharedStyling/Colors';
import styles from './CardioPieChartComponent.style';
import { ExtraExercises } from '../../../schemas/ExtraExercisesSchema';
import { useRealm, useUser } from '@realm/react';
import { BSON } from 'realm';


type CardioPieChartComponentProps = {
  coloursArray:string[],
  graphDistance:any[],
  graphTime:any[],
  labels:any[],
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const CardioPieChartComponent = (props: CardioPieChartComponentProps) => {

    const realm = useRealm()
    const user = useUser()

    const screenWidth = Dimensions.get('window').width;

  //console.log("Data passed in: ", props.data[0]._id)
  //console.log(props.data[0].userId)

  const [loading, setLoading] = useState(true)

  const [extraExercises, setExtraExercises] = useState<any>(realm.objects(ExtraExercises).filtered("userId == $0 && type == $1", user.id, "Cardio"));
  const [graphTotalDistance, setGraphTotalDistance] = useState<any[]>([])
  const [graphTotalTime, setGraphTotalTime] = useState<any[]>([])

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
    addExtraExercisesToSection()

    if(extraExercises)
    {
        setLoading(false)
    }

    let objectsDistance:any[] = [];
    let objectsTime:any[] = []

    for(let i = 0; i < props.graphDistance.length; i++)
        {
          let objectDistance = {
            value: props.graphDistance[i],
            color: props.coloursArray[i],
          }
    
          let objectTime = {
            value: props.graphTime[i],
            color: props.coloursArray[i],
          }
    
          objectsDistance.push(objectDistance);
          objectsTime.push(objectTime)
        }

    setGraphTotalDistance(objectsDistance);
    setGraphTotalTime(objectsTime);

  }, [props.coloursArray])

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

  const convertIdToName = (id:string) => {
    //console.log("id: ", id)

    let name = getExerciseName(id)

    //console.log("name: ", name)

    return name;
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
 
  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
        
        mutableSubs.add(
          realm.objects(ExtraExercises)
        )
    });
    }, [realm, user]);

    
   


  const calculateLargestPercentage = (objects:any[]) => {
    
    let largest = 0;
    let total = 0;

    for(let i = 0; i < objects.length; i++)
    {  
      total += objects[i].value;
      if(objects[i].value > largest)
      {
        largest = objects[i].value;
      }
    }
    //console.log(largest)

    return (largest/total * 100).toFixed(1);
  }

  const getLargestExercise = (objects:any[]) => {
    let largestIndex = 0;
    let largest = 0;

    for(let i = 0; i < objects.length; i++)
    {  
      if(objects[i].value > largest)
      {
        largest = objects[i].value;
        largestIndex = i;
      }
    }
    //console.log(largest)

    return largestIndex;
  }

  const calculatePercentage = (objects:any[], object:any) => {

    //console.log(objects)

    let total = 0;

    for(let i = 0; i < objects.length; i++)
    {
      total += objects[i].value;
    }

    return (object.value/total * 100).toFixed(1);
  }

  const limitString = (str:string, maxLength:number, useEllipsis:boolean) => {

    if(!str)
    {
      return str;
    }

    if (str.length <= maxLength) {
      return str;
    }
    
    const ellipsis = useEllipsis ? '...' : '';
    const limit = maxLength - ellipsis.length;
    
    return str.slice(0, limit) + ellipsis;
  }

 
    return (
    <>
        <View style={styles.container}>
        <Text style={{fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 10,}}>Distance Distribution</Text>
        <PieChart
          data={graphTotalDistance}
          donut
          showGradient
          radius={screenWidth/2 - 110}
          innerRadius={screenWidth/2 - 135}
          innerCircleColor={'#f0f0f0'}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: colors.text}}>{calculateLargestPercentage(graphTotalDistance)}%</Text>
                <Text style={{fontSize: 14, color: colors.text}}>{limitString(props.labels[getLargestExercise(graphTotalDistance)], 11, true)}</Text>
              </View>
            );
          }}
        />
         <View style={{width: '100%', marginTop: 10,}}>
          {
            graphTotalDistance.map((item, index) => (
              <View key={new BSON.ObjectId().toString()} style={{display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingRight: 5, paddingLeft: 5,}}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center',}}>
                  <View style={{width: 10, height: 10, backgroundColor: props.coloursArray[index], borderRadius: 10, marginRight: 10,}}></View>
                  <Text style={{fontSize: 14, color: colors.text}}>{limitString(props.labels[index], 17, true)}</Text>
                </View>
                <Text>{calculatePercentage(graphTotalDistance, item)}%</Text>
              </View>
            ))
          }
        </View>
           
        </View>

        <View style={styles.container}>
        <Text style={{fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 10,}}>Time Distribution</Text>
        <PieChart
          data={graphTotalTime}
          donut
          showGradient
          radius={screenWidth/2 - 110}
          innerRadius={screenWidth/2 - 135}
          innerCircleColor={'#f0f0f0'}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: colors.text}}>{calculateLargestPercentage(graphTotalTime)}%</Text>
                <Text style={{fontSize: 14, color: colors.text}}>{limitString(props.labels[getLargestExercise(graphTotalTime)], 11, true)}</Text>
              </View>
            );
          }}
        />
        <View style={{width: '100%', marginTop: 10,}}>
          {
            graphTotalTime.map((item, index) => (
              <View key={new BSON.ObjectId().toString()} style={{display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingRight: 5, paddingLeft: 5,}}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center',}}>
                  <View style={{width: 10, height: 10, backgroundColor: props.coloursArray[index], borderRadius: 10, marginRight: 10,}}></View>
                  <Text style={{fontSize: 14, color: colors.text}}>{limitString(props.labels[index], 17, true)}</Text>
                </View>
                <Text>{calculatePercentage(graphTotalTime, item)}%</Text>
              </View>
            ))
          }
        </View>
        </View>
  
    </>
      
    )
}