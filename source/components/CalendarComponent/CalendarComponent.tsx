import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import { colors } from '../../sharedStyling/Colors';
import { useQuery, useRealm, useUser } from '@realm/react';
import { Workouts } from '../../schemas/WorkoutSchema';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './CalendarComponent.style';

type CalendarProps = {
    onPress:any,
    changeMonth:any,
}

export const CalendarComponent = (props: CalendarProps) => {

    const realm = useRealm();
    const user = useUser();

    const currentDate = new Date()
    let currentDay = currentDate.toISOString().split("T")[0].split("-")[2]
    let currentMonth = currentDate.getMonth()
    let currentYear = currentDate.getFullYear()
     
    const [year, setYear] = useState<number>(currentDate.getFullYear())
    const [month, setMonth] = useState<number>(currentDate.getMonth())


    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let monthWord = monthNames[month];

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0)

    const workouts = useQuery(Workouts).sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfMonth, endOfMonth);

    const getDaysOfCurrentWeek = () => {
      const weekDates = []
      const currentDayIndex = currentDate.getDay()
      const adjustedDayIndex = (currentDayIndex + 6) % 7;

      for(let i = 0; i < 7; i++)
      {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - adjustedDayIndex + i)
        weekDates.push(date.getDate().toString())
      }

      return weekDates;
    }

    let currentWeekDays = getDaysOfCurrentWeek()

    const selectMonth = (month:number) => {

      if(month == -1)
      {
        getCalendarDays(1, year - 1)
        setYear(year - 1)
        setMonth(11)
      }
      else if(month == 12)
      {
        getCalendarDays(0, year + 1)
        setYear(year + 1)
        setMonth(0)
      }
      else
      {
        getCalendarDays(month, year)
        setMonth(month)
      }
      
    }


    const [calendarDays, setCalendarDays] = useState<string[]>([]);
    useEffect(() => {
      let numDaysInMonth = new Date(year, month + 1, 0).getDate();
      let firstDayOfWeek = new Date(year, month, 0).getDay();

      console.log("Days in Month: ", numDaysInMonth)
      console.log("First Day of Week: ", firstDayOfWeek)

      let days:string[] = []

      let numDaysOfPreviousMonth = new Date(year, month - 1, 0).getDate()

      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push((numDaysOfPreviousMonth - (firstDayOfWeek - 1) + i).toString() + " ")
      }
      for (let i = 1; i <= numDaysInMonth; i++) {
        days.push(i.toString())
      }

      if(days.length <= 35)
      {
        let counter = 1;
        for(let i = days.length; i < 35; i++)
        {
          days.push(counter.toString() + " ")
          counter++;
        }
      }
      else 
      {
        let counter = 1;
        for(let i = days.length; i < 42; i++)
        {
          days.push(counter.toString() + " ")
          counter++;
        }
      }

      setCalendarDays(days)
    }, [])
    

    const getCalendarDays = (month:number, year:number) => {

      const date = new Date(year, month, 1)
      console.log("month: ", date.toLocaleString())

      let numDaysInMonth = new Date(year, month + 1, 0).getDate();
      let firstDayOfWeek = new Date(year, month, 0).getDay();
      

      console.log("------")
      console.log("Month: ", month)


      console.log("Days in Month: ", numDaysInMonth)
      console.log("First Day of Week: ", firstDayOfWeek)

      let days:string[] = []

      let numDaysOfPreviousMonth = new Date(year, month - 1, 0).getDate()
      console.log(numDaysOfPreviousMonth)

      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push((numDaysOfPreviousMonth - (firstDayOfWeek - 1) + i).toString() + " ")
      }
      for (let i = 1; i <= numDaysInMonth; i++) {
        days.push(i.toString())
      }

      if(days.length <= 35)
        {
          let counter = 1;
          for(let i = days.length; i < 35; i++)
          {
            days.push(counter.toString() + " ")
            counter++;
          }
        }
        else 
        {
          let counter = 1;
          for(let i = days.length; i < 42; i++)
          {
            days.push(counter.toString() + " ")
            counter++;
          }
        }

      setCalendarDays(days)

      return days;
      
    }

    const extractDayAndWorkoutType = (data: any): any[] => {
        return data.map((item: any) => {
          const dayNumber = new Date(item.dateCreated).getDate(); // Extract day number from the date
          return { dayNumber, workoutType: item.workoutType };
        });
    };

    const result = extractDayAndWorkoutType(workouts)

    const dayNumbers = result.map(item => item.dayNumber);
    const workoutTypes = result.map(item => item.workoutType);

    const mergedData:any = {};

    for (let i = 0; i < dayNumbers.length; i++) {
        const dayNumber = dayNumbers[i];
        const workoutType = workoutTypes[i];
      
        if (!mergedData[dayNumber]) {
          mergedData[dayNumber] = new Set([workoutType]); // Use a Set to store unique workout types
        } else {
          mergedData[dayNumber].add(workoutType); // Add workout type to the Set
        }
      }

    // Convert Sets to arrays
    for (const dayNumber in mergedData) {
        mergedData[dayNumber] = Array.from(mergedData[dayNumber]);
    }

    //console.log(mergedData)
      
    //----------------------------------------------------------
    const [selectedDay, setSelectedDay] = useState<string>('none')

    const selectDay = (day:string) => {
        if(day == selectedDay)
        {
            setSelectedDay('none')
        }
        else{
            setSelectedDay(day)
        }
    }

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
          mutableSubs.add(realm.objects(Workouts));
        });
      }, [realm, user]);

    return (
        <View>
            <View style={styles.arrows}>
              <TouchableOpacity onPress={() => selectMonth(month - 1)}>
                <MaterialCommunityIcons name="arrow-left" color={'black'} size={35} />
              </TouchableOpacity>
              <Text style={styles.month}>{monthWord} {year}</Text>
              <TouchableOpacity onPress={() => selectMonth(month + 1)}>
                <MaterialCommunityIcons name="arrow-right" color={'black'} size={35} />
              </TouchableOpacity>
            </View>
            <View style={styles.weekdays}>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>M</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>T</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>W</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>T</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>F</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>S</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>S</Text></View>
            </View>
        <View style={styles.container}>
            
            {calendarDays.map((day, index) => (
            <TouchableOpacity key={index} 
            style={[
              styles.day, 
              ((currentWeekDays.includes(day.toString()) && currentMonth == month && year == currentYear) && styles.currentWeekDay),
              day.includes(" ") && {pointerEvents: 'none'},
              (selectedDay == day.toString() && styles.selectedDay),
              ]}   
            onPress={() => {props.onPress(day.toString()), selectDay(day.toString())}}>
            <Text style={[styles.dayText, ((currentDay == day && month == currentMonth) && styles.currentDayText), day.includes(" ") && {color: 'lightgray'}]}>{day || ' '}</Text>
            {
                mergedData[day] &&
                <View style={styles.dots}>
                    {
                        mergedData[day].includes("Cardio") &&
                        <View style={[styles.dot, {backgroundColor: colors.red}]}></View>
                    }
                    {
                        mergedData[day].includes("Resistance") &&
                        <View style={[styles.dot, {backgroundColor: colors.black}]}></View>
                    }
                </View>
            }
            
          </TouchableOpacity>
        ))}
      </View>
        </View>
        
    )

}

