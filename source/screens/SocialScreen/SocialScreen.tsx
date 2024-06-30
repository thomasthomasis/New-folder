import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Button, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import { useRealm, useQuery, useUser } from '@realm/react';
import { colors } from '../../sharedStyling/Colors';
import { CreateGroupScreen } from '../CreateGroupScreen/CreateGroupScreen';
import { Groups } from '../../schemas/GroupsSchema';
import { JoinGroupScreen } from '../JoinGroupScreen/JoinGroupScreen';
import { GroupScreen } from '../GroupScreen/GroupScreen';
import { shadow } from '../../sharedStyling/Shadow';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GroupSettingsScreen } from '../GroupSettingsScreen/GroupSettingsScreen';
import { GroupMembersSettingsScreen } from '../GroupMembersSettingsScreen/GroupMembersSettingsScreen';
import styles from './SocialScreen.style';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file

type SocialScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'SocialScreen'>;
}


export const SocialScreen = ({ navigation }: SocialScreenProps) => {

  const realm = useRealm()
  const user = useUser()

  const goToGroupScreen = (group:string) => {
    navigation.navigate("Group", { group: group })
  }

  const goToCreateGroupScreen = () => {
    navigation.navigate("CreateGroup")
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

  const groups = useQuery(Groups).filtered('ANY members == $0', user.id);

  console.log(groups)
  
  const [selectedGroup, setSelectedGroup] = useState<string>('')

  const [showingModal, setShowingModal] = useState<boolean>(false)
  const [showingModalOptions, setShowingModalOptions] = useState<boolean>(false)

  const onClose = () => {
    setShowingModal(false)
    setShowingModalOptions(false)
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
    const stringIds = group[0].members.map(member => member)

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

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
        mutableSubs.add(
        realm.objects(Groups)
        )
    });
    }, [realm, user]);
  
  return (
    <> 
      <View style={styles.container}>
            {
              groups.length == 0 &&
              <Text style={{fontSize: 25, fontWeight: '800', color: colors.black, marginTop: 15}}>Join or Create a Group!!</Text>
            }
            <FlatList
            contentContainerStyle={styles.flatList}
            data={groups}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={[styles.groupButton, shadow.shadow, {marginTop: 20}, item.color != null && {backgroundColor: item.color}]} onPress={() => {goToGroupScreen(item.groupId)}}>
                {
                  item.image &&
                  <MaterialCommunityIcons name={item.image} color={"black"} size={50} /> 
                }
                <Text style={styles.buttonText}>{item.name}</Text>
                <TouchableOpacity onPress={() => {setShowingModal(true); setSelectedGroup(item.groupId)}}>
                  <MaterialCommunityIcons name="dots-vertical" color={'white'} size={40} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />

        <View style={[styles.addButtonContainer, shadow.shadow]}>
          <TouchableOpacity onPress={() => setShowingModalOptions(true)} style={[styles.button, {width: 60, height: 60, borderRadius: 80, marginTop: 10,}, shadow.shadow]}>
            <MaterialCommunityIcons name="plus" color={'white'} size={50} />
          </TouchableOpacity>
        </View>
        
      </View>

    <Modal
          isVisible={showingModal}
          swipeDirection={['down']}
          onSwipeComplete={onClose}
          onBackdropPress={onClose}
          style={styles.modalView}
      >
          <View style={styles.modalContent}>
            <Text style={{fontWeight: '800', fontSize: 25, marginBottom: 10, textDecorationLine: 'underline'}}>{selectedGroup}</Text>
            {
              checkIfOwner() && 
              <>
                <TouchableOpacity style={styles.button} onPress={() => {onClose(); goToEditingGroupScreen(selectedGroup)}}>
                  <Text style={styles.buttonText}>Edit Group</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {marginBottom: 50}]} onPress={() => {onClose(); goToEditingGroupMembersScreen(selectedGroup); }}>
                  <Text style={styles.buttonText}>Edit Members</Text>
                </TouchableOpacity>
              </>
            }
            <TouchableOpacity style={[styles.button, {backgroundColor: colors.red}]} onPress={() => {handleConfirmLeave()}}>
              <Text style={styles.buttonText}>Leave Group</Text>
            </TouchableOpacity>
            {
              checkIfOwner() &&
              <TouchableOpacity style={[styles.button, {backgroundColor: colors.red}]} onPress={() => {handleConfirmDelete()}}>
                <Text style={styles.buttonText}>Delete Group</Text>
              </TouchableOpacity>
            }
            
                
            
          </View>
      </Modal>

      <Modal
          isVisible={showingModalOptions}
          swipeDirection={['down']}
          onSwipeComplete={onClose}
          onBackdropPress={onClose}
          style={styles.modalView}
      >
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => {onClose(); goToCreateGroupScreen()}} style={[styles.button, shadow.shadow]}>
              <Text style={styles.buttonText}>Create a Group</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {onClose(); goToJoinGroupScreen()}} style={[styles.button, shadow.shadow]}>
              <Text style={styles.buttonText}>Join a Group</Text>
            </TouchableOpacity>
          </View>
      </Modal>
    
    </>
    );
}

