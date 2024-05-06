import { CardioWorkoutDisplayScreen } from "./CardioWorkoutDisplayScreen"
import { ResistanceWorkoutDisplayScreen } from "./ResistanceWorkoutDisplayScreen"

type WorkoutDisplayScreenProps = {
    data:any,
    dataType:string | undefined,
}


export const WorkoutDisplayScreen = (props: WorkoutDisplayScreenProps) => {

    return (
        <>
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

