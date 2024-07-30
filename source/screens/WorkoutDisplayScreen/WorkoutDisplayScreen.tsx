import React, { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
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
import { BSON } from "realm"
import { colors } from "../../sharedStyling/Colors"
import { Workouts } from "../../schemas/WorkoutSchema"

type WorkoutDisplayScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'WorkoutDisplay'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'WorkoutDisplay'>;
};

export const WorkoutDisplayScreen = ({ navigation, route }:WorkoutDisplayScreenProps) => {

    const realm = useRealm()

    const { specificWorkoutId, workoutType, generalWorkoutId } = route.params;

    const goBack = () => {
        navigation.goBack()
    }

    const goToEditWorkoutScreen = (workoutId:string) => {
        console.log("navigate to edit workout screen ", workoutId);
    }

    const [specificWorkoutData, setSpecificWorkoutData] = useState<any>(null);
    const [generalWorkoutData, setGeneralWorkoutData] = useState<any>(null);

    const getWorkoutObject = (type:string) => {
        if(type == "Cardio")
        {
            let object = realm.objects(CardioWorkout).filtered("_id == $0", specificWorkoutId);
            setSpecificWorkoutData(object)
        }
        else if(type == "Resistance")
        {
            let object = realm.objects(ResistanceWorkout).filtered("_id == $0", specificWorkoutId);
            setSpecificWorkoutData(object)
            console.log(object)
        }

        let generalWorkoutObject = realm.objects(Workouts).filtered("_id == $0", generalWorkoutId)
        setGeneralWorkoutData(generalWorkoutObject)

    }

    useEffect(() => {
        getWorkoutObject(workoutType)
    }, [])

    const deleteWorkout = (specificWorkoutId:string, generalWorkoutId:string, workoutType:string) => {

        let specificWorkout:any = []

        if(workoutType == "Cardio")
        {
            specificWorkout = realm.objects(CardioWorkout).filtered("_id == $0", specificWorkoutId)
        }
        else if(workoutType == "Resistance")
        {
            specificWorkout = realm.objects(ResistanceWorkout).filtered("_id == $0", specificWorkoutId)
        }

        let generalWorkout = realm.objects(Workouts).filtered("_id == $0", generalWorkoutId)

        console.log(specificWorkout)
        console.log(generalWorkout)

        realm.write(() => {
            realm.delete(generalWorkout);
            realm.delete(specificWorkout)
        });
        
    }

    const handleConfirmDeletion = (specificWorkoutId:string, generalWorkoutId:string, workoutType:string) => {
        // Show confirmation popup
        Alert.alert(
          'Confirm Action',
          'Are you sure you want to delete this workout?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {goBack(); deleteWorkout(specificWorkoutId, generalWorkoutId, workoutType); },
            },
          ],
          { cancelable: false }
        );
      };
   

    return (
        <>
        <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10, paddingLeft: 10,}}>
            <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                <MaterialCommunityIcons name="arrow-left" size={40} color={colors.text}/>
            </TouchableOpacity>
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => goToEditWorkoutScreen(specificWorkoutId)}>
                    <MaterialCommunityIcons name="pencil-outline" size={40} color={colors.text}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleConfirmDeletion(generalWorkoutData[0].workoutId, generalWorkoutData[0]._id, generalWorkoutData[0].workoutType)}>
                    <MaterialCommunityIcons name="delete-outline" size={40} color={colors.text}/>
                </TouchableOpacity>
            </View>
           
        </View>
        {
            !specificWorkoutData &&
            <Text>No workout data</Text>
        }
        {
            (specificWorkoutData && workoutType == "Cardio") &&
            <CardioWorkoutDisplayScreen data={specificWorkoutData} />
            
        }
        {
            (specificWorkoutData && workoutType == "Resistance") && 
            <ResistanceWorkoutDisplayScreen data={specificWorkoutData} />
        }
        </>
    )
}


