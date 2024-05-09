import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Button, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import { useRealm, useQuery, useUser } from '@realm/react';
import { App } from 'realm';
import PagerView from 'react-native-pager-view';
import { colors } from '../Colors';
import { CreateGroupScreen } from './CreateGroupScreen';
import { Groups } from '../schemas/GroupsSchema';
import { JoinGroupScreen } from './JoinGroupScreen';
import { GroupScreen } from './GroupScreen';
import { shadow } from '../Shadow';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GroupSettingsScreen } from './GroupSettingsScreen';
import { GroupMembersSettingsScreen } from './GroupMembersSettingsScreen';


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
                {
                  item.owner == user.id &&
                  <TouchableOpacity onPress={() => {setShowingModal(true); setSelectedGroup(item.name)}}>
                    <MaterialCommunityIcons name="dots-vertical" color={'white'} size={40} />
                  </TouchableOpacity>
                }
                
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
                <TouchableOpacity style={styles.button} onPress={() => {setEditingGroup(true); onClose()}}>
                  <Text style={styles.buttonText}>Edit Group</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => {setEditingGroupMembers(true); onClose()}}>
                  <Text style={styles.buttonText}>Edit Members</Text>
                </TouchableOpacity>
          </View>
      </Modal>
    
    </>
    );
}

const styles = StyleSheet.create({

  container: {
    width: '100%',
    height: '100%',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  button: {
    width: 170,
    height: 40,
    backgroundColor: colors.blue,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 10,
    borderRadius: 10,
  },

  groupButton: {
    width: 200,
    backgroundColor: colors.purple,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 20,
    borderRadius: 10,
    padding: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 25,
  },

  modalView: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    margin: 0,
},

  modalContent: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
  },
   
    
  });