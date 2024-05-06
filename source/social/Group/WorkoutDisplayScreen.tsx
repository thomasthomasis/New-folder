import { StyleSheet, TouchableOpacity, View } from "react-native"
import { CardioWorkoutDisplayScreen } from "./CardioWorkoutDisplayScreen"
import { ResistanceWorkoutDisplayScreen } from "./ResistanceWorkoutDisplayScreen"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

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

const styles = StyleSheet.create({
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginLeft: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

