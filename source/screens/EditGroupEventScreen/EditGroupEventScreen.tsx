import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity} from 'react-native';
import { useRealm, useUser } from '@realm/react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './EditGroupEventScreen.style';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp } from '@react-navigation/native'

type GroupEventsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EditGroupEvent'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'EditGroupEvent'>;
};

export const EditGroupEventScreen = ({ navigation, route}: GroupEventsScreenProps) => {

    const realm = useRealm();
    const user = useUser();

    const { event } = route.params;

    const goBack = () => {
        navigation.goBack()
    }

    return (
        <>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <TouchableOpacity onPress={goBack}>
                <MaterialCommunityIcons name="arrow-left" color={'lightgray'} size={40} style={{marginLeft: 10,}}/>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Text>Edit Group Event</Text>
            </View>
        </>
        
    )
}