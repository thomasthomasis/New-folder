import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ScrollView, FlatList, Dimensions} from 'react-native';
import { useRealm, useUser } from '@realm/react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './GroupEventsScreen.style';
import Modal from 'react-native-modal';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp, useFocusEffect, useIsFocused } from '@react-navigation/native'
import { colors } from '../../sharedStyling/Colors';
import { Groups } from '../../schemas/GroupsSchema';
import { GroupEvents } from '../../schemas/GroupEventsScehma';
import { BSON } from 'realm';
import { shadow } from '../../sharedStyling/Shadow';
import { GroupEventsCalendarComponent } from '../../components/GroupEventsCalendarComponent/GroupEventsCalendarComponent';

type GroupEventsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'GroupEvents'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'GroupEvents'>;
};

export const GroupEventsScreen = ({ navigation, route}: GroupEventsScreenProps) => {

    const realm = useRealm();
    const user = useUser();
    const isFocused = useIsFocused();

    const goToGroupEvent = (event:string) => {
        navigation.navigate("GroupEvent", { event: event })
    }

    const goToCreateGroupEvent = () => {
        navigation.navigate("CreateGroupEvent", { group: group })
    }

    const { group } = route.params;

    const selectedGroup = realm.objects(Groups).filtered("groupId == $0", group)
    let events = realm.objects(GroupEvents).filtered("groupId == $0", group).sorted("startDate", true)

    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const isOwner = (groupId:string) => {
        const group = realm.objects(Groups).filtered("groupId == $0", groupId)

        const userIndex = group[0].members.indexOf(user.id)
        const userRole = group[0].memberRoles[userIndex]

        if(user.id == group[0].owner || userRole == "Captain" || userRole == "Coach")
            {
                return true
            }

        return false
    }

    const timeDifference = (date:Date) => {
        const now = new Date();
        const targetDate = new Date(date);
      
        // Ensure the target date is valid
        if (isNaN(targetDate.getTime())) {
          return 'Invalid date';
        }
      
        const diff = targetDate.getTime() - now.getTime();
        const isPast = diff < 0;
      
        const absDiff = Math.abs(diff);
      
        const seconds = Math.floor(absDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30.44); // Approximate average month length in days
      
        let result;
        if (months > 0) {
          result = `${months} month${months !== 1 ? 's' : ''}`;
        } else if (weeks > 0) {
          result = `${weeks} week${weeks !== 1 ? 's' : ''}`;
        } else if (days > 0) {
          result = `${days} day${days !== 1 ? 's' : ''}`;
        } else if (hours > 0) {
          result = `${hours} hour${hours !== 1 ? 's' : ''}`;
        } else if (minutes > 0) {
          result = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
          result = `${seconds} second${seconds !== 1 ? 's' : ''}`;
        }
      
        return isPast ? `${result} ago` : ` in ${result}`;
      }

    const formatDate = (date:Date) => {
    const targetDate = new Date(date);
    
    // Ensure the target date is valid
    if (isNaN(targetDate.getTime())) {
        return 'Invalid date';
    }
    
    const day = targetDate.getDate();
    const month = targetDate.toLocaleString('default', { month: 'short' });
    const year = targetDate.getFullYear();
    
    // Function to get the ordinal suffix for a given day
    const getOrdinalSuffix = (day:any) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
        }
    };
    
    const dayWithSuffix = day + getOrdinalSuffix(day);
    
    return `${dayWithSuffix} ${month} ${year}`;
    }

    const truncateText = (text:string, limit:number) => {
        if (text.length > limit) {
            return text.substring(0, limit) + '...';
          }
          return text;
    }

    useEffect(() => {
        setIsAdmin(isOwner(group))
    }, [])

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
                realm.objects(Groups)
            )
        });
        }, [realm, user]);

    useEffect(() => {
        if(isFocused)
        {
            events = realm.objects(GroupEvents).filtered("groupId == $0", group).sorted("startDate", true)
        }
    })

    const [futureFilter, setFutureFilter] = useState<boolean>(true)
    const [pastFilter, setPastFilter] = useState<boolean>(true)
    const [trainingFilter, setTrainingFilter] = useState<boolean>(true)
    const [tournamentFilter, setTournamentFilter] = useState<boolean>(true)

    const [eventsArray, setEventsArray] = useState<any>(events)

    const toggleFilter = (filter: string) => {

        let futureValue = futureFilter;
        let pastValue = pastFilter;
        let trainingValue = trainingFilter;
        let tournamentValue = tournamentFilter;

        if (filter === "future") {
          setFutureFilter(!futureFilter);
          futureValue = !futureValue;
        } else if (filter === "past") {
          setPastFilter(!pastFilter);
          pastValue = !pastValue
        } else if (filter === "training") {
          setTrainingFilter(!trainingFilter);
          trainingValue = !trainingValue
        } else if (filter === "tournament") {
          setTournamentFilter(!tournamentFilter);
          tournamentValue = !tournamentValue
        }

      
        let date = new Date();
        let query = "groupId == $0";
        let args: any[] = [group];
      
        if (!futureValue && !pastValue) 
        {
            query += " AND falsepredicate";
        } 
        else if (!futureValue && pastValue) 
        {
            query += " AND startDate < $1";
            args.push(date);
        } 
        else if (futureValue && pastValue) 
        {
            query += " AND (startDate > $1 OR startDate < $1)";
            args.push(date);
        } 
        else if(futureValue && !pastValue)
        {
            // If both are false, set an impossible condition
            query += " AND startDate > $1";
            args.push(date);
        }
      
        if (trainingValue && tournamentValue) {
          query += " AND (isTraining == true OR isTraining == false)";
        } else if (trainingValue) {
          query += " AND isTraining == true";
        } else if (tournamentValue) {
          query += " AND isTraining == false";
        }
        else if(!tournamentValue && !trainingValue)
        {
          query += " AND falsepredicate";
        }
      
        const filteredEvents = realm.objects(GroupEvents).filtered(query, ...args).sorted("startDate", true);
        setEventsArray(filteredEvents);
      };

    const [selectedDay, setSelectedDay] = useState("");
    const selectDay = (dayString:string, month:number, year:number) => {

      console.log("current value: ", selectedDay)
      console.log("incoming value: ", dayString)

      if(dayString == selectedDay)
      {
        const events = realm.objects(GroupEvents).filtered("groupId == $0", group).sorted("startDate", true)
        setEventsArray(events)
        setSelectedDay("")

        setFutureFilter(true)
        setPastFilter(true)
        setTrainingFilter(true)
        setTournamentFilter(true)
        return;
      }
      
      const day = parseInt(dayString, 10);
      const now = new Date();

      setSelectedDay(dayString);

      const startOfDay = new Date(year, month, day, 0, 0, 0, 0);
      const endOfDay = new Date(year, month, day, 23, 59, 59, 999);

      const events = realm.objects(GroupEvents).sorted('startDate').filtered('groupId == $0 AND startDate >= $1 AND startDate < $2', group, startOfDay, endOfDay);
      setEventsArray(events);
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
        <GroupEventsCalendarComponent selectDay={selectDay} group={group}/>
        {
          selectedDay == "" &&
          <View style={styles.filters}>
            <TouchableOpacity style={[styles.filterButton, futureFilter && {backgroundColor: selectedGroup[0].color}]} onPress={() => toggleFilter("future")}>
                <Text style={styles.filterButtonText}>Future</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, pastFilter && {backgroundColor: selectedGroup[0].color}]} onPress={() => toggleFilter("past")}>
                <Text style={styles.filterButtonText}>Past</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, trainingFilter && {backgroundColor: selectedGroup[0].color}]} onPress={() => toggleFilter("training")}>
                <Text style={styles.filterButtonText}>Training</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, tournamentFilter && {backgroundColor: selectedGroup[0].color}]} onPress={() => toggleFilter("tournament")}>
                <Text style={styles.filterButtonText}>Tournament</Text>
            </TouchableOpacity>
          </View>
        }
        
        

            {
              eventsArray.map((item:any, index:any) => (
                <TouchableOpacity key={new BSON.ObjectID().toString()} style={[styles.eventCard, {backgroundColor: item.color}, index == events.length - 1 && {marginBottom: 100,}, shadow.shadow]} onPress={() => goToGroupEvent(item.eventId)}>
                        <View style={styles.eventRow}>
                            <Text style={styles.eventText}>{truncateText(item.name ?? "", 20)}</Text>
                            <Text style={styles.eventText}>{formatDate(item.startDate ?? new Date())}</Text>
                        </View>
                        <View style={styles.border}></View>
                        <Text style={[styles.eventText, {textAlign: 'center', fontSize: 35,}]}>{timeDifference(item.startDate ?? new Date())}</Text>
                    </TouchableOpacity>
              ))
            }
            {
                isAdmin && 
                <TouchableOpacity onPress={goToCreateGroupEvent} style={[styles.addButton, {backgroundColor: selectedGroup[0].color}, shadow.shadow]}>
                    <MaterialCommunityIcons name="plus" size={60} color={'white'}/>
                </TouchableOpacity>
            }
  
        </ScrollView>
        
    )
}