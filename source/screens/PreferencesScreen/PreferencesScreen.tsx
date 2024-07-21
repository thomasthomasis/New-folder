import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './PreferencesScreen.style';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file

type PreferencesScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Preferences'>; // Adjust according to your navigation stack
};

export const PreferencesScreen = ({ navigation }: PreferencesScreenProps) => {

    const goBack = () => {
        navigation.goBack()
    }

    return (
        <>
        <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
            <View style={styles.headerTitle}>
                <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                    <MaterialCommunityIcons name="arrow-left" size={40}/>
                </TouchableOpacity> 
                <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20,}}>Preferences</Text>
        </View>
        </View>
        <View style={styles.container}>
            <Text>Preferences</Text>
        </View>
        </>
        
    )
}