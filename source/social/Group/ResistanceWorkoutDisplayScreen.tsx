import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from "../../Colors";
import { BSON } from "realm";

type ResistanceWorkoutDisplayProps = {
    data:any,   
}


export const ResistanceWorkoutDisplayScreen = (props: ResistanceWorkoutDisplayProps) => {

    const date = new Date(props.data[0].dateCreated)
    const formatedDate = date.toUTCString()

    const totalVolume = props.data[0].totalVolume;
    const totalReps = props.data[0].totalReps;

    const allExercises = props.data[0].allExercises;
    const reps = props.data[0].reps;
    const weights = props.data[0].weights;
    const exercise = props.data[0].exercises;


    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, {color: colors.blue}]}>{formatedDate}</Text>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: 250,}}>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <MaterialCommunityIcons name="weight" color={'black'} size={30}/>
                <Text style={styles.text}>{totalVolume} kg</Text>
            </View>
            <View style={{height: 20, width: 2, backgroundColor: 'gray'}}></View>
            <View style={{display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent: 'center'}}>
                <MaterialCommunityIcons name="counter" color={'black'} size={30}/>
                <Text style={styles.text}>{totalReps} reps</Text>
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
                                JSON.parse(weights[index]).map((item:any, innerIndex:any) => {
                                    return (
                                        <View key={new BSON.ObjectID().toString()} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: 200}}>
                                            <Text>{innerIndex + 1}</Text>
                                            <View style={{height: 20, width: 2, backgroundColor: 'gray'}}></View>
                                            <Text style={{fontSize: 18, fontWeight: '600'}}>{item.value} kg</Text>
                                            <Text style={{fontSize: 18, fontWeight: '600'}}>{JSON.parse(reps[index])[innerIndex].value} reps</Text>
                                        </View>
                                    )
                                })
                            }
                        
                        <View key={new BSON.ObjectID().toString()} style={[styles.smallBorder, {backgroundColor: 'lightgray'}]}></View>
                        </>
                    )
                })
            }
            
        </View>
        
        
      </ScrollView>  
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