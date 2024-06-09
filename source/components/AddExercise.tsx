import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Alert, FlatList, ScrollView, Pressable, StyleSheet, Button, Switch, Text, View, TouchableOpacity, TextInput, Dimensions, Modal, TouchableWithoutFeedback, Keyboard} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import {colors} from '../Colors';
import {BSON} from 'realm';
import {useUser, useRealm, useQuery} from '@realm/react';
import { ResistanceWorkout } from '../schemas/ResistanceWorkoutSchema';
import { Workouts } from '../schemas/WorkoutSchema';
import { UserStatistics } from '../schemas/UserStatisticsSchema';
import { ExtraExercises } from '../schemas/ExtraExercisesSchema';
import { shadow } from '../Shadow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Collapsible from 'react-native-collapsible';

type AddExerciseProps = {
  addExercise:any,
  exit:any
}

export const AddExercise = (props:AddExerciseProps) => {

    const [modalInput, setModalInput] = useState<string>('')

    const muscles = ["Neck", "Back", "Shoulders", "Chest", "Biceps", "Triceps", "Forearms", "Core", "Quads", "Glutes", "Hip Flexors", "Groin", "Hamstrings", "Calves", "Other"]
    const [boxChecked, setBoxChecked] = useState<boolean[]>([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])

    const [selectedMuscles, setSelectedMuscles] = useState<string>('')

    const addSelectedMuscle = (muscle:string, index:any) => {
        console.log(muscle, index)
    
        let musclesBefore = selectedMuscles;
    
        if(!musclesBefore.includes(muscle))
        {
          const newMuscles = musclesBefore + (muscle + ",")
          setSelectedMuscles(newMuscles)
    
          console.log(newMuscles)
        }
        else
        {
          const newMuscles = musclesBefore.replace(muscle + ",", "")
          setSelectedMuscles(newMuscles)
    
          console.log(newMuscles)
        }
        
        const newCheckedBoxes = boxChecked;
        newCheckedBoxes[index] = !newCheckedBoxes[index];
        setBoxChecked(newCheckedBoxes)
        
      }
      
    const submit = () => {
        if(modalInput.length == 0)
        {
            Alert.alert(
                'No Name',
                'Make sure you have a name entered!',
                
              );
        }
        else
        {
            props.addExercise(modalInput, selectedMuscles)
            props.exit()
        }
    }

    return (
        <>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: colors.black, marginBottom: 10,}}>
            <TouchableOpacity onPress={props.exit}>
                <MaterialCommunityIcons name="arrow-left" color={'white'} size={40} style={{marginLeft: 10, backgroundColor: 'black', borderRadius: 40, padding: 5,}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={submit}>
                <MaterialCommunityIcons name="check" color={'white'} size={40} style={{marginRight: 10, backgroundColor: 'black', borderRadius: 40, padding: 5,}}/>
            </TouchableOpacity>
        </View>

        <View style={{marginBottom: 20,}}>
            <Text style={{ fontSize: 18, marginBottom: 10, textAlign: 'center', fontWeight: '800' }}>Enter Exercise Name:</Text>
            <TextInput
            style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10, marginRight: 'auto', marginLeft: 'auto' }}
            placeholder="Enter name..."
            value={modalInput}
            onChangeText={setModalInput}
            />
        <View style={[styles.borderBottom, {width: '100%', backgroundColor: 'gray', height: 3,}]}></View>

        <Text style={{ fontSize: 18, marginBottom: 5, fontWeight: '900', textAlign: 'center', }}>Select Muscles Involved</Text>
        <View style={styles.borderBottom}></View>
        {
            muscles.map((item, index) => (
                <View key={index} style={styles.muscleChoice}>
                <TouchableOpacity style={[styles.checkbox, boxChecked[index] && {backgroundColor: colors.green}]} onPress={() => addSelectedMuscle(item, index)}>
                    <Text style={styles.checkBoxText}>{item}</Text>
                </TouchableOpacity>
                </View>
                
            ))
        }
        </View>
        </>
    )
}

const styles = StyleSheet.create({

    muscleChoice: {
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 5,
        marginTop: 5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    
        flexDirection: 'row',
      },
    
      checkbox: {
        backgroundColor: 'gray',
        height: 50,
        width: 150,
        borderRadius: 10,
        padding: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },

      checkBoxText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 20,
      },
    
      borderBottom: {
        width: '90%',
        height: 2,
        backgroundColor: 'lightgray',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 10,
      }
})