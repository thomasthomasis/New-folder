import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from "../../Colors";
import { BSON } from "realm";

type CardioWorkoutDisplayScreenProps = {
    data:any,   
}


export const CardioWorkoutDisplayScreen = (props: CardioWorkoutDisplayScreenProps) => {

    const date = new Date(props.data[0].dateCreated)
    const formatedDate = date.toUTCString()

    const totalTime = props.data[0].totalTime;
    const totalDistance = props.data[0].totalDistance;

    const allExercises = props.data[0].allExercises;
    const distance = props.data[0].distance;
    const time = props.data[0].time;
    const exercise = props.data[0].exercise;
    const extraNotes = props.data[0].extraNotes;

    //console.log(JSON.parse(distance[0])[0])

    console.log(JSON.parse(time[0]))



    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, {color: colors.blue}]}>{formatedDate}</Text>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: 250,}}>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <MaterialCommunityIcons name="clock-time-five-outline" color={'black'} size={30}/>
                <Text style={styles.text}>{totalTime} min</Text>
            </View>
            <View style={{height: 20, width: 2, backgroundColor: 'gray'}}></View>
            <View style={{display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent: 'center'}}>
                <MaterialCommunityIcons name="shoe-print" color={'black'} size={30}/>
                <Text style={styles.text}>{totalDistance}km</Text>
            </View>
        </View>
        <View style={styles.smallBorder}></View>
        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            {
                allExercises.map((item:any, index:any) => {
                    return (
                        <>
                            <Text key={new BSON.ObjectID().toString()} style={{fontSize: 20, fontWeight: '800', marginBottom: 10, color: colors.blue,}}>{item}</Text>
                            {
                                JSON.parse(time[index]).map((item:any, innerIndex:any) => {
                                    return (
                                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: 200}}>
                                            <Text>{innerIndex + 1}</Text>
                                            <View style={{height: 20, width: 2, backgroundColor: 'gray'}}></View>
                                            <Text style={{fontSize: 18, fontWeight: '600'}}>{item.value} min</Text>
                                            <Text style={{fontSize: 18, fontWeight: '600'}}>{JSON.parse(distance[index])[innerIndex].value} km</Text>
                                        </View>
                                    )
                                })
                            }
                        
                        {
                            ((JSON.parse(extraNotes[index]).value).length > 0) &&
                            <Text style={{fontSize: 20, fontWeight: '700', color: colors.green, marginTop: 10,}}>"{JSON.parse(extraNotes[index]).value}"</Text>
                        }
                        
                        <View style={[styles.smallBorder, {backgroundColor: 'lightgray'}]}></View>
                        </>
                    )
                })
            }
            
        </View>
        
        
      </ScrollView>  
    )
}

type WorkoutLayoutProps = {
    time:any,
    distance:any,   
}

const WorkoutLayout = (props: WorkoutLayoutProps) => {

    console.log(props.time[1].value)

    console.log(props.distance)

    const emptyArray = [];
    for(let i = 0; i < props.time.length; i++)
    {
        emptyArray.push("")
    }

    return (
        <View>
        {
            props.distance.map((item:any, index:any) => {
                <Text>{item}</Text>
            })
        }
        </View>
    )
}

const styles = StyleSheet.create({
    
    container: {
        display: 'flex',
        alignItems: 'center',   
    },

    title: {
        fontWeight: '800',
        marginTop: 20,
    },

    text: {
        fontWeight: '600',
        fontSize: 20,
    },

    smallBorder: {
        height: 2,
        width: '75%',
        backgroundColor: 'gray',
        marginTop: 10,
        marginBottom: 10,
    }
})