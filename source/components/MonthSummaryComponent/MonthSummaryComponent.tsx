import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { colors } from '../../sharedStyling/Colors'
import { CalendarComponent } from '../CalendarComponent/CalendarComponent';
import { Workouts } from '../../schemas/WorkoutSchema';
import { useRealm, useUser } from '@realm/react';
import { CardioWorkout } from '../../schemas/CardioWorkoutSchema';
import { ResistanceWorkout } from '../../schemas/ResistanceWorkoutSchema';
import { GeneralResistanceStatsComponent } from '../GeneralResistanceStatsComponent/GeneralResistanceStatsComponent';
import { GeneralCardioStatsComponent } from '../GeneralCardioStatsComponent/GeneralCardioStatsComponent';
import PagerView from 'react-native-pager-view';
import styles from './MonthSummaryComponent.style';

export const MonthSummaryComponent = () => {

    const realm = useRealm();
    const user = useUser();

    const currentDate = new Date()
    const [year, setYear] = useState<number>(currentDate.getFullYear())
    const [month, setMonth] = useState<number>(currentDate.getMonth())

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0)

    const cardioObjectsWithinCurrentMonth = realm.objects('CardioWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfMonth, endOfMonth);

    const resistanceObjectsWithinCurrentMonth = realm.objects('ResistanceWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfMonth, endOfMonth);

    const [showGeneralMonthlyStats, setShowGeneralMonthlyStats] = useState<boolean>(true)
    const [selectedDay, setSelectedDay] = useState<string>('')

    let cardioObjectsOfSelectedDay:any = [];
    let resistanceObjectsOfSelectedDay:any = [];


    const changeMonth = (month:number) => {

        if(month == -1)
        {
          setYear(year - 1)
          setMonth(11)
        }
        else if(month == 12)
        {
          setYear(year + 1)
          setMonth(0)
        }
        else
        {
          setMonth(month)
        }
        
      }

    
    const selectDay = (day:string) => {
        if(day == selectedDay)
        {
            setSelectedDay('')
            if(!showGeneralMonthlyStats)
            {
                setShowGeneralMonthlyStats(true)
            }
            return;
        }
        else
        {
            setSelectedDay(day)
        }

        const newDate = new Date(year, month, Number(day))
        const startOfDay = new Date(newDate)
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(newDate)
        endOfDay.setHours(23, 59, 59, 999)
        cardioObjectsOfSelectedDay = realm.objects('CardioWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfDay, endOfDay);
        resistanceObjectsOfSelectedDay = realm.objects('ResistanceWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfDay, endOfDay);
        

        if(showGeneralMonthlyStats)
        {
            setShowGeneralMonthlyStats(false)
        }


    }

    const calculateDateEnding = (day:any) => {

        let lastChar = day.charAt(day.length - 1);
        
        if(lastChar == '1')
        {
            return 'st'
        }
        else if(lastChar == '2')
        {
            return 'nd'
        }
        else if(lastChar == '3')
        {
            return 'rd'
        }
        else if(lastChar == '4' || lastChar == '5' || lastChar == '6' || lastChar == '7' || lastChar == '8' || lastChar == '9' || lastChar == '0')
        {
            return 'th'
        }
    }

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
          mutableSubs.add(
            realm.objects(CardioWorkout),
          );
    
          mutableSubs.add(
            realm.objects(ResistanceWorkout)
          );

          mutableSubs.add(
            realm.objects(Workouts)
          );
        });
      }, [realm, user]);

    const [selectedPage, setSelectedPage] = useState(0)
    const pagerRef = React.useRef<PagerView>(null)

    const handlePageChange = (pageNumber:any) => {
        pagerRef.current?.setPage(pageNumber);
        setSelectedPage(pageNumber)
    }

    return (
        <ScrollView>
            <CalendarComponent onPress={selectDay} changeMonth={changeMonth}/>
            <View style={styles.pageVisualiser}>
                <TouchableOpacity onPress={() => handlePageChange(0)} style={[styles.bar, selectedPage == 0 && {backgroundColor: colors.blue}]}><Text style={selectedPage == 0 && {color: 'white', fontWeight: '800'}}>Month</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handlePageChange(1)} style={[styles.bar, selectedPage == 1 && {backgroundColor: colors.blue}]}><Text style={selectedPage == 1 && {color: 'white', fontWeight: '800'}}>Week</Text></TouchableOpacity>
            </View>

            <PagerView style={styles.pagerView} initialPage={selectedPage} onPageSelected={(event) => setSelectedPage(event.nativeEvent.position)} scrollEnabled={true} ref={pagerRef}>
                <View>
                    <GeneralCardioStatsComponent cardioObjects={cardioObjectsWithinCurrentMonth}></GeneralCardioStatsComponent>
                    <GeneralResistanceStatsComponent resistanceObjects={resistanceObjectsWithinCurrentMonth}></GeneralResistanceStatsComponent>
                </View>
                <View>
                    <GeneralCardioStatsComponent cardioObjects={cardioObjectsWithinCurrentMonth}></GeneralCardioStatsComponent>
                    <GeneralResistanceStatsComponent resistanceObjects={resistanceObjectsWithinCurrentMonth}></GeneralResistanceStatsComponent>
                </View>
            </PagerView>
            
            
        </ScrollView>
    )
}

