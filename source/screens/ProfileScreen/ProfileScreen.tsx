import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity} from 'react-native';
import { useRealm, useUser } from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserStatistics } from '../../schemas/UserStatisticsSchema';
import { shadow } from '../../sharedStyling/Shadow'
import styles from './ProfileScreen.style';
import { useNavigation } from '@react-navigation/native';

type ProfileScreenProps = {
  restrictedView:boolean,
  user:any,
  closeProfile:any,
}

export const ProfileScreen = (props:ProfileScreenProps) => {

  const realm = useRealm();
  const user = useUser();

  const navigation = useNavigation()


  let userData = realm.objects("Users").sorted('_id').filtered("userId == $0", props.user);

  const [imageSource, setImageSource] = useState()

  const signOut = useCallback(() => {
    user?.logOut();
  }, [user]);

  const handleConfirm = () => {
    // Show confirmation popup
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to signout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => signOut(),
        },
      ],
      { cancelable: false }
    );
  };

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
              props.restrictedView &&
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <TouchableOpacity onPress={props.closeProfile}>
                    <MaterialCommunityIcons name="arrow-left" color={'lightgray'} size={40} style={{marginLeft: 10,}}/>
                  </TouchableOpacity>
              </View>
            }
            {
              !props.restrictedView &&
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity onPress={() => navigation.navigate("Account" as never)}>
                  <MaterialCommunityIcons name="cog" color={'lightgray'} size={40} style={{marginRight: 10,}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm}>
                  <MaterialCommunityIcons name="logout" color={'lightgray'} size={40} style={{marginRight: 10,}}/>
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
              </View>
            </View>
              
            
          </View>
          <View>
            <Text>Stats</Text>
          </View>
        
      </View>
    );
}

