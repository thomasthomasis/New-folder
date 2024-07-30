import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, FlatList} from 'react-native';
import { useRealm, useUser } from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { shadow } from '../../sharedStyling/Shadow'
import styles from './ProfileScreen.style';
import Modal from 'react-native-modal';

import { CardStyleInterpolators, StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp } from '@react-navigation/native'
import { colors } from '../../sharedStyling/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { Workouts } from '../../schemas/WorkoutSchema';
import { Groups } from '../../schemas/GroupsSchema';

type ProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProfileScreen'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'ProfileScreen'>;
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

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

  const goToProfileSettingsScreen = () => {
    navigation.navigate("ProfileSettings")
  }

  const goToGroupScreen = (group:string) => {
    navigation.navigate("Group", { group: group })
  }

  const goToCreateGroupScreen = (isClub:boolean) => {
    navigation.navigate("CreateGroup", { isClub: isClub })
  }

  const goToJoinGroupScreen = () => {
    navigation.navigate("JoinGroup")
  }

  const goToEditingGroupScreen = (group:string) => {
    navigation.navigate("GroupSettings", { group: group })
  }

  const goToEditingGroupMembersScreen = (group:string) => {
    navigation.navigate("GroupMembersSettings", { group: group })
  }

  const [userData, setUserData] = useState<any>(realm.objects("Users").sorted('_id').filtered("userId == $0", userId));
  const [groups, setGroups] = useState<any>(realm.objects(Groups).filtered('ANY members == $0', userId))
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [showingModalOptions, setShowingModalOptions] = useState<boolean>(false)
  const [showingModalStatus, setShowingModalStatus] = useState<boolean>(false)
  const [imageSource, setImageSource] = useState()
  const [loading, setLoading] = useState<boolean>(true)
  const [userStatus, setUserStatus] = useState<any>("Healthy")

  useEffect(() => {
    let userStatus = userData[0].status;

    setUserStatus(userStatus);
  }, [userData])

  const onClose = () => {
    setShowingModalStatus(false)
    setShowingModalOptions(false)
  }

  const setNewStatus = (userId:string, status:string) => {

    let user = realm.objects("Users").sorted('_id').filtered("userId == $0", userId);

    realm.write(() => {
        user[0].status = status;
    })

    setUserStatus(status)
  }

  const getGroupName = (groupId:string) => {
    const group = realm.objects(Groups).filtered("groupId == $0", groupId)
    
    if(group.length > 0)
    {
      return group[0].name
    }
    return "";
  }

  const checkIfOwner = () => {

    if(selectedGroup == "")
    {
      return false;
    }

    const group = groups.filtered("groupId == $0", selectedGroup)

    if(user.id == group[0].owner)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  const leaveGroup = (groupId:string) => {

    console.log(groupId)

    const group = groups.filtered("groupId == $0", groupId)
    const stringIds = group[0].members.map(({member}:any) => member)

    const index = stringIds.indexOf(user.id)

    if(group[0].members.length == 1)
    {
      deleteGroup(group)
    }
    else if(checkIfOwner())
    {
      setSelectedGroup("")
      //console.log("is owner")

      realm.write(() => {
        group[0].membersDateJoined.splice(index, 1)
        group[0].memberRoles.splice(index, 1)
        group[0].members.splice(index, 1)
      })

      setNewOwner(groupId)
    }
    else
    {
      setSelectedGroup("")

      realm.write(() => {
        group[0].membersDateJoined.splice(index, 1)
        group[0].memberRoles.splice(index, 1)
        group[0].members.splice(index, 1)
      })
    }
   
  }

  const setNewOwner = (groupId:string) => {
    const group = realm.objects(Groups).filtered("groupId == $0", groupId)

    console.log(group)

    const newOwner = group[0].members[0]

    realm.write(() => {
      group[0].owner = newOwner;
    })
  }

  const deleteGroup = (groupId:any) => {
    setSelectedGroup("")

    const groupToBeDeleted = groups.filtered("groupId == $0", groupId)

    realm.write(() => {
      realm.delete(groupToBeDeleted)
    })
    
  }

  const handleConfirmLeave = () => {
    // Show confirmation popup
    Alert.alert(
        'Confirm Action',
        'Are you sure you want to leave the group?',
        [
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        {
            text: 'OK',
            onPress: () => {onClose(); leaveGroup(selectedGroup)},
        },
        ],
        { cancelable: false }
    );
    };

    const handleConfirmDelete = () => {
      // Show confirmation popup
      Alert.alert(
          'Confirm Action',
          'Are you sure you want to delete the group?',
          [
          {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
          },
          {
              text: 'OK',
              onPress: () => {handleConfirmDeleteConfirm()},
          },
          ],
          { cancelable: false }
      );
      };

    const handleConfirmDeleteConfirm = () => {
      // Show confirmation popup
      Alert.alert(
        'Confirm Action',
        'Are you completely sure???',
        [
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        {
            text: 'OK',
            onPress: () => {onClose(); deleteGroup(selectedGroup)},
        },
        ],
        { cancelable: false }
    );
    }


  useFocusEffect(
    React.useCallback(() => {
      let data = realm.objects("Users").sorted('_id').filtered("userId == $0", userId)
      setUserData(data)
    }, [])
  );

  const formatDate = (date:Date) => {
   
    
    let dateString = date.toString()

    console.log(dateString)

    let day = dateString.split(" ")[0]
    let dayNum = dateString.split(" ")[2]
    let month = dateString.split(" ")[1]
    let year = dateString.split(" ")[3]

    let prefix = ""

    if (parseInt(day) >= 11 && parseInt(day) <= 13) {
      prefix = 'th';
    }
  
    switch (parseInt(day) % 10) {
      case 1:
        prefix = 'st';
      case 2:
        prefix = 'nd';
      case 3:
        prefix = 'rd';
      default:
        prefix = 'th';
    }

    return dayNum + " " + month + " " + year;
    
  }

  const truncateText = (text:string, limit:number) => {
    if (text.length > limit) {
        return text.substring(0, limit) + '...';
      }
      return text;
}



  useEffect(() => {
    //console.log(userData)
    let user = userData[0];
    let profilePicture:string = user.profilePicture as string;

    let groups = realm.objects(Groups).filtered('ANY members == $0', userId);
    setGroups(groups)

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
        else
        {
          setImageSource(require('../../assets/defaultPFP.png'))
        }
    }

    if(groups && profilePicture)
    {
      setLoading(false)
    }
      
    }, [userData])


  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
        mutableSubs.add(
        realm.objects(Users),
        );

        mutableSubs.add(
          realm.objects(Groups)
          )

    });
    }, [realm, user]);

  
    return (
      <>
      {
        loading &&
        <ActivityIndicator size={'large'} />
      }
      {
        !loading &&
        <ScrollView contentContainerStyle={{minHeight: screenHeight, backgroundColor: 'white'}}>
          {
            restrictedView &&
            <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.green}}>
            <View style={styles.headerTitle}>
                <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                    <MaterialCommunityIcons name="arrow-left" size={40} color={'white'}/>
                </TouchableOpacity> 
                <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20, color: 'white'}}>Profile</Text>
            </View>
            </View>
          }
          {
            !restrictedView &&
            <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.green}}>
            <View style={styles.headerTitle}>
            <TouchableOpacity onPress={goToProfileSettingsScreen}>
                <MaterialCommunityIcons name="pencil" color={'white'} size={40} style={{marginRight: 10,}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToAppSettings}>
                <MaterialCommunityIcons name="cog" color={'white'} size={40} style={{marginRight: 10,}}/>
              </TouchableOpacity>
            </View>
            </View>
          }

          <View style={[styles.information]}>
            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <View style={styles.profilePictureContainer}>
                {
                  imageSource &&
                  <Image source={imageSource} style={{width: 140, height: 140, borderRadius: 100, borderWidth: 7, borderColor: 'white',}}/>
                }
                {
                  !imageSource &&
                  <Image source={require("../../assets/3.png")} style={{width: 120, height: 120, borderRadius: 100, borderWidth: 5, borderColor: 'white'}}/>
                }
              </View>
              
              <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                <Text style={styles.name}>{userData[0].firstName as string} {userData[0].lastName as string}</Text>
                <Text style={styles.username}>@{userData[0].username as string}</Text>
                {
                  userId == user.id && 
                  <TouchableOpacity style={[styles.status, shadow.shadow]} onPress={() => setShowingModalStatus(true)}>
                    <Text style={styles.statusText}>{userStatus}</Text>
                </TouchableOpacity>
                }
                { 
                  userId != user.id &&
                  <View style={[styles.status, shadow.shadow]}>
                    <Text style={styles.statusText}>{userData[0].status as string}</Text>
                  </View>
                }  
                <Text style={{color: 'white', fontSize: 18, fontWeight: '500'}}>Using UltiTracker Since {formatDate(userData[0].dateCreated)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <View style={{ width: screenWidth, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 15, paddingLeft: 15, marginTop: 20,}}>
              <Text style={{fontSize: 18, fontWeight: '800', color: colors.text}}>Teams and Groups</Text>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
                <Text style={{fontSize: 20, fontWeight: '800', color: colors.text}}>{groups.length}</Text>
                <MaterialCommunityIcons name={'account-group'} color={colors.text} size={30} style={{marginLeft: 10,}}/> 
              </View>
            </View>
            {
              groups.length == 0 &&
              <Text style={{fontSize: 25, fontWeight: '800', color: colors.black, marginTop: 15}}>Join or Create a Group!!</Text>
            }
            <FlatList 
              data={groups}
              renderItem={({item, index}) => (
                <TouchableOpacity key={index} style={[styles.groupButton, shadow.shadow, {marginTop: 15}, item.color != null && {backgroundColor: item.color}]} onPress={() => {goToGroupScreen(item.groupId)}}>
                  <View style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  {
                    item.image &&
                    <MaterialCommunityIcons name={item.image} color={"black"} size={45}/> 
                  }
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
                    <Text style={{fontSize: 20, fontWeight: '800', color: colors.text}}>{item.members.length}</Text>
                    <MaterialCommunityIcons name={'account-group'} color={colors.text} size={30}/> 
                  </View>
                  </View>
                <View style={{width: '100%', display: 'flex', justifyContent: 'flex-start'}}>
                  <Text style={{fontSize: 20, fontWeight: '800', color: colors.text}}>{truncateText(item.name, 10)}</Text>
                  {
                    item.isClub &&
                    <Text style={{fontWeight: '400', color: colors.text, fontSize: 17,}}>Team</Text>
                  }
                  {
                    !item.isClub &&
                    <Text style={{fontWeight: '400', color: colors.text, fontSize: 17,}}>Group</Text>
                  }
                </View>
                
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.containerGroupButtons}
            />
        
          </View>
        
       </ScrollView>
          }

          <TouchableOpacity style={[{position: 'absolute', bottom: 25, left: screenWidth/2 - 125, backgroundColor: colors.green, width: 250, height: 60, borderRadius: 20, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', zIndex: 2, paddingLeft: 15, paddingRight: 15,}, shadow.shadow]} onPress={() => setShowingModalOptions(true)}>
            <Text style={{fontSize: 20, fontWeight: '800', color: 'white'}}>Join/Create Group</Text>
            <MaterialCommunityIcons name={"account-multiple-plus-outline"} size={50} color={'white'}/>
        </TouchableOpacity>

      <Modal
          isVisible={showingModalOptions}
          swipeDirection={['down']}
          onSwipeComplete={onClose}
          onBackdropPress={onClose}
          style={styles.modalView}
      >
          <View style={styles.modalContent}>
            <Text style={[styles.buttonText, {marginBottom: 15,}]}>Groups</Text>
            <TouchableOpacity onPress={() => {onClose(); goToCreateGroupScreen(false)}} style={[styles.button, shadow.shadow]}>
              <Text style={styles.buttonText}>Create a Group</Text>
              <MaterialCommunityIcons name={"plus"} size={30} color={colors.text}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {onClose(); goToCreateGroupScreen(true)}} style={[styles.button, shadow.shadow]}>
              <Text style={styles.buttonText}>Create a Team</Text>
              <MaterialCommunityIcons name={"plus"} size={30} color={colors.text}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {onClose(); goToJoinGroupScreen()}} style={[styles.button, shadow.shadow]}>
              <Text style={styles.buttonText}>Join a Group or Team</Text>
              <MaterialCommunityIcons name={"plus"} size={30} color={colors.text}/>
            </TouchableOpacity>
          </View>
      </Modal>

      <Modal
          isVisible={showingModalStatus}
          swipeDirection={['down']}
          onSwipeComplete={onClose}
          onBackdropPress={onClose}
          style={styles.modalView}
      >
          <View style={styles.modalContent}>
            <Text style={[styles.buttonText, {marginBottom: 15,}]}>Change Current Status</Text>
            <TouchableOpacity onPress={() => {onClose(); setNewStatus(userId, "Healthy")}} style={[styles.button, shadow.shadow, {height: 70, paddingLeft: 20, paddingRight: 20, justifyContent: 'space-between'}]}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <MaterialCommunityIcons name={"circle"} size={30} color={colors.green} style={{marginRight: 15,}}/>
                <Text style={styles.buttonText}>Healthy</Text>
              </View>
              <View style={[styles.statusOption, userStatus == "Healthy" && {backgroundColor: 'gray'}]}></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {onClose(); setNewStatus(userId, "Injured")}} style={[styles.button, shadow.shadow, {height: 70, paddingLeft: 20, paddingRight: 20, justifyContent: 'space-between'}]}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <MaterialCommunityIcons name={"circle"} size={30} color={colors.red} style={{marginRight: 15,}}/>
                <Text style={styles.buttonText}>Injured</Text>
              </View>
              <View style={[styles.statusOption, userStatus == "Injured" && {backgroundColor: 'gray'}]}></View>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => {onClose(); setNewStatus(userId, "Away")}} style={[styles.button, shadow.shadow, {height: 70, paddingLeft: 20, paddingRight: 20, justifyContent: 'space-between'}]}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <MaterialCommunityIcons name={"circle"} size={30} color={colors.orange} style={{marginRight: 15,}}/>
                <Text style={styles.buttonText}>Away</Text>
              </View>
              <View style={[styles.statusOption, userStatus == "Away" && {backgroundColor: 'gray'}]}></View>
            </TouchableOpacity>
          </View>
      </Modal>
      
        </>
      
    );
}

