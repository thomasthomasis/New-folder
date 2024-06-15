import { useQuery, useRealm, useUser } from "@realm/react"
import React, { useEffect } from "react"
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { Groups } from "../../schemas/GroupsSchema"
import { Users } from "../../schemas/UsersSchema"
import { Workouts } from "../../schemas/WorkoutSchema"
import { BSON } from "realm"
import styles from "./HistoryScreen.style"

type HistoryScreenProps = {
    group:string,
    onPress:any,
    loadData:any,
}


export const HistoryScreen = (props: HistoryScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const group = useQuery(Groups).filtered('name == $0', props.group);
    const stringIds = group[0].members.map(member => member)
    const datesJoined = group[0].membersDateJoined.map(date => date)


    const currentDate = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(currentDate.getDate() - 30)

    const workouts = useQuery(Workouts).filtered("userId IN $0 AND dateCreated >= $1", stringIds, thirtyDaysAgo).sorted("dateCreated", true)
    //console.log("Workouts: " + workouts.length)

    const userData = useQuery(Users).filtered("userId IN $0", stringIds)

    
    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {

            mutableSubs.add(
                realm.objects(Workouts)
            )

            mutableSubs.add(
                realm.objects(Users)
            )

            mutableSubs.add(
                realm.objects(Groups)
            )
        });
    }, [realm, user]);


    const calculateTime = (date:any) => {
        const currentDate:any = new Date()

        const difference = Math.abs(currentDate - date)
        
        const seconds = Math.abs(difference/1000);
        const minutes = Math.abs(seconds/60)

        let hours = 0;
        let days = 0;
        let months = 0;
        if(minutes > 60)
        {
            hours = Math.abs(minutes/60);
        }
        
        if(hours > 24)
        {

            days = Math.abs(hours/24);
        }

        
        if(days > 30)
        {
            months = Math.abs(days/30);
        }

        if(months > 0)
        {
            return months.toFixed(0).toString() + "months ago";
        }
        else if(days > 0)
        {
            return days.toFixed(0).toString() + "d ago"
        }
        else if(hours > 0)
        {
            return hours.toFixed(0).toString() + "h ago";
        }
        else
        {
            return minutes.toFixed(0).toString() + "m ago"
        }    
    }

    const findUserName = (userId:string) => {

        const user = userData.filtered("userId == $0", userId)
       
        return user[0].username;
    }

    const afterJoiningDate = (userId:any, dateCreated:any) => {

        const user = userData.filtered("userId == $0", userId)

        const index = stringIds.indexOf(user[0].userId)
        
        const dateJoined = datesJoined[index];

        if(dateCreated > dateJoined)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    return (
        <>
        <FlatList 
            data = {workouts}
            renderItem={({item, index}) => (
                <>
                {
                    (item.workoutId != null && afterJoiningDate(item.userId, item.dateCreated)) &&
                    <View style={styles.border}>
                        <View style={styles.circle}>

                        </View>
                    </View>
                }
                
                <TouchableOpacity key={new BSON.ObjectID().toString()} style={styles.container} onPress={() => {props.onPress(); props.loadData(item.workoutId, item.workoutType)}}>
                    {
                        (item.workoutId != null && afterJoiningDate(item.userId, item.dateCreated)) &&
                        <>
                            <Text style={styles.text}>{findUserName(item.userId)} logged a {item.workoutType?.toLowerCase()} workout {calculateTime(item.dateCreated)}!</Text>
                            <View style={(index != (workouts.length-1)) && styles.smallBorder}></View>
                        </>
                    }
                    
                </TouchableOpacity>
                </>
            )}
            keyExtractor={(item) => item._id.toString()}
        />
    
        </>
    )
}

