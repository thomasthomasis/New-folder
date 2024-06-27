import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity} from 'react-native';
import { useRealm, useUser } from '@realm/react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './GroupEventScreen.style';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp } from '@react-navigation/native'
import { Groups } from '../../schemas/GroupsSchema';
import { GroupEvents } from '../../schemas/GroupEventsScehma';

type GroupEventScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'GroupEvent'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'GroupEvent'>;
};

export const GroupEventScreen = ({ navigation, route}: GroupEventScreenProps) => {

    const realm = useRealm();
    const user = useUser();

    const { event } = route.params;

    console.log(event)

    const goBack = () => {
        navigation.goBack()
    }

    const goToEditEvent = (eventId:string) => {
        console.log("edit event: ", eventId)
    }

    const truncateText = (text:string, limit:number) => {
        if (text.length > limit) {
            return text.substring(0, limit) + '...';
          }
          return text;
    }

    const deleteEvent = (eventId:string) => {
        const event = realm.objects(GroupEvents).filtered("eventId == $0", eventId)

        realm.write(() => {
            realm.delete(event)
        })
    }

    const handleConfirmDeletion = (eventId:string) => {
        // Show confirmation popup
        Alert.alert(
          'Confirm Action',
          'Are you sure you want to edit this exercise?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {deleteEvent(eventId); goBack()},
            },
          ],
          { cancelable: false }
        );
      };


    let eventData = realm.objects(GroupEvents).filtered("eventId == $0", event)

    return (
        <>
            <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                    <MaterialCommunityIcons name="arrow-left" size={40}/>
                    <Text style={styles.headerTitle}>{truncateText(eventData[0].name ?? "", 15)}</Text>
                </TouchableOpacity>
                <View style={styles.column}>
                    <TouchableOpacity onPress={() => goToEditEvent(eventData[0].eventId)}>
                        <MaterialCommunityIcons name="pencil" size={40}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleConfirmDeletion(eventData[0].eventId)}>
                        <MaterialCommunityIcons name="delete" size={40}/>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.container}>
               
            </View>
        </>
        
    )
}