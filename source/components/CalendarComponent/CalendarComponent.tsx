import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import { colors } from '../../sharedStyling/Colors';
import { useQuery, useRealm, useUser } from '@realm/react';
import { Workouts } from '../../schemas/WorkoutSchema';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './CalendarComponent.style';
import { shadow } from '../../sharedStyling/Shadow';

type CalendarProps = {
    onPress:any,
    setWorkouts:any,
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
    const [daysStatus, setDaysStatus] = useState<any[]>([])
    const [daysStatusDates, setDaysStatusDates] = useState<any[]>([])


    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let monthWord = monthNames[month];

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0)

    const [workouts, setWorkouts] = useState<any>(realm.objects(Workouts).sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfMonth, endOfMonth));

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

      console.log(weekDates)
      return weekDates;
    }

    const [currentWeekDates, setCurrentWeekDate] = useState(getDaysOfCurrentWeek())

    
    const selectMonth = (month:number, year:number) => {

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

      setSelectedDay('')
      
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
        days.push((numDaysOfPreviousMonth - (firstDayOfWeek - 1) + i).toString() + "+extraDay")
      }
      for (let i = 1; i <= numDaysInMonth; i++) {
        days.push(i.toString())
      }

      if(days.length <= 35)
      {
        let counter = 1;
        for(let i = days.length; i < 35; i++)
        {
          days.push(counter.toString() + "+extraDay")
          counter++;
        }
      }
      else 
      {
        let counter = 1;
        for(let i = days.length; i < 42; i++)
        {
          days.push(counter.toString() + "+extraDay")
          counter++;
        }
      }

      console.log(days)
      setCalendarDays(days)
    }, [])
    

    const getCalendarDays = (month:number, year:number) => {

      const date = new Date(year, month, 1)
      console.log("month: ", date.toLocaleString())

      let startOfMonth = date;
      let endOfMonth = new Date(year, month + 1, 0)

      let workouts = realm.objects(Workouts).sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1 AND userId == $2', startOfMonth, endOfMonth, user.id)
      setWorkouts(workouts)
      props.setWorkouts(workouts)

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
        days.push((numDaysOfPreviousMonth - (firstDayOfWeek - 1) + i).toString() + "+extraDays")
      }
      for (let i = 1; i <= numDaysInMonth; i++) {
        days.push(i.toString())
      }

      if(days.length <= 35)
        {
          let counter = 1;
          for(let i = days.length; i < 35; i++)
          {
            days.push(counter.toString() + "+extraDay")
            counter++;
          }
        }
        else 
        {
          let counter = 1;
          for(let i = days.length; i < 42; i++)
          {
            days.push(counter.toString() + "+extraDay")
            counter++;
          }
        }

      console.log(days)
      setCalendarDays(days)

      return days;
      
    }

    const extractDayAndWorkoutType = (data: any): any[] => {
        return data.map((item: any) => {
          const dayNumber = new Date(item.dateCreated).getDate(); // Extract day number from the date
          return { dayNumber, userStatus: item.userStatus };
        });
    };

    useEffect(() => {

      const result = extractDayAndWorkoutType(workouts)

      const dayNumbers = result.map(item => (item.dayNumber).toString());
      const userStatuses = result.map(item => item.userStatus)

      let newUserStatuses = []

      for(let i = 1; i <= 31; i++)
      {
        if(dayNumbers.includes(i.toString()))
        {
          let index = dayNumbers.indexOf(i.toString())
          newUserStatuses.push(userStatuses[index])
        }
        else
        {
          newUserStatuses.push("")
        }
      }

      setDaysStatus(newUserStatuses)
      setDaysStatusDates(dayNumbers)

      //console.log(dayNumbers)
      //console.log(newUserStatuses) 

    }, [workouts])

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
        <View style={[styles.mainContainer, shadow.shadow]}>
            <View style={styles.arrows}>
              <TouchableOpacity onPress={() => selectMonth(month - 1, year)}>
                <MaterialCommunityIcons name="chevron-left" color={colors.black} size={35} />
              </TouchableOpacity>
              <Text style={styles.month}>{monthWord} {year}</Text>
              <TouchableOpacity onPress={() => selectMonth(month + 1, year)}>
                <MaterialCommunityIcons name="chevron-right" color={colors.black} size={35} />
              </TouchableOpacity>
            </View>
            <View style={styles.weekdays}>
              <View style={styles.weekday}><Text style={{color: colors.text, fontWeight: '900', fontSize: 20,}}>M</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.text, fontWeight: '900', fontSize: 20,}}>T</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.text, fontWeight: '900', fontSize: 20,}}>W</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.text, fontWeight: '900', fontSize: 20,}}>T</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.text, fontWeight: '900', fontSize: 20,}}>F</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.text, fontWeight: '900', fontSize: 20,}}>S</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.text, fontWeight: '900', fontSize: 20,}}>S</Text></View>
            </View>
        <View style={styles.container}>
            
            {
            calendarDays.map((day, index) => (
            <TouchableOpacity key={index} 
            style={[ styles.day,  ((currentWeekDates.includes(day.toString()) && currentMonth == month && year == currentYear) && styles.currentWeekDay), day.includes("+extraDay") && {pointerEvents: 'none'}, currentWeekDates[0] == day && {borderBottomLeftRadius: 10, borderTopLeftRadius: 10}, currentWeekDates[currentWeekDates.length - 1] == day && {borderBottomRightRadius: 10, borderTopRightRadius: 10},
              ]}   
            onPress={() => {props.onPress(day.toString()), selectDay(day.toString())}}>

              <View style={styles.dots}>
                {
                  daysStatusDates.includes(day) &&
                  <View style={styles.dot}>
                  </View>
                }
              </View> 

              <View style={styles.dotsUserStatus}>
                {
                  daysStatus[index] == "Injured" &&
                  <View style={styles.dotUserStatusInjured}></View>
                }
                {
                  daysStatus[index] == "Away" &&
                  <View style={styles.dotUserStatusAway}></View>
                }
              </View>

                {
                  selectedDay == day.toString() && 
                  <View style={styles.currentDayCircle}></View>
                }

                {
                  currentDay == day && month == currentMonth && year == currentYear &&
                  <View style={styles.currentDay}></View>
                }
              
              
              
            <Text style={[styles.dayText, ((currentDay == day && month == currentMonth) && styles.currentDayText), day.includes("+extraDay") && {color: 'lightgray'}]}>
              {
                day.includes("+extraDay") && day.split("+")[0].length == 1 &&
                "0" + day.split("+")[0]
              }
              {
                day.includes("+extraDay") && day.split("+")[0].length > 1 &&
                day.split("+")[0]
              }
              {
                day.length == 1 &&
                 "0" + day || ''
              }
              {
                day.length == 2 &&
                day || ''
              }
            </Text>
           
            
          </TouchableOpacity>
        ))}
      </View>
        </View>
        
    )

}

