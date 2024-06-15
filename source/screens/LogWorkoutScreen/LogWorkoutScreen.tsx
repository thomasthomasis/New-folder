import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Image, Dimensions, Alert} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import { LogWorkoutCardioScreen } from '../LogWorkoutCardioScreen/LogWorkoutCardio'; 
import { LogWorkoutResistanceScreen } from '../LogWorkoutResistanceScreen/LogWorkoutResistanceScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SubmitCompletion } from '../SubmitCompletionScreen/SubmitCompletion';
import { shadow } from '../../sharedStyling/Shadow';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './LogWorkoutScreen.styles';


export function LogWorkoutScreen() {

  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(true)
  const [showSection, setShowSection] = useState<string>('');

  const calcShowSection = (workoutType:string) => {

    if(currentWorkout.length == 0)
    {
      setShowSection(workoutType)
      setShowGrid(false)
    }

    else
    {
      handleConfirm(workoutType)
    }
  }

  const continueWorkout = (workoutType:string) => {
    setCurrentWorkout([]); 
    setShowSection(workoutType); 
    setShowGrid(false); 
    setContinuingWorkout(true)
    setShowButton(false)
  }


  const clearWorkout = () => {
    setShowGrid(false)
    setShowSection('')
    setContinuingWorkout(false)
    setShowButton(true)
  }

  const onSubmit = (levelUp:boolean, gainedXp:number) => {
    setShowGrid(false)
    setShowSection('')

    setLevelUp(levelUp)
    setGainedXp(gainedXp)

    setShowResults(true)
  }

  const closeResults = () => {
    setShowResults(false)
    setShowGrid(false)
    setShowButton(true)
  }
  

  const [showResults, setShowResults] = useState<boolean>(false)
  const [gainedXp, setGainedXp] = useState<number>(0)
  const [levelUp, setLevelUp] = useState<boolean>(false)

  const [currentWorkout, setCurrentWorkout] = useState<any>([]);
  const [currentWorkoutType, setCurrentWorkoutType] = useState<string>('')
  const [continuingWorkout, setContinuingWorkout] = useState<boolean>(false)

  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
  })

  const loadCurrentWorkout = () => {
    storage.load({
      key: 'currentWorkout'
    })
    .then(ret => {setCurrentWorkout(ret.forms); console.log(ret.forms.length)})
    .catch(err => {
      console.warn(err.message);
    })

    storage.load({
      key: 'workoutType'
    })
    .then(ret => {setCurrentWorkoutType(ret.workoutType)})
    .catch(err => {
      console.warn(err.message);
    })
  }

  useEffect(() => {
    loadCurrentWorkout()
  }, [])

  const screenHeight = Dimensions.get('window').height;

  const handleConfirm = (workoutType:string) => {
    // Show confirmation popup
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to delete your previous workout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {setCurrentWorkout([]); setShowSection(workoutType); setShowGrid(false); setContinuingWorkout(false)},
        },
      ],
      { cancelable: false }
    );
  };
  

  return (
    <View>

      { showResults &&
        <SubmitCompletion onPress={closeResults} levelUp={levelUp} gainedXp={gainedXp}/>
      }

      {
        (!showGrid && showButton && currentWorkout.length == 0) &&
        <View style={[styles.container, {height: screenHeight - 50, alignItems: 'center'}]}>
          <TouchableOpacity style={styles.logWorkoutButton} onPress={() => {setShowGrid(true); setShowButton(false)}}>
            <Text style={styles.logWorkoutButtonText}>Log Workout</Text>
          </TouchableOpacity>
        </View>
      }

      { (showGrid && !showButton && currentWorkout.length == 0) &&
        <View style={[styles.container, {height: screenHeight - 110}]}>  
          <TouchableOpacity style={[styles.gridOption, {backgroundColor: '#ED97A5'}, shadow.shadow]} onPress={() => calcShowSection("Cardio")}>
            <View style={[styles.circle, {backgroundColor: colors.red}]}>
              <Image style={styles.image} source={require('../../assets/Heart.png')} />
            </View>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridOption, {backgroundColor: '#afb0b2'}, shadow.shadow]} onPress={() => calcShowSection("Resistance")}>
            <View style={[styles.circle, {backgroundColor: colors.black}]}>
              <MaterialCommunityIcons name="weight" color={'black'} size={80}/>
            </View>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>
      }

      {
        (currentWorkout.length > 0 && showSection == "") &&
        <View style={[styles.container, {height: screenHeight - 50, alignItems: 'center'}]}>
          <TouchableOpacity style={styles.continueButton} onPress={() => continueWorkout(currentWorkoutType)}>
            <Text style={styles.buttonText}>Continue Workout</Text>
          </TouchableOpacity>
        </View>
      }

  
      

      <ScrollView>
        { showSection == "Cardio" &&
          <LogWorkoutCardioScreen onPress={onSubmit} closeWorkout={clearWorkout} continuingWorkout={continuingWorkout}/>
        }
        { showSection == "Resistance" &&
          <LogWorkoutResistanceScreen onPress={onSubmit} closeWorkout={clearWorkout} continuingWorkout={continuingWorkout}/>
        }
        
        
      </ScrollView>

    </View>
  )
}