import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useQuery, useRealm, useUser} from '@realm/react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import {Groups} from '../../schemas/GroupsSchema';
import {Users} from '../../schemas/UsersSchema';
import {BSON} from 'realm';
import styles from './GroupMembersSettingsScreen.style';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp} from '@react-navigation/native';

type GroupMembersSettingsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'GroupMembersSettings'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'GroupMembersSettings'>;
};

export const GroupMembersSettingsScreen = ({navigation, route}: GroupMembersSettingsScreenProps) => {
  let realm = useRealm();
  let user = useUser();

  const {group} = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const groupData = useQuery(Groups).filtered('name == $0', group);

  const stringIds = groupData[0].members.map(member => member);

  const getUserName = (userId: string) => {
    const user = realm.objects<Users>(Users).filtered('userId == $0', userId)[0];

    return user.username;
  };

  const getProfilePicture = (userId: string) => {
    const user: any = realm.objects('Users').filtered('userId == $0', userId)[0];

    console.log(user);

    if (user.profilePicture) {
      const path = user.profilePicture ?? '';

      if (path.includes('1')) {
        return require('../../assets/1.png');
      } else if (path.includes('2')) {
        return require('../../assets/2.png');
      } else if (path.includes('3')) {
        return require('../../assets/3.png');
      } else if (path.includes('4')) {
        return require('../../assets/4.png');
      }
    } else {
      return '';
    }
  };

  const getUserRole = (userId: string) => {
    const index = stringIds.indexOf(userId);

    const role = groupData[0].memberRoles[index];

    return role;
  };

  const editUserRole = (userId: string, newRole: string) => {
    const index = stringIds.indexOf(userId);

    realm.write(() => {
      groupData[0].memberRoles[index] = newRole;
    });

    onClose();
  };

  const removeUser = (userId: string) => {
    const index = stringIds.indexOf(userId);

    realm.write(() => {
      groupData[0].members.splice(index, 1);
      groupData[0].membersDateJoined.splice(index, 1);
      groupData[0].memberRoles.splice(index, 1);
    });
  };

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Groups));
      mutableSubs.add(realm.objects(Users));
    });
  }, [realm, user]);

  const handleConfirmRemove = (userId: string) => {
    // Show confirmation popup
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to remove this user?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => removeUser(userId),
        },
      ],
      {cancelable: false},
    );
  };

  const handleConfirmEditRole = (userId: string, newRole: string) => {
    // Show confirmation popup
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to update your information?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => editUserRole(userId, newRole),
        },
      ],
      {cancelable: false},
    );
  };

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const onClose = () => {
    setModalVisible(false);
  };

  const [selectedUser, setSelectedUser] = useState<string>('');

  return (
    <>
      <View
        style={{
          width: '100%',
          height: 60,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={goBack} style={styles.closeButton}>
          <MaterialCommunityIcons name="arrow-left" size={40} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={groupData[0].members}
        renderItem={({item}) => (
          <>
            <View key={new BSON.ObjectID().toString()} style={styles.userInfoContainer}>
              <View style={styles.userData}>
                <Image source={getProfilePicture(item)} style={styles.image} />
                <View>
                  <Text style={styles.username}>{getUserName(item)}</Text>
                  <Text style={styles.role}>{getUserRole(item)}</Text>
                </View>
              </View>

              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setModalVisible(true);
                    setSelectedUser(item);
                  }}>
                  <Text style={styles.buttonText}>Edit Role</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeButton} onPress={() => handleConfirmRemove(item)}>
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.border}></View>
          </>
        )}
        keyExtractor={item => item}
      />

      <Modal isVisible={modalVisible} swipeDirection={['down']} onSwipeComplete={onClose} onBackdropPress={onClose} style={styles.modalView}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Roles</Text>
          <View style={styles.border}></View>

          <TouchableOpacity
            style={[
              styles.editButton,
              getUserRole(selectedUser) == 'player' && {
                backgroundColor: 'lightgray',
                pointerEvents: 'none',
              },
            ]}
            onPress={() => handleConfirmEditRole(selectedUser, 'player')}>
            <Text style={styles.buttonText}>Player</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.editButton,
              getUserRole(selectedUser) == 'captain' && {
                backgroundColor: 'lightgray',
                pointerEvents: 'none',
              },
            ]}
            onPress={() => handleConfirmEditRole(selectedUser, 'captain')}>
            <Text style={styles.buttonText}>Captain</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.editButton,
              getUserRole(selectedUser) == 'coach' && {
                backgroundColor: 'lightgray',
                pointerEvents: 'none',
              },
            ]}
            onPress={() => handleConfirmEditRole(selectedUser, 'coach')}>
            <Text style={styles.buttonText}>Coach</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};
