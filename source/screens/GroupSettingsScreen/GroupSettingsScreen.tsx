import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
//import { colors } from "../Colors";
import { useQuery, useRealm, useUser } from "@realm/react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from 'react-native-modal';
import React from "react";
import { Groups } from "../../schemas/GroupsSchema";
import { shadow } from "../../sharedStyling/Shadow";
import styles from "./GroupSettingsScreen.style";

type GroupSettingsScreenProps = {
    onPress:any;
    group:string;
}

export const GroupSettingsScreen = (props:GroupSettingsScreenProps) => {

    const realm = useRealm()
    const user = useUser()
    
    const group = useQuery(Groups).filtered("name == $0", props.group)

    const [groupName, setGroupName] = useState<string>(group[0].name)
    const [groupDescription, setGroupDescription] = useState<string>(group[0].description ?? "")

    const updateGroupInfo = () => {
        realm.write(() => {
            group[0].name = groupName;
            group[0].description = groupDescription;
        })

        Alert.alert("Group Edited Successfully!");
        props.onPress()
    }

    const handleNameChange = (inputText:string) => {
        setGroupName(inputText)
    }

    const handleDescriptionChange = (inputText:string) => {
        setGroupDescription(inputText)
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
              onPress: () => updateGroupInfo(),
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
        

            <View style={[styles.information, shadow.shadow]}>
                <Text style={{fontSize: 25, fontWeight: '900', marginBottom: 5,}}>Group Information</Text>
                <View style={styles.smallBorder}></View>
                <View style={styles.row}>
                    <Text style={{fontSize: 18, fontWeight: '600', color: '#bfc0be'}}>Group Name</Text>
                    <TextInput
                        style={{fontSize: 18, fontWeight: '600', borderBottomWidth: 2, borderBottomColor: 'lightgray', padding: 0,}}
                        onChangeText={handleNameChange}
                        value={groupName}
                    />
                </View>
                <View style={styles.rowTextarea}>
                    <Text style={{fontSize: 18, fontWeight: '600', color: '#bfc0be'}}>Group Description</Text>
                    <TextInput
                        multiline
                        numberOfLines={10}
                        textAlignVertical="top"
                        style={styles.textarea}
                        onChangeText={handleDescriptionChange}
                        value={groupDescription}
                    />
                </View>
            </View>
        </>
    )
}

