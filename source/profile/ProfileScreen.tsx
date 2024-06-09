import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Alert, FlatList, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Input, Button} from '@rneui/base';
import { useQuery, useRealm, useUser } from '@realm/react';
import { Users } from '../schemas/UsersSchema';
import { colors } from '../Colors';
import { Subscription } from 'realm/dist/bundle';
import { WaitForSync } from 'realm';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserStatistics } from '../schemas/UserStatisticsSchema';
import { AccountScreen } from './AccountScreen';
import { shadow } from '../Shadow'

type ProfileScreenProps = {
  restrictedView:boolean,
  user:any,
  closeProfile:any,
}

export const ProfileScreen = (props:ProfileScreenProps) => {

    const realm = useRealm();
    const user = useUser();
  
    let userData = realm.objects("Users").sorted('_id').filtered("userId == $0", props.user);
    let userStats = realm.objects("UserStatistics").filtered("userId == $0", props.user);

    const [showAccount, setShowAccount] = useState<boolean>(false)
    const [imageSource, setImageSource] = useState()

    const [unleveled, setUnleveled] = useState<number>(200);
    const [leveled, setLeveled] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
        getUserStats()
    }, [])

    const delay = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));

    const getUserStats = async () => {

      if(userData && userStats && userStats.length > 0)
      {
        let xp:any = userStats[0].xp;
        let xpTarget:any = userStats[0].xpTarget
        if(xp)
        {
          setLeveled(Number(((xp/xpTarget) * 200).toFixed(0)));
          setUnleveled(200 - leveled);
  
          setLoading(false)
        }
        else
        {
          getUserStats()
        }
      }

      else
      {
        userData = realm.objects("Users").sorted('_id').filtered("userId == $0", props.user);
        userStats = realm.objects("UserStatistics").filtered("userId == $0", props.user);
        await delay(500)
        getUserStats()
      }
      
    }

    const closeAccountScreen = () => {
      setShowAccount(false)
    }

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
            setImageSource(require('./assets/1.png'))
          }
          else if(profilePicture.includes('2'))
          {
            setImageSource(require('./assets/2.png'))
          }
          else if(profilePicture.includes('3'))
          {
            setImageSource(require('./assets/3.png'))
          }
          else if(profilePicture.includes('4'))
          {
            setImageSource(require('./assets/4.png'))
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
      <View style={[styles.container, loading && {justifyContent: 'center'}]}>
        {
          loading &&
          <ActivityIndicator size="large" color="#0000ff" />
        }
        {
          (!showAccount && !loading) &&
          <>
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
                <TouchableOpacity onPress={() => setShowAccount(true)}>
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
                <Image source={require("./assets/3.png")} style={{width: 120, height: 120, borderRadius: 100,}}/>
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
          </>
        }

        {
          showAccount &&
          <AccountScreen onPress={closeAccountScreen}/>
        }
        
        
        
        
        
      </View>
    );
}

const styles = StyleSheet.create({

  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
  }, 

  information: {
    width: '100%',
    height: 200,
    backgroundColor: colors.blue,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  profilePictureContainer: {
    width: 120,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: 'black',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 10,
  },

  name: {
    color: 'black',
    fontSize: 25,
    fontWeight: '800',
  },

  username: {
    color: 'purple',
    fontSize: 20,
    fontWeight: '800',
  },

  title: {
    fontSize: 18,
    color: 'lightgray',
    marginBottom: 10,
  },

  smallBorder: {
    width: '85%',
    height: 2,
    backgroundColor: 'gray',
    marginBottom: 10,
  },

  buttons: {
    width: '80%',
    height: 200,
    display: 'flex',
    flexDirection: 'column',

    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  button: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: 'gray',
    padding: 10,
  },

  profilePictureOptions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    height: 100,
    width: '90%',
    resizeMode: 'contain',
    marginBottom: 10,

  },

  backButton: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 30,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileInfo: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
},

progressContainer: {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',

},

levelProgressContainer: {
    height: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
},

bar: {
    height: 4,
    borderRadius: 5,
},

circle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: colors.blue,
  
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  margin: 5,
},

circleText: {
  fontWeight: '800',
  color: 'white',
},

  
});