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



export const ProfileScreen = () => {

    const realm = useRealm();
    const user = useUser();
  
    const userData = useQuery(Users).sorted('_id').filtered("userId == $0", user.id);
    const userStats = useQuery(UserStatistics).filtered("userId == $0", user.id);

    const [selectingProfilePicture, setSelectingProfilePicture] = useState<boolean>(false)
    const [showAccount, setShowAccount] = useState<boolean>(false)
    const [showStats, setShowStats] = useState<boolean>(false)

    const closeAccountScreen = () => {
      setShowAccount(false)
    }


    const returnToMainMenu = () => {
      setSelectingProfilePicture(false)
    }

    const updateProfilePicture = (imageSource:string) => {
      realm.write(() => {
        userData[0].profilePicture = imageSource;
      })

      returnToMainMenu();
    }

    const signOut = useCallback(() => {
      user?.logOut();
    }, [user]);

    const [imageSource, setImageSource] = useState(require('./assets/1.png'))

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
          !showStats && !showAccount &&
          <View style={styles.container}>
            <View style={styles.information}>
              {
                userData[0].profilePicture == "" &&
                <TouchableOpacity style={styles.profilePicture} onPress={() => {setSelectingProfilePicture(true)}}>
                  <MaterialCommunityIcons name="camera-plus-outline" color={'black'} size={60} />
                </TouchableOpacity>
              }
              {
                userData[0].profilePicture != "" &&
                <View style={styles.profilePictureContainer}>
                  <Image style={styles.profilePictureImage} source={imageSource} />
                </View>
              }
            
            <Text style={styles.name}>{userData[0].firstName} {userData[0].lastName}</Text>
            <Text style={styles.username}>@{userData[0].username}</Text>

            <View style={styles.smallBorder}></View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={() => {setShowAccount(true)}}>
              <Text>Account</Text>
              <MaterialCommunityIcons name="arrow-right-thick" color={'black'} size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setShowStats(true)}>
              <Text>Statistics</Text>
              <MaterialCommunityIcons name="arrow-right-thick" color={'black'} size={30} />
              
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={signOut}>
              <Text>Log Out</Text>
              <MaterialCommunityIcons name="arrow-right-thick" color={'black'} size={30} />
              
            </TouchableOpacity>
          </View>
          </View>
        }

        {
          showAccount &&
          <AccountScreen userData={userData[0]} onPress={closeAccountScreen}/>
        }

        {
          showStats &&
          <View>
            <Text>User Stats</Text>
            <TouchableOpacity onPress={() => setShowStats(false)}>
              <Text>CLOSE SCREEN</Text>
            </TouchableOpacity>
          </View>
        }
        
        
        {
          /*
          selectingProfilePicture &&
          <View style={styles.profilePictureOptions}>
            <TouchableOpacity style={styles.backButton} onPress={returnToMainMenu}>
              <MaterialCommunityIcons name="arrow-left-thick" color={'black'} size={30} />
            </TouchableOpacity>
            <Text style={styles.title}>Select Option</Text>
            <View style={styles.smallBorder}></View>
            <TouchableOpacity style={styles.imageContainer} onPress={() => updateProfilePicture("./assets/1.png")}>
              <Image style={styles.image} source={require("./assets/1.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageContainer} onPress={() => updateProfilePicture("./assets/2.png")}>
              <Image style={styles.image} source={require("./assets/2.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageContainer} onPress={() => updateProfilePicture("./assets/3.png")}>
              <Image style={styles.image} source={require("./assets/3.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageContainer} onPress={() => updateProfilePicture("./assets/4.png")}>
              <Image style={styles.image} source={require("./assets/4.png")} />
            </TouchableOpacity>
          </View>
          */
        }
        
        
        
      </View>
    );
}

const styles = StyleSheet.create({

  container: {
    padding: 10,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  }, 

  information: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profilePicture: {
    width: 170,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: 'gray',
    marginBottom: 10,
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editIcon: {
    position: 'absolute', 
    backgroundColor: 'white',
    borderRadius: 40,
    bottom: 5,
    right: 10,
  },

  profilePictureContainer: {
    width: 170,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: colors.blue,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },

  profilePictureImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',

  },

  name: {
    color: 'black',
    fontSize: 25,
    fontWeight: '800',
  },

  username: {
    fontSize: 18,
    color: 'purple',
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

  title: {
    fontSize: 20,
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