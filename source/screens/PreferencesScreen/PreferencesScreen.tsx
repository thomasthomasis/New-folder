import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './PreferencesScreen.style';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {colors} from '../../sharedStyling/Colors';
import {common} from '../../sharedStyling/CommonStyle';
import {useRealm, useUser} from '@realm/react';
import {Users} from '../../schemas/UsersSchema';
import {useIsFocused} from '@react-navigation/native';

type PreferencesScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Preferences'>; // Adjust according to your navigation stack
};

export const PreferencesScreen = ({navigation}: PreferencesScreenProps) => {
  const realm = useRealm();
  const user = useUser();
  const isFocused = useIsFocused();

  const [isKg, setIsKg] = useState<boolean>(true);
  const [isLightMode, setIsLightMode] = useState<boolean>(true);
  const [isKm, setIsKm] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  console.log('loading: ', loading);

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    let userData = realm.objects(Users).filtered('userId == $0', user.id);

    setUserData(userData);

    if (userData.length > 0) {
      setLoading(false);
    }
  }, [isFocused, realm, user.id]);

  const toggleKgOption = (value: boolean) => {
    if (value) {
      setIsKg(true);

      realm.write(() => {
        userData[0].preferences[0] = 'kg';
      });
    } else if (!value) {
      setIsKg(false);

      realm.write(() => {
        userData[0].preferences[0] = 'lbs';
      });
    }
  };

  const toggleLightModeOption = (value: boolean) => {
    if (isLightMode == value) {
      return;
    }

    if (value) {
      setIsLightMode(true);

      realm.write(() => {
        userData[0].preferences[2] = 'lightMode';
      });
    } else if (!value) {
      setIsLightMode(false);

      realm.write(() => {
        userData[0].preferences[2] = 'darkMode';
      });
    }

    setColours(value);
  };

  const toggleKmOption = (value: boolean) => {
    if (isKm == value) {
      return;
    }

    if (value) {
      setIsKm(true);

      realm.write(() => {
        userData[0].preferences[1] = 'km';
      });
    } else if (!value) {
      setIsKm(false);

      realm.write(() => {
        userData[0].preferences[1] = 'miles';
      });
    }
  };

  const setColours = (value: boolean) => {
    if (value) {
      console.log('colours are light');
    } else if (!value) {
      console.log('colours are dark');
    }
  };

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
          <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20}}>Preferences</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.row}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: 100,
            }}>
            <Text style={common.h3}>Kg</Text>
            <TouchableOpacity style={[styles.option, isKg && {backgroundColor: colors.text}]} onPress={() => toggleKgOption(true)}></TouchableOpacity>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: 100,
            }}>
            <Text style={common.h3}>Lbs</Text>
            <TouchableOpacity style={[styles.option, !isKg && {backgroundColor: colors.text}]} onPress={() => toggleKgOption(false)}></TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: 100,
            }}>
            <Text style={common.h3}>Km</Text>
            <TouchableOpacity style={[styles.option, isKm && {backgroundColor: colors.text}]} onPress={() => toggleKmOption(true)}></TouchableOpacity>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: 100,
            }}>
            <Text style={common.h3}>Miles</Text>
            <TouchableOpacity style={[styles.option, !isKm && {backgroundColor: colors.text}]} onPress={() => toggleKmOption(false)}></TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: 100,
            }}>
            <Text style={common.h3}>Light Mode</Text>
            <TouchableOpacity style={[styles.option, isLightMode && {backgroundColor: colors.text}]} onPress={() => toggleLightModeOption(true)}></TouchableOpacity>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: 100,
            }}>
            <Text style={common.h3}>Dark Mode</Text>
            <TouchableOpacity style={[styles.option, !isLightMode && {backgroundColor: colors.text}]} onPress={() => toggleLightModeOption(false)}></TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};
