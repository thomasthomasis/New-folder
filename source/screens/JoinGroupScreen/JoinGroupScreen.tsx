import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable, PanResponder, Animated } from "react-native"
import { colors } from "../../sharedStyling/Colors";
import { useQuery, useRealm, useUser } from "@realm/react";
import { Groups } from "../../schemas/GroupsSchema";
import { BSON } from "realm";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { JoinGroupRequests } from "../../schemas/JoinGroupRequestsSchema";
import styles from "./JoinGroupScreen.style";

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { shadow } from "../../sharedStyling/Shadow";

type JoinGroupScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Account'>;
}

export const JoinGroupScreen = ({ navigation }: JoinGroupScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const goBack = () => {
        navigation.goBack()
    }

    const [groupName, setGroupName] = useState('');
    const groups = useQuery(Groups).filtered('name BEGINSWITH[c] $0', groupName);
    const groupsApartOfList = useQuery(Groups).filtered('ANY members == $0', user.id);
    const groupJoinRequests = useQuery(JoinGroupRequests).filtered('userId == $0', user.id.toString())
    const reqeustedGroups = groupJoinRequests.map(item => item.groupName)
    const groupsApartOf = groupsApartOfList.map(item => item.name)

    const [modalGroupInfoVisible, setModalGroupInfoVisible] = useState<boolean>(false)
    const [modalPendingRequestsVisible, setModalPendingRequestsVisible] = useState<boolean>(false)

    const [modalGroupName, setModalGroupName] = useState<string>('')
    const [modalGroupNumMembers, setModalGroupNumMembers] = useState<number>(0)

    const closeModal = () => {
        setModalGroupInfoVisible(false)
    }

    const closePendingRequestsModal = () => {
        setModalPendingRequestsVisible(false)
    }

    const joinGroup = (groupName:string) => {
        requestJoin(groupName)
        closeModal()
    }

    const requestJoin = useCallback(
        (groupName:string) => {
            console.log(groupName)
          // if the realm exists, create an Item
    
          realm.write(() => {
      
            return new JoinGroupRequests(realm, {
              _id: new BSON.ObjectID,
              groupName: groupName,
              userId: user.id.toString()
            });
          });
        },
        [realm, user],
      );

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
            realm.objects(Groups)
            )

            mutableSubs.add(
                realm.objects(JoinGroupRequests)
            )
        });
        }, [realm, user]);

   
    
    return (
        <>
            <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
                <View style={styles.headerTitle}>
                    <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                        <MaterialCommunityIcons name="arrow-left" size={40}/>
                    </TouchableOpacity> 
                    <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20,}}>Join group</Text>
                </View>
                <TouchableOpacity onPress={() => setModalPendingRequestsVisible(true)} style={styles.bellIcon}>
                    <MaterialCommunityIcons name='bell' size={35} />
                </TouchableOpacity>
            </View>
            <View style={styles.searchBar}>
                <View style={styles.input}>
                    <MaterialCommunityIcons name="search-web" color={'gray'} size={40} />
                    <TextInput
                        value={groupName}
                        onChangeText={text => setGroupName(text)}
                        placeholder="Enter group name"
                    />
                    
                </View>
                
            </View>
            <ScrollView>

            <View style={styles.groups}>
                {
                    groups.map((group:any, index:any) => {
                        return (
                            <TouchableOpacity key={index} style={[styles.group, shadow.shadow, group.color && {backgroundColor: group.color}]} onPress={() => {setModalGroupName(group.name); setModalGroupNumMembers(group.members.length); setModalGroupInfoVisible(true)}}>
                                <MaterialCommunityIcons name={group.image} size={35} style={{position: 'absolute', left: 10,}}/>
                                <Text style={{fontSize: 20, color: 'white', fontWeight: '800',}}>{group.name}</Text>
                                {
                                    reqeustedGroups.includes(group.name) &&
                                    <MaterialCommunityIcons name="clock-alert-outline" size={35} style={styles.icon}/>
                                }
                            </TouchableOpacity>
                        )
                    })
                }

            </View>
            </ScrollView>

             
            <Modal
                isVisible={modalGroupInfoVisible}
                swipeDirection={['down']}
                onSwipeComplete={closeModal}
                onBackdropPress={closeModal}
                style={styles.modalView}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{modalGroupName}</Text>
                    <View style={styles.smallBorder}></View>
                    <Text style={styles.text}>Members: {modalGroupNumMembers}</Text>
                    {
                        reqeustedGroups.includes(modalGroupName) &&
                        <View style={styles.notice}>
                            <Text style={{color: 'white', fontWeight: '800'}}>Join request already sent</Text>
                        </View>
                    }
                    {
                        (!reqeustedGroups.includes(modalGroupName) && !groupsApartOf.includes(modalGroupName)) &&
                        <TouchableOpacity style={styles.button} onPress={() => joinGroup(modalGroupName)}>
                            <Text style={{color: 'white', fontWeight: '800'}}>Request to join group</Text>
                        </TouchableOpacity>
                    }
                    {
                        groupsApartOf.includes(modalGroupName) && 
                        <View style={[styles.notice, {backgroundColor: colors.green}]}>
                            <Text style={{color: 'white', fontWeight: '800'}}>Already part of group</Text>
                        </View>
                    }
                    
                </View>
            </Modal>
            

            <Modal
                isVisible={modalPendingRequestsVisible}
                swipeDirection={['down']}
                onSwipeComplete={closePendingRequestsModal}
                onBackdropPress={closePendingRequestsModal}
                style={styles.modalView}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{groupJoinRequests.length} pending request(s)</Text>
                    <View style={[styles.smallBorder, {width: 250, marginBottom: 20}]}></View>
                    {
                        groupJoinRequests.map((group:any, index:any) => {
                            return (
                                <View key={index} style={styles.group}>
                                    <Text style={{fontSize: 20, color: 'white', fontWeight: '800',}}>{group.groupName}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </Modal>
            
        </>
    )
}

