import React, { StyleSheet, TouchableOpacity, View } from "react-native"
import { CardioWorkoutDisplayScreen } from "../../screens/CardioWorkoutDisplayScreen/CardioWorkoutDisplayScreen"
import { ResistanceWorkoutDisplayScreen } from "../../screens/ResistanceWorkoutDisplayScreen/ResistanceWorkoutDisplayScreen"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import styles from "./WorkoutDisplayScreen.style"

type WorkoutDisplayScreenProps = {
    data:any,
    dataType:string | undefined,
    onPress: any,
}


export const WorkoutDisplayScreen = (props: WorkoutDisplayScreenProps) => {

    return (
        <>
        <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={() => props.onPress()} style={styles.closeButton}>
                <MaterialCommunityIcons name="arrow-left" size={40}/>
            </TouchableOpacity>
        </View>
        {
            props.dataType == "Cardio" &&
            <CardioWorkoutDisplayScreen data={props.data} />
        }
        {
            props.dataType == "Resistance" && 
            <ResistanceWorkoutDisplayScreen data={props.data} />
        }
        </>
    )
}


