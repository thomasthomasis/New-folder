import { useQuery, useRealm, useUser } from "@realm/react"
import { useEffect, useRef, useState } from "react"
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { CardioWorkout } from "../../schemas/CardioWorkoutSchema"
import { ResistanceWorkout } from "../../schemas/ResistanceWorkoutSchema"
import { Groups } from "../../schemas/GroupsSchema"
import { Users } from "../../schemas/UsersSchema"
import { Workouts } from "../../schemas/WorkoutSchema"
import { BSON } from "realm"
import { shadow } from "../../Shadow"
import { colors } from "../../Colors"
import { Modalize } from 'react-native-modalize'
import { WorkoutDisplayScreen } from "./WorkoutDisplayScreen"
import { useNavigation } from "@react-navigation/native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

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
    console.log("Workouts: " + workouts)

    const userData = useQuery(Users).filtered("userId IN $0", stringIds)

    const cardioWorkouts = useQuery(CardioWorkout).filtered("user_id IN $0 AND dateCreated >= $1", stringIds, thirtyDaysAgo)
    const resistanceWorkouts = useQuery(ResistanceWorkout).filtered("userId IN $0 AND dateCreated >= $1", stringIds, thirtyDaysAgo)

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
            realm.objects(CardioWorkout)
            )

            mutableSubs.add(
                realm.objects(ResistanceWorkout)
            )
        });
    }, [realm, user]);


    const getProfilePicture = (path:string) => {
        
        if(path.includes('1'))
        {
          return require('./assets/1.png')
        }
        else if(path.includes('2'))
        {
            return require('./assets/2.png')
        }
        else if(path.includes('3'))
        {
            return require('./assets/3.png')
        }
        else if(path.includes('4'))
        {
            return require('./assets/4.png')
        }
    }

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

    type WorkoutDataProps = {
        workoutId:BSON.ObjectId,
        userId:string,
        onPress:any,
        loadData:any,
    }

    const CardioWorkoutComponent = (props:WorkoutDataProps) => {

        let user = userData.filtered("userId == $0", props.userId)

        let index = stringIds.indexOf(user[0].userId)
        let dateJoined = datesJoined[index]

        let cardioWorkout = cardioWorkouts.filtered("_id == $0 AND dateCreated >= $1", props.workoutId, dateJoined)

        if(cardioWorkout.length == 0)
        {
            return (
                <>
                </>
            )
        }

        const profilePicture: string | undefined = user[0]?.profilePicture;

        let path;
        if(profilePicture)
        {
            path = getProfilePicture(profilePicture)
        }

        return (
            <TouchableOpacity style={[styles.column, shadow.shadow, {backgroundColor: colors.red}]} onPress={() => {props.onPress(); props.loadData(cardioWorkout, "Cardio")}}>
            <View style={styles.row}>
                <View style={{display: 'flex', flexDirection: 'row', width: '75%', alignItems: 'center'}}>
                    {
                        profilePicture && 
                        <Image source={path} style={{height: 70, width: 70, borderRadius: 70, marginRight: 10}}/>
                    }
                    <Text style={styles.text}>{user[0].username}</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', width: '25%', alignItems: 'center'}}>
                    {
                        cardioWorkout.length > 0 &&
                        <>
                        {
                            cardioWorkout[0].dateCreated != null &&
                            <Text style={styles.text}>{calculateTime(cardioWorkout[0].dateCreated)}</Text>
                        }
                        </>
                    }
                </View>
                
            </View>
            <View style={styles.border}></View>
            <View style={styles.row}>
                {
                    cardioWorkout.length > 0 &&
                    <View style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        <Text style={styles.text}>Cardio</Text>
                        <Text style={styles.text}>{cardioWorkout[0].totalTime}min</Text>
                        <Text style={styles.text}>{cardioWorkout[0].totalDistance}km</Text>
                    </View>
                }
               
            </View>
            </TouchableOpacity>
        )
    }

    const ResistanceWorkoutComponent = (props:WorkoutDataProps) => {

        let user = userData.filtered("userId == $0", props.userId)

        let index = stringIds.indexOf(user[0].userId)
        let dateJoined = datesJoined[index]

        let resistanceWorkout = resistanceWorkouts.filtered("_id == $0 AND dateCreated >= $1", props.workoutId, dateJoined)

        if(resistanceWorkout.length == 0)
        {
            return (
                <>
                </>
            )
        }

        const profilePicture: string | undefined = user[0]?.profilePicture;

        let path;
        if(profilePicture)
        {
            path = getProfilePicture(profilePicture)
        }

        return (
            <TouchableOpacity style={[styles.column, shadow.shadow, {backgroundColor: colors.black}]} onPress={() => {props.onPress(); props.loadData(resistanceWorkout, "Resistance")}}>
            <View style={styles.row}>
                <View style={{display: 'flex', flexDirection: 'row', width: '75%', alignItems: 'center'}}>
                    {
                        profilePicture && 
                        <Image source={path} style={{height: 70, width: 70, borderRadius: 70, marginRight: 10}}/>
                    }
                    <Text style={styles.text}>{user[0].username}</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', width: '25%', alignItems: 'center'}}>
                    {
                        resistanceWorkout.length > 0 &&
                        <>
                        {
                            resistanceWorkout[0].dateCreated != null &&
                            <Text style={styles.text}>{calculateTime(resistanceWorkout[0].dateCreated)}</Text>
                        }
                        </>
                    }
                </View>
                
            </View>
            <View style={styles.border}></View>
            <View style={styles.row}>
                {
                    resistanceWorkout.length > 0 &&
                    <View style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        <Text style={styles.text}>Resistance</Text>
                        <Text style={styles.text}>{resistanceWorkout[0].totalVolume}kg</Text>
                        <Text style={styles.text}>{resistanceWorkout[0].totalReps} reps</Text>
                    </View>
                }
               
            </View>
            </TouchableOpacity>
        )
    }

    return (
        <ScrollView>
            {
                workouts.map((item:any) => {
                    return (
                        <View key={new BSON.ObjectID().toString()} style={styles.container}>
                            {
                                item.workoutId != null &&
                                <>
                                    {
                                        item.workoutType == "Cardio" &&
                                        <CardioWorkoutComponent workoutId={item.workoutId} userId={item.userId} onPress={props.onPress} loadData={props.loadData}/>
                                    }
                                    {
                                        item.workoutType == "Resistance" &&
                                        <ResistanceWorkoutComponent workoutId={item.workoutId} userId={item.userId} onPress={props.onPress} loadData={props.loadData}/>
                                    }
                                </>
                                
                            }
                            
                        </View>
                        
                    )
                })
            }
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 20,
    },

    column: {
        display: 'flex',
        flexDirection: 'column',
        width: '90%',
        backgroundColor: 'gray',
        borderRadius: 10,
        padding: 10,
    },

    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },

    text: {
        color: 'white',
        fontSize: 20,
        fontWeight: '800',
    },

    border: {
        marginTop: 10,
        marginBottom: 10,
        width: '90%',
        height: 2,
        backgroundColor: 'black',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
})