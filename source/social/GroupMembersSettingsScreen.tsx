import { useCallback, useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
//import { colors } from "../Colors";
import { useQuery, useRealm, useUser } from "@realm/react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from 'react-native-modal';
import React from "react";
import { Groups } from "../schemas/GroupsSchema";
import { shadow } from "../Shadow";
import { Users } from "../schemas/UsersSchema";
import { BSON } from "realm";
import { colors } from "../Colors";

type GroupMembersSettingsScreenProps = {
    onPress:any;
    group:string;
}

export const GroupMembersSettingsScreen = (props:GroupMembersSettingsScreenProps) => {

    let realm = useRealm()
    let user = useUser()

    const group = useQuery(Groups).filtered("name == $0", props.group)

    const stringIds = group[0].members.map(member => member)

    const getUserName = (userId:string) => {
        const user = realm.objects<Users>(Users).filtered('userId == $0', userId)[0]

        return user.username;
    }

    const getUserRole = (userId:string) => {

        const index = stringIds.indexOf(userId)

        const role = group[0].memberRoles[index];

        return role;
    }

    const editUserRole = (userId:string, newRole:string) => {

        const index = stringIds.indexOf(userId)

        realm.write(() => {
            group[0].memberRoles[index] = newRole;
        })

        onClose()
    }

    const removeUser = (userId:string) => {

        const index = stringIds.indexOf(userId)

        realm.write(() => {
            group[0].members.splice(index, 1)
            group[0].membersDateJoined.splice(index, 1);
            group[0].memberRoles.splice(index, 1);
        })
    }

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
                realm.objects(Groups)
            )
            mutableSubs.add(
                realm.objects(Users)
            )
        });
        }, [realm, user]);


    const handleConfirmRemove = (userId:string) => {
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
            { cancelable: false }
        );
        };

    const handleConfirmEditRole = (userId:string, newRole:string) => {
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
            { cancelable: false }
        );
        };

    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const onClose = () => {
        setModalVisible(false)
    }

    const [selectedUser, setSelectedUser] = useState<string>('')

    return (
        <>
            <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
                <TouchableOpacity onPress={() => props.onPress()} style={styles.closeButton}>
                    <MaterialCommunityIcons name="arrow-left" size={40}/>
                </TouchableOpacity>
            </View>
            <FlatList 
                        data = {group[0].members}
                        renderItem={({item, index}) => (
                            <>
                            <View key={(new BSON.ObjectID()).toString()} style={styles.userInfoContainer}>
                                <View style={styles.userData}>
                                    <Image source={require('./Group/assets/1.png')} style={styles.image}/>
                                    <View>
                                        <Text style={styles.username}>{getUserName(item)}</Text>
                                        <Text style={styles.role}>{getUserRole(item)}</Text>
                                    </View>
                                </View>

                                <View style={styles.buttons}>
                                    <TouchableOpacity style={styles.editButton} onPress={() => {setModalVisible(true); setSelectedUser(item)}}><Text style={styles.buttonText}>Edit Role</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.removeButton} onPress={() => handleConfirmRemove(item)}><Text style={styles.buttonText}>Remove</Text></TouchableOpacity>
                                </View>
                            </View>
                            
                            <View style={styles.border}>
                            </View>
                            </>

                        )}
                        keyExtractor={(item) => item}
                    />

            <Modal
                isVisible={modalVisible}
                swipeDirection={['down']}
                onSwipeComplete={onClose}
                onBackdropPress={onClose}
                style={styles.modalView}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Roles</Text>
                    <View style={styles.border}></View>

                    <TouchableOpacity style={[styles.editButton, getUserRole(selectedUser) == "player" && {backgroundColor: 'lightgray', pointerEvents: 'none'}]} onPress={() => handleConfirmEditRole(selectedUser, "player")}><Text style={styles.buttonText}>Player</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.editButton, getUserRole(selectedUser) == "captain" && {backgroundColor: 'lightgray', pointerEvents: 'none'}]} onPress={() => handleConfirmEditRole(selectedUser, "captain")}><Text style={styles.buttonText}>Captain</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.editButton, getUserRole(selectedUser) == "coach" && {backgroundColor: 'lightgray', pointerEvents: 'none'}]} onPress={() => handleConfirmEditRole(selectedUser, "coach")}><Text style={styles.buttonText}>Coach</Text></TouchableOpacity>
                </View>
            </Modal>    
        </>
    )
}

const styles = StyleSheet.create({

    modalView: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        margin: 0,
    },

    modalContent: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,

        display: 'flex',
        alignItems: 'center',
    },

    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '800',
    },

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginLeft: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttons: {
        
    },

    removeButton: {
        width: 120,
        backgroundColor: colors.red,
        padding: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    editButton: {
        width: 120,
        backgroundColor: colors.blue,
        padding: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 5,
    },

    border: {
        width: '95%',
        height: 2,
        backgroundColor: 'lightgray',
        marginTop: 5,
        marginBottom: 20,
        marginRight: 'auto',
        marginLeft: 'auto',
    },

    group: {
        width: 170,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.purple,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },

    userInfoContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },

    userData: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: 70,
        height: 70,
        borderRadius: 70,
        marginRight: 10,
    },

    username: {
        fontSize: 20,
        fontWeight: '900',
    },

    role: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.purple,
    },

    button: {
        backgroundColor: colors.blue,
        padding: 10,
        borderRadius: 10,
    },

    buttonText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 16,
    }
})