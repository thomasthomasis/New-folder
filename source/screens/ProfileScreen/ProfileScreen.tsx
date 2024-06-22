import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity} from 'react-native';
import { useRealm, useUser } from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserStatistics } from '../../schemas/UserStatisticsSchema';
import { shadow } from '../../sharedStyling/Shadow'
import styles from './ProfileScreen.style';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp } from '@react-navigation/native'
import { colors } from '../../sharedStyling/Colors';
import { useFocusEffect } from '@react-navigation/native';

type ProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProfileScreen'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'ProfileScreen'>;
};

export const ProfileScreen = ({ navigation, route}: ProfileScreenProps) => {

  const realm = useRealm();
  const user = useUser();

  const { restrictedView, userId } = route.params;

  const goBack = () => {
    navigation.goBack()
  }

  const goToAppSettings = () => {
    navigation.navigate("AppSettings")
  }

  const [userData, setUserData] = useState<any>(realm.objects("Users").sorted('_id').filtered("userId == $0", userId));

  useFocusEffect(
    React.useCallback(() => {
      let data = realm.objects("Users").sorted('_id').filtered("userId == $0", userId)
      setUserData(data)
    }, [])
  );

  const [imageSource, setImageSource] = useState()

  useEffect(() => {
    //console.log(userData)
    let user = userData[0];
    let profilePicture:string = user.profilePicture as string;

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
        realm.objects(UserStatistics)
        )
    });
    }, [realm, user]);

    return (
      <View style={styles.container}>
       
          <View style={[styles.information, shadow.shadow]}>
            {
              restrictedView &&
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <TouchableOpacity onPress={goBack}>
                    <MaterialCommunityIcons name="arrow-left" color={'lightgray'} size={40} style={{marginLeft: 10,}}/>
                  </TouchableOpacity>
              </View>
            }
            {
              !restrictedView &&
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity onPress={goToAppSettings}>
                  <MaterialCommunityIcons name="cog" color={'lightgray'} size={40} style={{marginRight: 10,}}/>
                </TouchableOpacity>
              </View>
            }
            
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <View style={styles.profilePictureContainer}>
              {
                imageSource &&
                <Image source={imageSource} style={{width: 120, height: 120, borderRadius: 100,}}/>
              }
              {
                !imageSource &&
                <Image source={require("../../assets/3.png")} style={{width: 120, height: 120, borderRadius: 100,}}/>
              }
                  
                </View>
              
              <View style={{display: 'flex', flexDirection: 'column'}}>
                <Text style={styles.name}>{userData[0].firstName as string} {userData[0].lastName as string}</Text>
                <Text style={styles.username}>{userData[0].username as string}</Text>
                <Text style={styles.title}>{userData[0].selectedTitle as string}</Text>
                {
                  userData[0].status != "Healthy" &&
                  <View style={[styles.status, userData[0].status == "Away" && {backgroundColor: colors.orange}, userData[0].status == "Injured" && {backgroundColor: colors.red}]}>
                    <Text style={styles.statusText}>{userData[0].status as string}</Text>
                  </View>
                }
                
                
              </View>
            </View>
              
            
          </View>
          <View>
            <Text>Stats</Text>
          </View>
        
      </View>
    );
}

