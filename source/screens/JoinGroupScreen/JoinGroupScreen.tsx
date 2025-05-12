import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {useQuery, useRealm, useUser} from '@realm/react';
import {Groups} from '../../schemas/GroupsSchema';
import {BSON} from 'realm';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import {JoinGroupRequests} from '../../schemas/JoinGroupRequestsSchema';
import styles from './JoinGroupScreen.style';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {shadow} from '../../sharedStyling/Shadow';

type JoinGroupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Account'>;
};

export const JoinGroupScreen = ({navigation}: JoinGroupScreenProps) => {
  const realm = useRealm();
  const user = useUser();

  const goBack = () => {
    navigation.goBack();
  };

  const [groupName, setGroupName] = useState('');
  const groups = useQuery(Groups).filtered('name BEGINSWITH[c] $0 AND isPublic == $1', groupName, true);
  const privateGroups = realm.objects(Groups).filtered('name == $0 AND groupTag == $1 AND isPublic == $2', groupName.split('#')[0], '#' + groupName.split('#')[1], false);
  const groupsApartOfList = useQuery(Groups).filtered('ANY members == $0', user.id);
  const groupJoinRequests = useQuery(JoinGroupRequests).filtered('userId == $0', user.id.toString());
  const reqeustedGroups = groupJoinRequests.map(item => item.groupName);
  const groupsApartOf = groupsApartOfList.map(item => item.groupId);

  const [modalGroupInfoVisible, setModalGroupInfoVisible] = useState<boolean>(false);
  const [modalPendingRequestsVisible, setModalPendingRequestsVisible] = useState<boolean>(false);

  const [modalGroupName, setModalGroupName] = useState<string>('');

  const closeModal = () => {
    setModalGroupInfoVisible(false);
  };

  const closePendingRequestsModal = () => {
    setModalPendingRequestsVisible(false);
  };

  const joinGroup = (groupName: string) => {
    requestJoin(groupName);
    closeModal();
  };

  const requestJoin = useCallback(
    (groupName: string) => {
      console.log(groupName);
      // if the realm exists, create an Item

      realm.write(() => {
        return new JoinGroupRequests(realm, {
          _id: new BSON.ObjectID(),
          groupName: groupName,
          userId: user.id.toString(),
        });
      });
    },
    [realm, user],
  );

  const cancelRequest = useCallback(
    (groupId: string) => {
      const joinRequest = realm.objects(JoinGroupRequests).filtered('groupName == $0 AND userId == $1', groupId, user.id);

      realm.write(() => {
        realm.delete(joinRequest);
      });
    },
    [realm, user],
  );

  const getGroupName = (groupId: string) => {
    const group = realm.objects(Groups).filtered('groupId == $0', groupId);

    if (group.length > 0) {
      return group[0].name;
    } else {
      return '';
    }
  };

  const getNumGroupMembers = (groupId: string) => {
    const group = realm.objects(Groups).filtered('groupId == $0', groupId);

    if (group.length > 0) {
      return group[0].members.length;
    } else {
      return 0;
    }
  };

  const calculateLength = (array: any) => {
    console.log(array);

    let amount = 0;

    for (let i = 0; i < array.length; i++) {
      if (array[i] == '') {
        continue;
      }
      amount++;
    }

    return amount;
  };

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Groups));

      mutableSubs.add(realm.objects(JoinGroupRequests));
    });
  }, [realm, user]);

  return (
    <>
      <View
        style={{
          width: '100%',
          height: 60,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={styles.headerTitle}>
          <TouchableOpacity onPress={goBack} style={styles.closeButton}>
            <MaterialCommunityIcons name="arrow-left" size={40} />
          </TouchableOpacity>
          <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20}}>Join group</Text>
        </View>
        <TouchableOpacity onPress={() => setModalPendingRequestsVisible(true)} style={styles.bellIcon}>
          <MaterialCommunityIcons name="bell" size={35} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        <View style={styles.input}>
          <MaterialCommunityIcons name="search-web" color={'gray'} size={40} />
          <TextInput value={groupName} onChangeText={text => setGroupName(text)} placeholder="Enter group name" />
        </View>
      </View>
      <ScrollView>
        <View style={styles.groups}>
          {groups.map((group: any, index: any) => {
            return (
              <TouchableOpacity
                key={index}
                style={[styles.group, shadow.shadow, group.color && {backgroundColor: group.color}]}
                onPress={() => {
                  setModalGroupName(group.groupId);
                  setModalGroupInfoVisible(true);
                }}>
                {group.image.length > 0 && <MaterialCommunityIcons name={group.image} size={35} style={{position: 'absolute', left: 10}} />}

                <Text style={{fontSize: 20, color: 'white', fontWeight: '800'}}>{getGroupName(group.groupId)}</Text>
                {reqeustedGroups.includes(group.groupId) && <MaterialCommunityIcons name="clock-alert-outline" size={35} style={styles.icon} />}
              </TouchableOpacity>
            );
          })}
          {privateGroups.map((group: any, index: any) => {
            return (
              <TouchableOpacity
                key={index}
                style={[styles.group, shadow.shadow, group.color && {backgroundColor: group.color}]}
                onPress={() => {
                  setModalGroupName(group.groupId);
                  setModalGroupInfoVisible(true);
                }}>
                <MaterialCommunityIcons name={group.image} size={35} style={{position: 'absolute', left: 10}} />
                <Text style={{fontSize: 20, color: 'white', fontWeight: '800'}}>{getGroupName(group.groupId)}</Text>
                {reqeustedGroups.includes(group.name) && <MaterialCommunityIcons name="clock-alert-outline" size={35} style={styles.icon} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Modal isVisible={modalGroupInfoVisible} swipeDirection={['down']} onSwipeComplete={closeModal} onBackdropPress={closeModal} style={styles.modalView}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{getGroupName(modalGroupName)}</Text>
          <View style={styles.smallBorder}></View>
          <Text style={styles.text}>Members: {getNumGroupMembers(modalGroupName)}</Text>
          {reqeustedGroups.includes(modalGroupName) && (
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View style={styles.notice}>
                <Text style={{color: 'white', fontWeight: '800'}}>Join request already sent</Text>
              </View>
              <TouchableOpacity onPress={() => cancelRequest(modalGroupName)}>
                <MaterialCommunityIcons name="delete" size={35} color={colors.black} />
              </TouchableOpacity>
            </View>
          )}
          {!reqeustedGroups.includes(modalGroupName) && !groupsApartOf.includes(modalGroupName) && (
            <TouchableOpacity style={styles.button} onPress={() => joinGroup(modalGroupName)}>
              <Text style={{color: 'white', fontWeight: '800'}}>Request to join group</Text>
            </TouchableOpacity>
          )}
          {groupsApartOf.includes(modalGroupName) && (
            <View style={[styles.notice, {backgroundColor: colors.green}]}>
              <Text style={{color: 'white', fontWeight: '800'}}>Already part of group</Text>
            </View>
          )}
        </View>
      </Modal>

      <Modal isVisible={modalPendingRequestsVisible} swipeDirection={['down']} onSwipeComplete={closePendingRequestsModal} onBackdropPress={closePendingRequestsModal} style={styles.modalView}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{calculateLength(groupJoinRequests)} pending request(s)</Text>
          <View style={[styles.smallBorder, {width: 250, marginBottom: 20}]}></View>
          {groupJoinRequests.map((group: any, index: any) =>
            group == '' ? (
              <View key={index} style={styles.group}>
                <Text style={{fontSize: 20, color: 'white', fontWeight: '800'}}>{getGroupName(group.groupId)}</Text>
              </View>
            ) : null,
          )}
        </View>
      </Modal>
    </>
  );
};
