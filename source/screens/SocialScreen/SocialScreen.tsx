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


export function SocialScreen() {

  const realm = useRealm()
  const user = useUser()

  const groups = useQuery(Groups).filtered('ANY members == $0', user.id);
  

  const createGroup = () => {
    setCreatingGroup(true)
  }

  const joinGroup = () => {
    setJoiningGroup(true)
  }

  const closeScreen = (name:string) => {
    if(name == "join")
    {
      setJoiningGroup(false)
    }
    else if(name == "create")
    {
      setCreatingGroup(false)
    }
    else if(name == "view")
    {
      setViewingGroup(false)
    }
  }

  const [creatingGroup, setCreatingGroup] = useState<boolean>(false)
  const [joiningGroup, setJoiningGroup] = useState<boolean>(false)
  const [viewingGroup, setViewingGroup] = useState<boolean>(false)

  const [editingGroup, setEditingGroup] = useState<boolean>(false)
  const [editingGroupMembers, setEditingGroupMembers] = useState<boolean>(false)
  const [selectedGroup, setSelectedGroup] = useState<string>('')

  const [group, setGroup] = useState<string>('')

  const [showingModal, setShowingModal] = useState<boolean>(false)

  const onClose = () => {
    setShowingModal(false)
  }

  const stopEditingGroup = () => {
    setEditingGroup(false)
  }
  
  const stopEditingGroupMembers = () => {
    setEditingGroupMembers(false)
  }

  const checkIfOwner = () => {

    if(selectedGroup == "")
    {
      return false;
    }

    const group = groups.filtered("name == $0", selectedGroup)

    if(user.id == group[0].owner)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  const leaveGroup = (groupName:string) => {

    console.log(groupName)

    const group = groups.filtered("name == $0", groupName)
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

      setNewOwner(groupName)
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

  const setNewOwner = (groupName:string) => {
    const group = realm.objects(Groups).filtered("name == $0", groupName)

    console.log(group)

    const newOwner = group[0].members[0]

    realm.write(() => {
      group[0].owner = newOwner;
    })
  }

  const deleteGroup = (group:any) => {
    setSelectedGroup("")

    const groupToBeDeleted = groups.filtered("name == $0", group)

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
    {
      (!creatingGroup && !joiningGroup && !viewingGroup && !editingGroup && !editingGroupMembers) && 
      <View style={styles.container}>
            <FlatList
            data={groups}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={[styles.groupButton, shadow.shadow, {marginTop: 20}]} onPress={() => {setGroup(item.name); setViewingGroup(true)}}>
                <Text style={styles.buttonText}>{item.name}</Text>
                <TouchableOpacity onPress={() => {setShowingModal(true); setSelectedGroup(item.name)}}>
                  <MaterialCommunityIcons name="dots-vertical" color={'white'} size={40} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />

        <View>
          <TouchableOpacity onPress={createGroup} style={[styles.button, shadow.shadow]}>
            <Text style={{color: 'white', fontWeight: '800'}}>Create a Group</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={joinGroup} style={[styles.button, shadow.shadow]}>
            <Text style={{color: 'white', fontWeight: '800'}}>Join a Group</Text>
          </TouchableOpacity>
        </View>
      </View>

      
    }

    {
      creatingGroup &&
      
        <CreateGroupScreen onPress={closeScreen}/>
    }

    {
      joiningGroup &&
      <ScrollView>
        <JoinGroupScreen onPress={closeScreen}/>
      </ScrollView>
    }

    {
      viewingGroup &&
      <GroupScreen onPress={closeScreen} group={group} />
    }

    {
      editingGroup &&
      <GroupSettingsScreen onPress={stopEditingGroup} group={selectedGroup} />
    }

    {
      editingGroupMembers &&
      <GroupMembersSettingsScreen onPress={stopEditingGroupMembers} group={selectedGroup}/>
    }

    <Modal
          isVisible={showingModal}
          swipeDirection={['down']}
          onSwipeComplete={onClose}
          onBackdropPress={onClose}
          style={styles.modalView}
      >
          <View style={styles.modalContent}>
            {
              checkIfOwner() && 
              <>
                <TouchableOpacity style={styles.button} onPress={() => {setEditingGroup(true); onClose()}}>
                  <Text style={styles.buttonText}>Edit Group</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {marginBottom: 50}]} onPress={() => {setEditingGroupMembers(true); onClose()}}>
                  <Text style={styles.buttonText}>Edit Members</Text>
                </TouchableOpacity>
              </>
            }
            <TouchableOpacity style={[styles.button, {backgroundColor: colors.red}]} onPress={() => {handleConfirmLeave()}}>
              <Text style={styles.buttonText}>Leave Group</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: colors.red}]} onPress={() => {handleConfirmDelete()}}>
              <Text style={styles.buttonText}>Delete Group</Text>
            </TouchableOpacity>
                
            
          </View>
      </Modal>
    
    </>
    );
}

