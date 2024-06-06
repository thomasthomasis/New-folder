import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions, Alert} from 'react-native';
import {colors} from './Colors';
import { LogWorkoutCardio } from './components/LogWorkoutCardio'; 
import { LogWorkoutResistance } from './components/LogWorkoutResistance';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SubmitCompletion } from './SubmitCompletion';
import { shadow } from './Shadow';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


export function LogWorkoutScreen() {

  const [showGrid, setShowGrid] = useState<boolean>(true);
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
  }


  const clearWorkout = () => {
    setShowGrid(true)
    setShowSection('')
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
    setShowGrid(true)
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
    <View style={styles.viewWrapper}>

      { showResults &&
        <SubmitCompletion onPress={closeResults} levelUp={levelUp} gainedXp={gainedXp}/>
      }

      { showGrid &&
        <View style={[styles.container, {height: screenHeight - 110}]}>  
          <TouchableOpacity style={[styles.gridOption, {backgroundColor: '#ED97A5'}, shadow.shadow]} onPress={() => calcShowSection("Cardio")}>
            <View style={[styles.circle, {backgroundColor: colors.red}]}>
              <Image style={styles.image} source={require('./resources/Heart.png')} />
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
        currentWorkout.length > 0 &&
        <TouchableOpacity style={styles.continueButton} onPress={() => continueWorkout(currentWorkoutType)}>
          <Text style={styles.buttonText}>Continue Workout</Text>
        </TouchableOpacity>
      }

  
      

      <ScrollView>
        { showSection == "Cardio" &&
          <LogWorkoutCardio onPress={onSubmit} closeWorkout={clearWorkout} continuingWorkout={continuingWorkout}/>
        }
        { showSection == "Resistance" &&
          <LogWorkoutResistance onPress={onSubmit} closeWorkout={clearWorkout} continuingWorkout={continuingWorkout}/>
        }
        
        
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
    viewWrapper: {
      
    },

   
    container: {
      width: '97.5%',
      
      borderRadius: 20,
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingTop: 10,

      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },

    plus: {
      position: 'absolute',
      color: 'black',

      bottom: 0,
      right: 5,

      fontSize: 40,
    },

    gridOption: {
      width: '48%',
      aspectRatio: 1/1,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    circle: {
      width: '70%',
      aspectRatio: 1/1,
      borderRadius: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    image: {
      width: '70%',
      height: '70%',
      resizeMode: 'contain',
    },

    cardioContainer: {
      width: '97%',
      backgroundColor: colors.red,
      borderRadius: 10,
      padding: 10,
    },

    form: {
      width: 300,
      height: 400,
    },

    button: {
      width: 170,
      backgroundColor: 'lightgray',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },

    continueButton: {
      width: 190,
      backgroundColor: colors.blue,
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      marginRight: 'auto',
      marginLeft: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    buttonText: {
      fontWeight: '800',
      color: 'white',
      fontSize: 20,
    },

    

    
    
  });