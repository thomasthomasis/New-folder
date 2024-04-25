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
import Modal from 'react-native-modal';
import { useNavigation } from "@react-navigation/native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

type WorkoutDisplayScreenProps = {
    data:any,
    dataType:string | undefined,
}


export const WorkoutDisplayScreen = (props: WorkoutDisplayScreenProps) => {

    return (
        <>
        {
            props.dataType == "Cardio" &&
            <CardioDisplay data={props.data} />
        }
        {
            props.dataType == "Resistance" && 
            <ResistanceDisplay data={props.data} />
        }
        </>
    )
}

type DataProps = {
    data:any
}

const CardioDisplay = (props: DataProps) => {

    console.log(props.data)
    const data = props.data;
    //console.log("Data: ", JSON.parse(data[0].time[0])[0].value)

    return (
        <View>
            <Text>Cardio Workout</Text>
        </View>
    )
}

const ResistanceDisplay = (props: DataProps) => {

    console.log(props.data)
    const data = props.data;
    //console.log("Data: ", JSON.parse(data[0].time[0])[0].value)
    
    return (
        <View>
            <Text>Resistance Workout</Text>
        </View>
    )
}