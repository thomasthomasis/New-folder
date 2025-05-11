import React, {useState, useEffect, useCallback} from 'react';
import {Alert, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
import {useQuery, useRealm, useUser} from '@realm/react';
import {Users} from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {shadow} from '../../sharedStyling/Shadow';
import styles from './AppSettingsScreen.style';
import Modal from 'react-native-modal';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {colors} from '../../sharedStyling/Colors';

type AppSettingsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AppSettings'>;
};

export const AppSettingsScreen = ({navigation}: AppSettingsScreenProps) => {
  const realm = useRealm();
  const user = useUser();

  const goBack = () => {
    navigation.goBack();
  };

  const goToAccountSettingsScreen = () => {
    navigation.navigate('AccountSettings');
  };

  const goToSubscriptionScreen = () => {
    navigation.navigate('Subscription');
  };

  const goToPreferencesScreen = () => {
    navigation.navigate('Preferences');
  };

  const goToFeedbackScreen = () => {
    navigation.navigate('Feedback');
  };

  const goToTermsOfServiceScreen = () => {
    navigation.navigate('TermsOfService');
  };

  const goToPrivacyPolicyScreen = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const signOut = useCallback(() => {
    user?.logOut();
  }, [user]);

  const handleConfirm = () => {
    // Show confirmation popup
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to signout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => signOut(),
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 10,
          position: 'absolute',
          zIndex: 2,
        }}>
        <TouchableOpacity onPress={goBack}>
          <MaterialCommunityIcons name="arrow-left" color={'black'} size={40} style={{marginLeft: 10}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleConfirm}>
          <MaterialCommunityIcons name="logout" color={'black'} size={40} style={{marginRight: 10}} />
        </TouchableOpacity>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={goToAccountSettingsScreen}>
          <View style={styles.column}>
            <MaterialCommunityIcons name="shield-account" color={'black'} size={40} style={[styles.icon, shadow.shadow]} />
            <Text style={[styles.cardTitle, {marginLeft: 10}]}>Account</Text>
          </View>
          <MaterialCommunityIcons name="arrow-right" color={'black'} size={40} style={{marginLeft: 10}} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={goToPreferencesScreen}>
          <View style={[styles.column, {width: 160}]}>
            <MaterialCommunityIcons name="tune-variant" color={'black'} size={40} style={[styles.icon, shadow.shadow]} />
            <Text style={[styles.cardTitle, {marginLeft: 10}]}>Preferences</Text>
          </View>
          <MaterialCommunityIcons name="arrow-right" color={'black'} size={40} style={{marginLeft: 10}} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={goToSubscriptionScreen}>
          <View style={[styles.column, {width: 160}]}>
            <MaterialCommunityIcons name="refresh" color={'black'} size={40} style={[styles.icon, shadow.shadow]} />
            <Text style={[styles.cardTitle, {marginLeft: 10}]}>Subscription</Text>
          </View>
          <MaterialCommunityIcons name="arrow-right" color={'black'} size={40} style={{marginLeft: 10}} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, shadow.shadow]} onPress={goToFeedbackScreen}>
          <View style={[styles.column, {width: 160}]}>
            <MaterialCommunityIcons name="form-select" color={'black'} size={40} style={[styles.icon, shadow.shadow]} />
            <Text style={[styles.cardTitle, {marginLeft: 10}]}>Feedback</Text>
          </View>
          <MaterialCommunityIcons name="arrow-right" color={'black'} size={40} style={{marginLeft: 10}} />
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity onPress={goToTermsOfServiceScreen}>
            <Text style={{marginBottom: 15}}>Terms and Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToPrivacyPolicyScreen}>
            <Text>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
