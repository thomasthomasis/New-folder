import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ScrollView, Linking, Dimensions, ActivityIndicator} from 'react-native';
import { colors } from '../../../sharedStyling/Colors';
import styles from './CardioBarCharComponent.style';
import { useRealm, useUser } from '@realm/react';
import { ExtraExercises } from '../../../schemas/ExtraExercisesSchema';
import { BarChart } from "react-native-gifted-charts";
import { CardioPieChartComponent } from '../CardioPieChartComponent/CardioPieChartComponent';


type CardioBarChartComponentProps = {
  data:any,
};

export const CardioBarChartComponent = (props: CardioBarChartComponentProps) => {

    const realm = useRealm()
    const user = useUser()

    const screenWidth = Dimensions.get('window').width;

  //console.log("Data passed in: ", props.data[0]._id)
  //console.log(props.data[0].userId)

  //console.log(props.data)

  const [loading, setLoading] = useState(true)

  const [extraExercises, setExtraExercises] = useState<any>(realm.objects(ExtraExercises).filtered("userId == $0 && type == $1", user.id, "Cardio"));

  const [dataTotalDistance, setDataTotalDistance] = useState<any[]>([0, 1, 2, 3]);
  const [dataTotalTime, setDataTotalTime] = useState<any[]>([0, 1, 2, 3]);
  const [labels, setLabels] = useState<any[]>(["Jan", "Feb", "Mar"]);
  const [graphTotalDistance, setGraphTotalDistance] = useState<any[]>([])
  const [graphTotalTime, setGraphTotalTime] = useState<any[]>([])
  const [maxDistance, setMaxDistance] = useState<number>(0)
  const [maxTime, setMaxTime] = useState<number>(0)
  const [coloursArray, setColoursArray] = useState<any[]>([])

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
  }, [])

  useEffect(() => {

    setLoading(true)

    let result = getTotalDistance(props.data)

    console.log(result)

    setLabels(result.exerciseNameConversion)
    setDataTotalDistance(result.totalDistancesDecimal)
    setDataTotalTime(result.totalTimes)   
    
    let objectsVolume:any[] = [];
    let objectsReps:any[] = []

    let coloursArray:string[] = generateColours(result.totalDistancesDecimal.length);
    setColoursArray(coloursArray)

    for(let i = 0; i < result.totalDistancesDecimal.length; i++)
    {
      let objectVolume = {
        value: result.totalDistancesDecimal[i],
        label: '',
        topLabelComponent: () => ( <Text style={{color: colors.text, fontSize: 18, marginBottom: 6}}>{result.totalDistancesDecimal[i]}T</Text> ),
        frontColor: coloursArray[i],
        gradientColor: lightenColour(coloursArray[i], 50),
      }

      let objectReps = {
        value: result.totalTimes[i],
        label: '',
        topLabelComponent: () => ( <Text style={{color: colors.text, fontSize: 18, marginBottom: 6}}>{result.totalTimes[i]}</Text> ),
        frontColor: coloursArray[i],
        gradientColor: lightenColour(coloursArray[i], 50),
      }

      objectsVolume.push(objectVolume);
      objectsReps.push(objectReps)
    }

    setGraphTotalDistance(objectsVolume);
    setGraphTotalTime(objectsReps);

    setMaxTime(getMaxValue(result.totalTimes))
    setMaxDistance(getMaxValue(result.totalDistancesDecimal))

    setLoading(false)

  }, [props.data])

  const generateColours = (length:number) => {
    let coloursArray:string[] = [];

    for(let i = 0; i < length; i++)
    {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      coloursArray.push(color);
    }
    
    return coloursArray;
  }

  const lightenColour = (hex:string, percent:any) => {
    // Ensure percent is between 0 and 100
    percent = Math.max(0, Math.min(100, percent));
    
    // Convert hex color to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      throw new Error('Invalid hex color value.');
    }

    // Calculate the new RGB values by increasing them by the given percentage
    r = Math.min(255, Math.floor(r + (r * percent / 100)));
    g = Math.min(255, Math.floor(g + (g * percent / 100)));
    b = Math.min(255, Math.floor(b + (b * percent / 100)));

    // Convert RGB back to hex
    const toHex = (x:number) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  const getTotalDistance = (data:any) => {
    let totalDistances:number[] = []
    let totalTimes:number[] = []
    let exerciseNames:any[] = []

    for(let i = 0; i < data.length; i++)
    {
        for(let j = 0; j < data[i].allExercises.length; j++)
        {
            if(!exerciseNames.includes(data[i].allExercises[j]))
            {
                exerciseNames.push(data[i].allExercises[j])
            }
        }

        let distanceArray = []
        let timeArray = []
        let exerciseItem = {
          id: "",
          value: "",
        }

        for(let j = 0; j < data[i].distance.length; j++)
        {
            let distance = 0;
            let time = 0;

            distanceArray = JSON.parse(data[i].distance[j])
            timeArray = JSON.parse(data[i].time[j])
            for(let k = 0; k < distanceArray.length; k++)
            {
                distance += parseFloat(distanceArray[k].value);
                time += parseFloat(timeArray[k].value);
            }
            
            exerciseItem = JSON.parse(data[i].exercise[j]);

            let indexOfExercise = exerciseNames.indexOf(exerciseItem.value)
            for(let k = 0; k < distanceArray.length; k++)
            {
              if(totalDistances[indexOfExercise] == undefined)
                {
                  totalDistances[indexOfExercise] = 0;
                  totalTimes[indexOfExercise] = 0;
                }
                totalDistances[indexOfExercise] = totalDistances[indexOfExercise] + distance;
                totalTimes[indexOfExercise] = totalTimes[indexOfExercise] + time;
            }
            
        }
    }


    let exerciseNameConversion:string[] = [];
    for(let i = 0; i < exerciseNames.length; i++)
    {
      let name = convertIdToName(exerciseNames[i])
      exerciseNameConversion.push(name);
    }

    let totalDistancesDecimal:number[] = []
    for(let i = 0; i < totalDistances.length; i++)
    {
        totalDistancesDecimal.push(parseFloat((totalDistances[i]).toFixed(1)))
    }

    return { exerciseNameConversion, totalDistancesDecimal, totalTimes };

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

  const convertIdToName = (id:string) => {
    let name = getExerciseName(id)

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

    
    const getMaxValue = (array:any[]) => {
      if (array.length === 0) {
        throw new Error("Array is empty");
      }
      
      let maxValue = array[0];
      
      for (let i = 1; i < array.length; i++) {
        if (array[i] > maxValue) {
          maxValue = array[i];
        }
      }
      
      return maxValue + maxValue/2;
    }
  
    return (
        <>
        {
            loading && 
            <View style={styles.container}>
                <ActivityIndicator size={'large'} />
            </View>
        }
        {
            !loading &&
            <View style={styles.mainContainer}>
              <View style={styles.container}>
                <Text style={{fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 10,}}>Total Distance</Text>
                <BarChart width={screenWidth - 70} data={graphTotalDistance} barWidth={(screenWidth - 70)/graphTotalDistance.length - 5} showYAxisIndices yAxisLabelSuffix={"T"} noOfSections={4} maxValue={maxDistance} spacing={5} barBorderTopLeftRadius={5} barBorderTopRightRadius={5} showGradient/>
                <View style={styles.legendContainer}>
                  {
                    labels.map((item, index) => (
                      <View key={index} style={styles.legendItem}>
                        <View style={[styles.colorBox, { backgroundColor: coloursArray[index] }]} />
                        <Text style={styles.legendText}>{item}</Text>
                      </View>
                    ))
                  }
                </View>
              </View>
             
              <View style={styles.container}>
              <Text style={{fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 10,}}>Total Time</Text>
                <BarChart width={screenWidth - 70} data={graphTotalTime} barWidth={(screenWidth - 70)/graphTotalTime.length - 5} showYAxisIndices noOfSections={4} maxValue={maxTime} spacing={5} barBorderTopLeftRadius={5} barBorderTopRightRadius={5} showGradient/>
                <View style={styles.legendContainer}>
                  {
                    labels.map((item, index) => (
                      <View key={index} style={styles.legendItem}>
                        <View style={[styles.colorBox, { backgroundColor: coloursArray[index] }]} />
                        <Text style={styles.legendText}>{item}</Text>
                      </View>
                    ))
                  }
                </View>
                
              </View>

              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <CardioPieChartComponent coloursArray={coloursArray} graphDistance={dataTotalDistance} graphTime={dataTotalTime} labels={labels}/>
              </View>
              
            
              
            </View>
            
           
        }
        
        </>
        
      
    )
}