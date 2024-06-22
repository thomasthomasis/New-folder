import React, { StyleSheet, TouchableOpacity, View } from "react-native"
import { CardioWorkoutDisplayScreen } from "../../screens/CardioWorkoutDisplayScreen/CardioWorkoutDisplayScreen"
import { ResistanceWorkoutDisplayScreen } from "../../screens/ResistanceWorkoutDisplayScreen/ResistanceWorkoutDisplayScreen"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import styles from "./WorkoutDisplayScreen.style"

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp } from '@react-navigation/native'
import { useEffect, useState } from "react"
import { CardioWorkout } from "../../schemas/CardioWorkoutSchema"
import { ResistanceWorkout } from "../../schemas/ResistanceWorkoutSchema"
import { useRealm } from "@realm/react"

type WorkoutDisplayScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'WorkoutDisplay'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'WorkoutDisplay'>;
};

export const WorkoutDisplayScreen = ({ navigation, route }:WorkoutDisplayScreenProps) => {

    const realm = useRealm()

    const { data, dataType } = route.params;

    console.log("Data WorkoutDisplay: ", data)
    console.log("Data Type WorkoutDisplay: ", dataType)

    const [workoutObject, setWorkoutObject] = useState<any>(null);

    console.log("Data: ",data)
    console.log("Data Type: ", dataType)

    const getWorkoutObject = (id:string, type:string) => {
        if(type == "Cardio")
        {
            let object = realm.objects(CardioWorkout).filtered("_id == $0", data);
            setWorkoutObject(object)
        }
        else if(type == "Resistance")
        {
            let object = realm.objects(ResistanceWorkout).filtered("_id == $0", data);
            setWorkoutObject(object)
        }
    }

    useEffect(() => {
        getWorkoutObject(data, dataType)
    }, [])
    

    const goBack = () => {
        navigation.goBack()
    }

    return (
        <>
        <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                <MaterialCommunityIcons name="arrow-left" size={40}/>
            </TouchableOpacity>
        </View>
        {
            (workoutObject && dataType == "Cardio") &&
            <CardioWorkoutDisplayScreen data={workoutObject} />
        }
        {
            (workoutObject && dataType == "Resistance") && 
            <ResistanceWorkoutDisplayScreen data={workoutObject} />
        }
        </>
    )
}


