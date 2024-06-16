import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Image, Dimensions, Alert} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import { LogWorkoutCardioScreen } from '../LogWorkoutCardioScreen/LogWorkoutCardioScreen'; 
import { LogWorkoutResistanceScreen } from '../LogWorkoutResistanceScreen/LogWorkoutResistanceScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SubmitCompletion } from '../SubmitCompletionScreen/SubmitCompletion';
import { shadow } from '../../sharedStyling/Shadow';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './LogWorkoutScreen.styles';
import Modal from 'react-native-modal';
import { useRealm, useUser } from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import { useNavigation } from '@react-navigation/native';


export function LogWorkoutScreen() {

  const realm = useRealm()
  const user = useUser()

  const navigation = useNavigation()

  let userData = realm.objects("Users").sorted('_id').filtered("userId == $0", user.id);

  const [imageSource, setImageSource] = useState()

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

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const closeModal = () => {
    setModalVisible(false)
  }

  useEffect(() => {
    //console.log(userData)
    let profilePicture:string = userData[0].profilePicture as string;

    if(profilePicture)
    {
      console.log(profilePicture)
      if(profilePicture.includes('1'))
        {
          setImageSource(require('../../assets/1.png'))
        }
        else if(profilePicture.includes('2'))
        {
          setImageSource(require('../../assets/2.png'))
        }
        else if(profilePicture.includes('3'))
        {
          setImageSource(require('../../assets/3.png'))
        }
        else if(profilePicture.includes('4'))
        {
          setImageSource(require('../../assets/4.png'))
        }
    }
      
    }, [userData])

    useEffect(() => {
      realm.subscriptions.update(mutableSubs => {
          mutableSubs.add(
          realm.objects(Users),
          );
      });
      }, [realm, user]);

    const screenHeight = Dimensions.get('window').height;

  return (
    <View>

        <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10,}}>
            <Text style={styles.headerText}>UltiTracker</Text>
            <View style={[{marginRight: 10,}, shadow.shadow]}>
              <Image source={require("../../assets/3.png")} style={styles.headerImage}/>
            </View>
        </View>

        <View style={[styles.container, {height: screenHeight - 50}]}>

          <View style={[styles.containerPieChart, shadow.shadow]}>
            <Text>Pie Chart</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.containerBarChart, shadow.shadow]}>
              <Text>Bar charts</Text>
            </View>

            <TouchableOpacity style={[styles.logWorkoutButton, shadow.shadow]} onPress={() => {setModalVisible(true)}}>
              <MaterialCommunityIcons name="plus" color={'white'} size={50}/>
            </TouchableOpacity>
          </View>
          
        </View>

      {
        (currentWorkout.length > 0) &&
        <View style={[styles.container, {height: screenHeight - 50, alignItems: 'center'}]}>
          <TouchableOpacity style={styles.continueButton} onPress={() => {console.log("continue workout")}}>
            <Text style={styles.buttonText}>Continue Workout</Text>
          </TouchableOpacity>
        </View>
      }

      <Modal
          isVisible={modalVisible}
          swipeDirection={['down']}
          onSwipeComplete={closeModal}
          onBackdropPress={closeModal}
          style={styles.modalView}
      >
          <View style={styles.modalContent}>
          <View style={styles.containerModal}> 
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Log a Workout</Text> 
            </View>
            <View style={styles.rowModal}>
              <TouchableOpacity style={[styles.gridOption, {backgroundColor: '#ED97A5'}, shadow.shadow]} onPress={() => {closeModal(); navigation.navigate("LogWorkoutCardio" as never)}}>
                <View style={[styles.circle, {backgroundColor: colors.red}]}>
                  <Image style={styles.image} source={require('../../assets/Heart.png')} />
                </View>
                <Text style={styles.plus}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gridOption, {backgroundColor: '#afb0b2'}, shadow.shadow]} onPress={() => {closeModal(); navigation.navigate("LogWorkoutResistance" as never)}}>
                <View style={[styles.circle, {backgroundColor: colors.black}]}>
                  <MaterialCommunityIcons name="weight" color={'black'} size={80}/>
                </View>
                <Text style={styles.plus}>+</Text>
              </TouchableOpacity>
            </View>
            
          </View>
              
          </View>
      </Modal>

    </View>
  )
}