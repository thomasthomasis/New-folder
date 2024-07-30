import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ScrollView, Linking, Dimensions} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../../../../sharedStyling/Colors';
import styles from './ExerciseLineChartComponent.style';


type CardioExerciseLineChartComponentProps = {
  data:any,
  startDate:Date,
  endDate:Date,
  filter:number,
  exerciseId:string,
};

export const ExerciseLineChartComponent = (props: CardioExerciseLineChartComponentProps) => {

  //console.log("Data passed in: ", props.data[0]._id)
  //console.log(props.data[0].userId)

  const [dataTotalDistance, setDataTotalDistance] = useState<any[]>([0, 1, 2, 3]);
  const [dataTotalTime, setDataTotalTime] = useState<any[]>([0, 1, 2, 3]);
  const [labels, setLabels] = useState<any[]>(["Jan", "Feb", "Mar"]);

  useEffect(() => {

    let result:any[] = []
    let workoutAmounts:any[] = []
    let totalDistance:any[] = []
    let totalTime:any[] = []
    let labels:any[] = []

    if(props.filter == 4) //1 month
    {
      result = groupWorkoutsByWeeks(props.data, props.startDate, props.endDate)
      //console.log(result[0].workouts)
      for(let i = 0; i < result.length; i++)
      {
        let totalDistanceAndTime = calculateTotalDistanceAndTime(result[i].workouts)

        workoutAmounts.push(result[i].workouts.length)
        totalTime.push(totalDistanceAndTime.totalTime)
        totalDistance.push(totalDistanceAndTime.totalDistance)

        if(i == (result.length - 1))
        {
          labels.push("Current Week")
        }
        else if(i == 0)
        {
          labels.push( result.length - 1 + " Weeks ago")
        }
        else
        {
          labels.push("")
        }
        
      }
      
      setDataTotalTime(totalTime)
      setDataTotalDistance(totalDistance)
      setLabels(labels)
    }
    else if(props.filter == 3) //3 months
    {
      result = groupWorkoutsByWeeks(props.data, props.startDate, props.endDate)
      for(let i = 0; i < result.length; i++)
      {
        let totalDistanceAndTime = calculateTotalDistanceAndTime(result[i].workouts)

        workoutAmounts.push(result[i].workouts.length)
        totalTime.push(totalDistanceAndTime.totalTime)
        totalDistance.push(totalDistanceAndTime.totalDistance)

        if(i == (result.length - 1))
        {
          labels.push("Now")
        }
        else if(i == 1)
        {
          labels.push(result.length - 2 + " Weeks ago")
        }
        else if(i == Math.floor(result.length/2))
        {
          labels.push(Math.floor(result.length/2) + " Weeks ago ")
        }
        else
        {
          labels.push("")
        }
      }
      
      setDataTotalTime(totalTime)
      setDataTotalDistance(totalDistance)
      setLabels(labels)
    }
    else if(props.filter == 2) //6 months
    {
      result = groupWorkoutsByMonths(props.data, props.startDate, props.endDate)
      for(let i = 0; i < result.length; i++)
      {
        let totalDistanceAndTime = calculateTotalDistanceAndTime(result[i].workouts)

        workoutAmounts.push(result[i].workouts.length)
        totalTime.push(totalDistanceAndTime.totalTime)
        totalDistance.push(totalDistanceAndTime.totalDistance)

        if(i == 0)
        {
          labels.push(result.length - 1 + " Months ago")
        }
        else if(i == (result.length - 1))
        {
          labels.push("Current Month")
        }
        else
        {
          labels.push("")
        }
      }
     
      setDataTotalTime(totalTime)
      setDataTotalDistance(totalDistance)
      setLabels(labels)
    }
    else if(props.filter == 1) //1 year
    {
      result = groupWorkoutsByMonths(props.data, props.startDate, props.endDate)
      let loopLength = 12;

      for(let i = 0; i < loopLength; i++)
      {
        let totalDistanceAndTime = calculateTotalDistanceAndTime(result[i].workouts)

        workoutAmounts.push(result[i].workouts.length)
        totalTime.push(totalDistanceAndTime.totalTime)
        totalDistance.push(totalDistanceAndTime.totalDistance)

        if(i == 0)
        {
          labels.push(result.length - 1 + " Months ago")
        }
        else if(i == Math.floor(result.length/2) - 1)
        {
          labels.push(Math.ceil(result.length/2) + " Months ago")
        }
        else if(i == result.length - 1)
        {
          labels.push("Now")
        }
        else
        {
          labels.push("")
        }
      }
      
      setDataTotalTime(totalTime)
      setDataTotalDistance(totalDistance)
      setLabels(labels)
    }
    else if(props.filter == 0) //max
    {
      result = groupWorkoutsIntoSegments(props.data)
      //console.log(result)
      for(let i = 0; i < result.length; i++)
      {
        let totalDistanceAndTime = calculateTotalDistanceAndTime(result[i].workouts)

        workoutAmounts.push(result[i].workouts.length)
        totalTime.push(totalDistanceAndTime.totalTime)
        totalDistance.push(totalDistanceAndTime.totalDistance)
        
        if(i == 0)
        {
          let formattedDate = formatDate(result[i].segmentStart)
          labels.push(formattedDate)
          
        }
        else if(i == result.length - 1)
        {
          labels.push("Now")
        }
        else
        {
          labels.push("")
        }
      }
      
      setDataTotalTime(totalTime)
      setDataTotalDistance(totalDistance)
      setLabels(labels)
      
    }


  },[props.data])

  const formatDate = (date:Date) => {
    
    // console.log(date.toISOString().split("-"))
     let dateParts = date.toISOString().split("-");
 
     let year = dateParts[0]
     let month = dateParts[1]
     let day = dateParts[2].split("T")[0]
     
     let string = day + "/" + month + "/" + year;
 
     return string;
   }


   const groupWorkoutsByWeeks = (data:any, startDateVal:Date, endDateVal:Date) => {
    const startDate = startDateVal
    const endDate = endDateVal;
  
    // Normalize start and end dates to the start of the day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    let numWeeks = Math.floor(daysDiff/7)
    console.log(daysDiff)
    console.log(numWeeks)
  
    const result:any[] = [];
  
    // Calculate the first week end date
    let currentWeekEnd = new Date(endDate);
    let currentWeekStart = new Date(currentWeekEnd);
    currentWeekStart.setDate(currentWeekEnd.getDate() - 6);
    
    for(let i = 0; i < numWeeks; i++)
    {
      const weeklyWorkouts:any = {
        weekStart: new Date(currentWeekStart),
        weekEnd: new Date(currentWeekEnd),
        workouts: []
      };
      
      for(let i = 0; i < data.length; i++)
      {
        const workoutDate = new Date(data[i].dateCreated)
        if(workoutDate >= currentWeekStart && workoutDate <= currentWeekEnd)
        {
          weeklyWorkouts.workouts.push(data[0])
        }
      }
      
      result.push(weeklyWorkouts);
  
      // Move to the next week
      currentWeekStart.setDate(currentWeekStart.getDate() - 7);
      currentWeekEnd.setDate(currentWeekEnd.getDate() - 7);
    }
   
    console.log(result)
    return result.reverse();
  }

  const groupWorkoutsByMonths = (data:any, startDateVal:Date, endDateVal:Date) => {

    const startDate = startDateVal;
    const endDate = endDateVal;
  
    // Normalize start and end dates to the start of the day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    let numMonths = Math.floor(daysDiff/28)
    if(numMonths > 12)
    {
      numMonths = 12;
    }
    else
    {
      numMonths = 6;
    }
    console.log(daysDiff)
    console.log(numMonths)
  
    const result:any[] = [];
  
    // Calculate the first month end date
    let currentMonthEnd = new Date(endDate); // Last day of the current month
    let currentMonthStart = new Date(currentMonthEnd.getFullYear(), currentMonthEnd.getMonth() - 1, 0);

    for(let i = 0; i < numMonths; i++)
      {
        const monthlyWorkouts:any = {
          monthStart: new Date(currentMonthStart),
          monthEnd: new Date(currentMonthEnd),
          workouts: []
        };
        
        for(let i = 0; i < data.length; i++)
        {
          const workoutDate = new Date(data[i].dateCreated)
          if(workoutDate >= currentMonthStart && workoutDate <= currentMonthEnd)
          {
            monthlyWorkouts.workouts.push(data[0])
          }
        }
        
        result.push(monthlyWorkouts);
    
        currentMonthStart.setMonth(currentMonthStart.getMonth() - 1);
        currentMonthEnd = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - 1, 0); // Last day of the next month
      }
  
    console.log("Result: ", result)
    return result.reverse();
  }

  const groupWorkoutsIntoSegments = (data:any[]) => {
    if (data.length === 0) return [];
  
    // Sort workouts by date to find the earliest one
    const earliestDate = new Date(data[0].dateCreated);
    const now = new Date();

    console.log(earliestDate)
    console.log(now)
  
    // Normalize earliestDate to the start of the day
    //earliestDate.setHours(0, 0, 0, 0);
    //now.setHours(0, 0, 0, 0);
  
    // Calculate the total time span in milliseconds
    const totalSpan = now.getTime() - earliestDate.getTime();
    console.log(totalSpan)
  
    // Calculate the length of each segment
    const segmentLength = totalSpan / 12;
    console.log(segmentLength)
  
    const result:any[] = [];

    let segmentEnd = now;
    let segmentStart = new Date(segmentEnd.getTime() - segmentLength);

  
    for (let i = 0; i < 12; i++) {
      

      //console.log("Segment Start: ", segmentStart)
      //console.log("Segment End: ", segmentEnd)
  
      // Group workouts for the current segment
      const segmentWorkouts:any = {
        segmentStart,
        segmentEnd,
        workouts: []
      };
  
      for (const workout of data) {
        const workoutDate = new Date(workout.dateCreated);
        if (workoutDate >= segmentStart && workoutDate < segmentEnd) {
          segmentWorkouts.workouts.push(workout);
        }
      }

      segmentStart = new Date(segmentStart.getTime() - segmentLength);
      segmentEnd = new Date(segmentEnd.getTime() - segmentLength);
  
      result.push(segmentWorkouts);
    }

    console.log(result)
  
    return result.reverse();
  }

  const calculateTotalDistanceAndTime = (data:any) => {

    let totalDistance = 0;
    let totalTime = 0;

    for(let i = 0; i < data.length; i++)
        {
            
            //console.log(data[i].weights.length)
            let numDistancesArray = data[i].distance.length;
            for(let j = 0; j < numDistancesArray; j++)
            {
                //console.log(data[i].weights[j])
                let jsonDataDistances = JSON.parse(data[i].distance[j]);
                let jsonDataTime = JSON.parse(data[i].time[j]);

                let jsonDataExercises = JSON.parse(data[i].exercise[j])

                if(jsonDataExercises.value != props.exerciseId)
                {
                  continue;
                }
                
                console.log("______________________________")
                console.log("Exercises: ", jsonDataExercises);
                console.log("Distance: ", jsonDataDistances)
                console.log("Time: ", jsonDataTime)

                let distance = 0;
                let time = 0;

                for(let k = 0; k < jsonDataDistances.length; k++)
                {
                    distance = parseFloat(jsonDataDistances[k].value);
                    time = parseFloat(jsonDataTime[k].value);
                    
                    totalDistance += distance;
                    totalTime += time;
                }
            }
            
        }

    return {totalDistance, totalTime};
  }

  const convertFilterToText = (filter:number) => {
    if(filter == 0)
    {
      return "All Time"
    }
    else if(filter == 1)
    {
      return "Last Year"
    }
    else if(filter == 2)
    {
      return "Last 6 Months"
    }
    else if(filter == 3)
    {
      return "Last 3 Months"
    }
    else if(filter == 4)
    {
      return "Last Month"
    }
  }


  
    return (
      <View style={styles.mainContainer}>
      <View style={styles.container}>
      <Text style={{marginBottom: 10, fontWeight: '800', color: colors.black, fontSize: 18,}}>Average Total Distance</Text>
      <Text style={{marginBottom: 10, fontWeight: '300', color: colors.black, fontSize: 18,}}>{convertFilterToText(props.filter)}</Text>
<LineChart
    data={{ 
        labels: labels, 
        datasets: [
            { 
                data: dataTotalDistance,
                color: (opacity = 1) => colors.green,
                strokeWidth: 2,
            },
        ],
     }}

    width={Dimensions.get("window").width - 20} // from react-native
    height={300}
    yAxisLabel=""
    yAxisSuffix="T"
    yAxisInterval={1} // optional, defaults to 1
    fromZero
    onDataPointClick={(data) => {console.log(data)}}
    verticalLabelRotation={0}
    
    chartConfig={{
      backgroundColor: "#f0f0f0", // light gray background
      backgroundGradientFrom: "#f0f0f0", // light gray background
      backgroundGradientTo: "#f0f0f0", // light gray background
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => 'gray',
      labelColor: (opacity = 1) => colors.black,
      style: {
        borderRadius: 16
      },
      propsForBackgroundLines: {
        strokeWidth: 1,
        stroke: "rgba(0, 0, 0, 0.4)",
      },
      propsForLabels: {
         // This will adjust the padding for the labels
         
      },
      propsForDots: {
        r: "6",
        strokeWidth: "1",
        stroke: colors.black,
      },
      
    }}
    bezier
    style={{
        borderRadius: 10,
    }}
  />
  </View>
  <View style={styles.container}>
  <Text style={{marginBottom: 10, fontWeight: '800', color: colors.black, fontSize: 18,}}>Average Total Time</Text>
  <Text style={{marginBottom: 10, fontWeight: '300', color: colors.black, fontSize: 18,}}>{convertFilterToText(props.filter)}</Text>
    <LineChart
    data={{ 
        labels: labels, 
        datasets: [
            { 
                data: dataTotalTime,
                color: (opacity = 1) => colors.red,
                strokeWidth: 2,
            },
        ],
     }}

    width={Dimensions.get("window").width - 20} // from react-native
    height={300}
    yAxisLabel=""
    yAxisSuffix=""
    yAxisInterval={1} // optional, defaults to 1
    fromZero
    onDataPointClick={(data) => {console.log(data)}}
    verticalLabelRotation={0}
    
    chartConfig={{
      backgroundColor: "#f0f0f0", // light gray background
      backgroundGradientFrom: "#f0f0f0", // light gray background
      backgroundGradientTo: "#f0f0f0", // light gray background
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => 'gray',
      labelColor: (opacity = 1) => colors.black,
      style: {
        borderRadius: 16
      },
      propsForBackgroundLines: {
        strokeWidth: 1,
        stroke: "rgba(0, 0, 0, 0.4)",
      },
      propsForLabels: {
         // This will adjust the padding for the labels
         
      },
      propsForDots: {
        r: "6",
        strokeWidth: "1",
        stroke: colors.black,
      },
      
    }}
    bezier
    style={{
        borderRadius: 10,
    }}
  />
  </View>
      </View>
      
    )
}