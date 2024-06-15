import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useQuery, useRealm, useUser } from "@realm/react";
import { Groups } from "../../schemas/GroupsSchema";
import { BSON } from "realm";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./CreateGroupScreen.style";

type CreateGroupScreenProps = {
    onPress:any;
}

export const CreateGroupScreen = (props:CreateGroupScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('')
    const groups = useQuery(Groups);

    function handleSubmit() {
        // Validate form fields
        const groupsWithNameUsed = groups.filtered("name == $0", groupName);

        if (!groupName.trim()) {
            Alert.alert("Please enter a name");
            return;
        }
        else if(groupsWithNameUsed.length > 0)
        {
            Alert.alert("This name is already in use");
            return;
        }
        // Create the group (implement this logic as needed)
        createGroup(groupName, groupDescription);
        
        // Show success message or navigate to another screen
        Alert.alert("Successfully created group");
        props.onPress("create")
    }

    const createGroup = useCallback(
        (groupName:string, groupDescription:string) => {
            console.log(groupName)
          // if the realm exists, create an Item
    
          realm.write(() => {
      
            return new Groups(realm, {
              _id: new BSON.ObjectID,
              dateCreated: new Date(),
              description: groupDescription,
              memberRoles: ["captain"],
              members: [user.id],
              membersDateJoined: [new Date()],
              name: groupName,
              owner: user.id,
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
    });
    }, [realm, user]);

    return (
        <>
            <View style={{width: '100%', height: 60, backgroundColor: 'lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
                <TouchableOpacity onPress={() => props.onPress("create")} style={styles.closeButton}>
                    <MaterialCommunityIcons name="close" size={40}/>
                </TouchableOpacity> 
                <TouchableOpacity onPress={handleSubmit} style={styles.check}>
                    <MaterialCommunityIcons name="check" size={40}/>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Creating Group</Text>
                <View style={styles.smallBorder}></View>
                <TextInput
                    value={groupName}
                    onChangeText={text => setGroupName(text)}
                    placeholder="Enter group name"
                    style={styles.input}
                />
                <TextInput
                    multiline
                    numberOfLines={10}
                    textAlignVertical="top"
                    value={groupDescription}
                    onChangeText={text => setGroupDescription(text)}
                    placeholder="Enter group description"
                    style={styles.textarea}
                />
            </View>
            
        </>
        
    )
}

