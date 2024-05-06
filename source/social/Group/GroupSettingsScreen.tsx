import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
//import { colors } from "../Colors";
import { useQuery, useRealm, useUser } from "@realm/react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from 'react-native-modal';
import React from "react";
import { Groups } from "../../schemas/GroupsSchema";

type GroupSettingsScreenProps = {
    onPress:any;
    group:string;
    
}

export const GroupSettingsScreen = (props:GroupSettingsScreenProps) => {

    const realm = useRealm()
    const user = useUser()
    
    const group = useQuery(Groups).filtered("name == $0", props.group)

    const updateGroupInformation = () => {
        console.log("Group updated")
        props.onPress()
    }

    const handleConfirm = () => {
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
              onPress: () => updateGroupInformation(),
            },
          ],
          { cancelable: false }
        );
      };

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
                realm.objects(Groups)
            )
        });
        }, [realm, user]);

    return (
        <>
            <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
                <TouchableOpacity onPress={() => props.onPress()} style={styles.closeButton}>
                    <MaterialCommunityIcons name="arrow-left" size={40}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleConfirm()} style={{marginRight: 10,}}>
                    <MaterialCommunityIcons name="check" size={40}/>
                </TouchableOpacity>
            </View>
        
            <View style={styles.container}>
                <Text>{group[0].name}</Text>
                <Text>{group[0].dateCreated?.toLocaleString()}</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({

    container: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
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
})