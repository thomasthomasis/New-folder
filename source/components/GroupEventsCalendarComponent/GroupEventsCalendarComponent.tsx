import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import { colors } from '../../sharedStyling/Colors';
import { useQuery, useRealm, useUser } from '@realm/react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './GroupEventsCalendarComponent.style';
import { GroupEvents } from '../../schemas/GroupEventsScehma';

type CalendarProps = {
    group:string,
    selectDay:any,
}

export const GroupEventsCalendarComponent = (props: CalendarProps) => {

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

    const events = useQuery(GroupEvents).sorted('startDate').filtered('groupId == $0 AND startDate >= $1 AND startDate < $2', props.group, startOfMonth, endOfMonth);
    const [eventArray, setEventsArray] = useState<any>(events)


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

        let currentYear = year;
        let startOfMonth = new Date(year, month, 1)
        let endOfMonth = new Date(year, month + 1, 0)

        if(month == -1)
        {
            getCalendarDays(1, year - 1)
            setYear(year - 1)
            setMonth(11)
            startOfMonth = new Date(currentYear - 1, 11, 1)
            endOfMonth = new Date(currentYear, 0, 0)
        }
        else if(month == 12)
        {
            getCalendarDays(0, year + 1)
            setYear(year + 1)
            setMonth(0)
            startOfMonth = new Date(currentYear + 1, 0, 1)
            endOfMonth = new Date(currentYear + 1,  1, 0)
        }
        else
        {
            getCalendarDays(month, year)
            setMonth(month)
            startOfMonth = new Date(currentYear, month, 1)
            endOfMonth = new Date(currentYear, month + 1, 0)
        }

        const events = realm.objects(GroupEvents).sorted('startDate').filtered('groupId == $0 AND startDate >= $1 AND startDate < $2', props.group, startOfMonth, endOfMonth);
        setEventsArray(events)
  

      //let result = extractDayAndWorkoutType(eventArray)
      //console.log("new result: ", result)
      //generateMergedData(result)
      console.log("Event: ", eventArray)
    }


    const [calendarDays, setCalendarDays] = useState<string[]>([]);
    useEffect(() => {
      let numDaysInMonth = new Date(year, month + 1, 0).getDate();
      let firstDayOfWeek = new Date(year, month, 0).getDay();

      //console.log("Days in Month: ", numDaysInMonth)
      //console.log("First Day of Week: ", firstDayOfWeek)

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
      //console.log("month: ", date.toLocaleString())

      let numDaysInMonth = new Date(year, month + 1, 0).getDate();
      let firstDayOfWeek = new Date(year, month, 0).getDay();
      

      //console.log("------")
      //console.log("Month: ", month)


      //console.log("Days in Month: ", numDaysInMonth)
      //console.log("First Day of Week: ", firstDayOfWeek)

      let days:string[] = []

      let numDaysOfPreviousMonth = new Date(year, month - 1, 0).getDate()
      //console.log(numDaysOfPreviousMonth)

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
          const dayNumber = new Date(item.startDate).getDate(); // Extract day number from the date
          return { dayNumber, colors: item.color };
        });
    };

    const result = extractDayAndWorkoutType(eventArray)
    console.log(result)

    const mergedData:any = {};
    const generateMergedData = (result:any) => {
        const dayNumbers = result.map((item:any) => item.dayNumber);
        const colorsData = result.map((item:any) => item.colors);
    
        for (let i = 0; i < dayNumbers.length; i++) {
            const dayNumber = dayNumbers[i];
            const color = colorsData[i];
          
            if (!mergedData[dayNumber]) {
              mergedData[dayNumber] = new Set([color]); // Use a Set to store colour
            } else {
              mergedData[dayNumber].add(color); // Add colour to the Set
            }
          }
    
        // Convert Sets to arrays
        for (const dayNumber in mergedData) {
            mergedData[dayNumber] = Array.from(mergedData[dayNumber]);
        }
    }
    generateMergedData(result)
    console.log(mergedData)
      
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
          mutableSubs.add(realm.objects(GroupEvents));
        });
      }, [realm, user]);

    return (
        <View>
            <View style={styles.arrows}>
              <TouchableOpacity onPress={() => selectMonth(month - 1)}>
                <MaterialCommunityIcons name="arrow-left" color={colors.black} size={35} />
              </TouchableOpacity>
              <Text style={styles.month}>{monthWord} {year}</Text>
              <TouchableOpacity onPress={() => selectMonth(month + 1)}>
                <MaterialCommunityIcons name="arrow-right" color={colors.black} size={35} />
              </TouchableOpacity>
            </View>
            <View style={styles.weekdays}>
              <View style={styles.weekday}><Text style={{color: colors.green}}>M</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.green}}>T</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.green}}>W</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.green}}>T</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.green}}>F</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.green}}>S</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.green}}>S</Text></View>
            </View>
        <View style={styles.container}>
            
            {calendarDays.map((day, index) => (
            <TouchableOpacity key={index} 
            style={[ styles.day,  ((currentWeekDays.includes(day.toString()) && currentMonth == month && year == currentYear) && styles.currentWeekDay), day.includes(" ") && {pointerEvents: 'none'}, (selectedDay == day.toString() && styles.selectedDay),
              ]}   
            onPress={() => {props.selectDay(day.toString(), month, year), selectDay(day.toString())}}>
            <Text style={[styles.dayText, ((currentDay == day && month == currentMonth) && styles.currentDayText), day.includes(" ") && {color: 'lightgray'}]}>{day || ' '}</Text>
            {
                mergedData[day] &&
                <View style={styles.dots}>
                    <View style={[styles.dot, {backgroundColor: mergedData[day][0]}]}></View>
                </View>
            }
            
          </TouchableOpacity>
        ))}
      </View>
        </View>
        
    )

}

