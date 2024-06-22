import React, { useCallback, useState } from 'react';
import {Alert, Text, View, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './AddExerciseScreen.style';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { useRealm, useUser } from '@realm/react';
import { ExtraExercises } from '../../schemas/ExtraExercisesSchema';
import { BSON } from 'realm';

type AddExerciseProps = {
    navigation: StackNavigationProp<RootStackParamList, 'AddExercise'>;
}

export const AddExerciseScreen = ({ navigation }: AddExerciseProps) => {

    const realm = useRealm()
    const user = useUser()

    const goBack = () => {
        navigation.goBack()
    }   

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

      const addExercise = useCallback(
        (input:string, selectedMuscles:string) => {
    
          realm.write(() => {
            return new ExtraExercises(realm, {
              _id: new BSON.ObjectID,
              extraInformation: selectedMuscles,
              type: "Resistance",
              name: input.trim(),
              userId: user.id,
              exerciseId: new BSON.ObjectID().toString(),
            })
          })
        }, [realm, user])
      
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
            addExercise(modalInput, selectedMuscles)
            navigation.goBack()
        }
    }

    return (
        <ScrollView>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: colors.black, marginBottom: 10,}}>
            <TouchableOpacity onPress={goBack}>
                <MaterialCommunityIcons name="arrow-left" color={'white'} size={40} style={{marginLeft: 10, backgroundColor: 'black', borderRadius: 40, padding: 5,}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={submit}>
                <MaterialCommunityIcons name="check" color={'white'} size={40} style={{marginRight: 10, backgroundColor: 'black', borderRadius: 40, padding: 5,}}/>
            </TouchableOpacity>
        </View>

        <View style={{marginBottom: 100,}}>
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
        </ScrollView>
    )
}