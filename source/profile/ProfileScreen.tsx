import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Alert, FlatList, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, Image, TouchableOpacity} from 'react-native';
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



export const ProfileScreen = () => {

    const realm = useRealm();
    const user = useUser();
  
    const userData = useQuery(Users).sorted('_id').filtered("userId == $0", user.id);
    const userStats = useQuery(UserStatistics).filtered("userId == $0", user.id);

    const [showAccount, setShowAccount] = useState<boolean>(false)
    const [imageSource, setImageSource] = useState(require('./assets/1.png'))

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
      if(userData[0].profilePicture?.includes('1'))
      {
        setImageSource(require('./assets/1.png'))
      }
      else if(userData[0].profilePicture?.includes('2'))
      {
        setImageSource(require('./assets/2.png'))
      }
      else if(userData[0].profilePicture?.includes('3'))
      {
        setImageSource(require('./assets/3.png'))
      }
      else if(userData[0].profilePicture?.includes('4'))
      {
        setImageSource(require('./assets/4.png'))
      }
    }, [userData])


    const [unleveled, setUnleveled] = useState<number>(200);
    const [leveled, setLeveled] = useState<number>(0);
    
    useEffect(() => {
        let xp = userStats[0].xp;

        setLeveled(Number(((xp/userStats[0].xpTarget) * 200).toFixed(0)));
        setUnleveled(200 - leveled);

    }, [userStats])

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
        {
          !showAccount &&
          <>
          <View style={[styles.information, shadow.shadow]}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
              <TouchableOpacity onPress={() => setShowAccount(true)}>
                <MaterialCommunityIcons name="cog" color={'lightgray'} size={40} style={{marginRight: 10,}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm}>
                <MaterialCommunityIcons name="logout" color={'lightgray'} size={40} style={{marginRight: 10,}}/>
              </TouchableOpacity>
              
            </View>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <View style={styles.profilePictureContainer}>
                  <Image source={imageSource} style={{width: 120, height: 120, borderRadius: 100,}}/>
                </View>
              
              <View style={{display: 'flex', flexDirection: 'column'}}>
                <Text style={styles.name}>{userData[0].firstName} {userData[0].lastName}</Text>
                <Text style={styles.username}>{userData[0].username}</Text>
                <Text style={styles.title}>Newbie</Text>
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