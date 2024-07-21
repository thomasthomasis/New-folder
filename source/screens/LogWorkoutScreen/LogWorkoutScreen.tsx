import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Image, Dimensions, Alert, ActivityIndicator} from 'react-native';
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
import { BarChart, PieChart } from 'react-native-gifted-charts';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { BSON } from 'realm';
import { UserStatistics } from '../../schemas/UserStatisticsSchema';
import { CardioWorkout } from '../../schemas/CardioWorkoutSchema';
import { ResistanceWorkout } from '../../schemas/ResistanceWorkoutSchema';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

type LogWorkoutProps = {
    navigation: StackNavigationProp<RootStackParamList, 'LogWorkout'>;
}

export const LogWorkoutScreen = ({ navigation }: LogWorkoutProps) => {

  const realm = useRealm()
  const user = useUser()
  const isFocused = useIsFocused()

  const logResitanceWorkout = () => {
    navigation.navigate("LogWorkoutResistance", {continuingWorkout: false})
  }

  const logCardioWorkout = () => {
    navigation.navigate("LogWorkoutCardio", { continuingWorkout: false})
  }

  const goToProfileSettings = () => {
    navigation.navigate("ProfileSettings")
  }

  let userData = realm.objects("Users").sorted('_id').filtered("userId == $0", user.id);

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [imageSource, setImageSource] = useState(require("../../assets/3.png"))

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

  //set profile picture
  useEffect(() => {
    //console.log(userData)
    let profilePicture;
    if(userData[0])
      {
        profilePicture = userData[0].profilePicture as string;
      }
    

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

          mutableSubs.add(
            realm.objects(UserStatistics),
            );

          mutableSubs.add(
            realm.objects(CardioWorkout),
            );

          mutableSubs.add(
            realm.objects(ResistanceWorkout),
            );
      });
      }, [realm, user]);

    const screenHeight = Dimensions.get('window').height;

  return (
    <>
    {
      isLoading ? (
        <ActivityIndicator size="large" color={colors.blue}/>
      ) :
      (
        <>

      

        <View style={styles.header}>
            <Text style={styles.headerText}>UltiTracker</Text>
            <View style={{marginRight: 15, display: 'flex', flexDirection: 'row',  alignItems: 'center'}} >
              <MaterialCommunityIcons name={"bell-outline"} size={35}/>
              <TouchableOpacity onPress={() => goToProfileSettings()}>
                <Image source={imageSource} style={styles.headerImage}/>
              </TouchableOpacity>
            </View>
            
        </View>

        <TouchableOpacity style={[{position: 'absolute', bottom: 20, right: 20, backgroundColor: colors.blue, width: 70, height: 70, borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2}, shadow.shadow]} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name={"plus"} size={50} color={'white'}/>
        </TouchableOpacity>

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
            {
              currentWorkout &&
              <View>
                <TouchableOpacity style={styles.continueButton} onPress={() => {console.log("continue workout")}}>
                  <Text style={styles.buttonText}>Continue Workout</Text>
                </TouchableOpacity>
              </View>
            }
            <View style={styles.rowModal}>
              <TouchableOpacity style={[styles.gridOption, {backgroundColor: '#ED97A5'}, shadow.shadow]} onPress={() => {closeModal(); logCardioWorkout()}}>
                <View style={[styles.circle, {backgroundColor: colors.red}]}>
                  <Image style={styles.image} source={require('../../assets/Heart.png')} />
                </View>
                <Text style={styles.plus}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gridOption, {backgroundColor: '#afb0b2'}, shadow.shadow]} onPress={() => {closeModal(); logResitanceWorkout()}}>
                <View style={[styles.circle, {backgroundColor: colors.black}]}>
                  <MaterialCommunityIcons name="weight" color={'black'} size={80}/>
                </View>
                <Text style={styles.plus}>+</Text>
              </TouchableOpacity>
            </View>
            
          </View>
              
          </View>
      </Modal>

    </>
      )
    }
    </>
    
  
  )
}