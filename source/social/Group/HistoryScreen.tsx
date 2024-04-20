import { useQuery, useRealm, useUser } from "@realm/react"
import { useEffect } from "react"
import { Text, View } from "react-native"
import { CardioWorkout } from "../../schemas/CardioWorkoutSchema"
import { ResistanceWorkout } from "../../schemas/ResistanceWorkoutSchema"
import { Groups } from "../../schemas/GroupsSchema"
import { Users } from "../../schemas/UsersSchema"
import { Workouts } from "../../schemas/WorkoutSchema"
import { BSON } from "realm"

type HistoryScreenProps = {
    group:string;
}


export const HistoryScreen = (props: HistoryScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const group = useQuery(Groups).filtered('name == $0', props.group);
    const stringIds = group[0].members.map(member => member)
    //let userStatistics = useQuery(UserStatistics).filtered("userId IN $0", stringIds).sorted("numWorkouts", true)

    const currentDate = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(currentDate.getDate() - 30)

    const workouts = useQuery(Workouts).filtered("userId IN $0 AND dateCreated >= $1", stringIds, thirtyDaysAgo)
    console.log(workouts)

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


    type WorkoutDataProps = {
        workoutId:BSON.ObjectId,
        workoutType:string,
    }

    const WorkoutData = (props: WorkoutDataProps) => {
        let cardioWorkout = cardioWorkouts.filtered("_id == $0", props.workoutId)
        let resistanceWorkout = resistanceWorkouts.filtered("_id == $0", props.workoutId);

        return (
            <View>
               {
                cardioWorkout.length > 0 &&
                <View>
                    <Text>Total Time: {cardioWorkout[0].totalTime}</Text>
                </View>
               }
               {
                resistanceWorkout.length > 0 &&
                <View>
                    <Text>Total Volume: {resistanceWorkout[0].totalVolume}</Text>
                </View>
               }
            </View>
        )
    }

    return (
        <View>
            {
                workouts.map((item:any) => {
                    return (
                        <View key={new BSON.ObjectID().toString()}>
                            {
                                item.workoutId != null &&
                                <WorkoutData key={new BSON.ObjectID().toString()} workoutId={item.workoutId} workoutType={item.workoutType}/>
                            }
                            
                        </View>
                        
                    )
                })
            }
        </View>
        
    )
}