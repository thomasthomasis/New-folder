import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useRealm, useUser} from '@realm/react';
import {Users} from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserStatistics} from '../../schemas/UserStatisticsSchema';
import {shadow} from '../../sharedStyling/Shadow';
import styles from './SubscriptionScreen.styles';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp} from '@react-navigation/native';
import {colors} from '../../sharedStyling/Colors';
import {useFocusEffect} from '@react-navigation/native';

type SubscriptionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Subscription'>; // Adjust according to your navigation stack
};

export const SubscriptionScreen = ({navigation}: SubscriptionScreenProps) => {
  const goBack = () => {
    navigation.goBack();
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
          <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20}}>Subscription</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.containerOption, shadow.shadow]}>
          <Text style={{fontWeight: '800', fontSize: 18, marginBottom: 50}}>Personal Group</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Text style={{fontSize: 35, fontWeight: '700'}}>€4.99</Text>
            <Text style={{fontSize: 25, fontWeight: '700', color: 'lightgray'}}>/month</Text>
          </View>
          <Text style={{fontSize: 18, marginBottom: 20}}>The Perfect way to start and{'\n'} get used to our tools</Text>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>Unlimited casual groups</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>Unlocked cosmetics</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>another bonus</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="close" size={25} color={colors.red} />
              <Text style={{marginLeft: 5}}>Team Groups</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="close" size={25} color={colors.red} />
              <Text style={{marginLeft: 5}}>In Depth Player Statistics</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 40,
              }}>
              <MaterialCommunityIcons name="close" size={25} color={colors.red} />
              <Text style={{marginLeft: 5}}>Team Events Functionality</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              {
                width: '90%',
                height: 40,
                backgroundColor: colors.green,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
              },
              shadow.shadow,
            ]}>
            <Text style={{fontSize: 20, color: 'white', fontWeight: '800'}}>Select</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.containerOption, shadow.shadow]}>
          <Text style={{fontWeight: '800', fontSize: 18, marginBottom: 50}}>Small Club</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Text style={{fontSize: 35, fontWeight: '700'}}>€29.99</Text>
            <Text style={{fontSize: 25, fontWeight: '700', color: 'lightgray'}}>/month</Text>
          </View>
          <Text style={{fontSize: 18, marginBottom: 20}}>The Perfect way to start and{'\n'} get used to our tools</Text>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>3 Team Groups</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>30 Players Per Team Group</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>In Depth Player Statistics</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 40,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>Team Events Functionality</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              {
                width: '90%',
                height: 40,
                backgroundColor: colors.green,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
              },
              shadow.shadow,
            ]}>
            <Text style={{fontSize: 20, color: 'white', fontWeight: '800'}}>Select</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.containerOption, shadow.shadow]}>
          <Text style={{fontWeight: '800', fontSize: 18, marginBottom: 50}}>Medium Sized Club</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Text style={{fontSize: 35, fontWeight: '700'}}>€44.99</Text>
            <Text style={{fontSize: 25, fontWeight: '700', color: 'lightgray'}}>/month</Text>
          </View>
          <Text style={{fontSize: 18, marginBottom: 20}}>The Perfect way to start and{'\n'} get used to our tools</Text>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>6 Team Groups</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>60 Players Per Team Group</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>In Depth Player Statistics</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 40,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>Team Events Functionality</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              {
                width: '90%',
                height: 40,
                backgroundColor: colors.green,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
              },
              shadow.shadow,
            ]}>
            <Text style={{fontSize: 20, color: 'white', fontWeight: '800'}}>Select</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.containerOption, shadow.shadow]}>
          <Text style={{fontWeight: '800', fontSize: 18, marginBottom: 50}}>Large Club</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Text style={{fontSize: 35, fontWeight: '700'}}>€54.99</Text>
            <Text style={{fontSize: 25, fontWeight: '700', color: 'lightgray'}}>/month</Text>
          </View>
          <Text style={{fontSize: 18, marginBottom: 20}}>The Perfect way to start and{'\n'} get used to our tools</Text>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>10 Team Groups</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>100 Players Per Team Group</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>In Depth Player Statistics</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 40,
              }}>
              <MaterialCommunityIcons name="check" size={25} color={colors.green} />
              <Text style={{marginLeft: 5}}>Team Events Functionality</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              {
                width: '90%',
                height: 40,
                backgroundColor: colors.green,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
              },
              shadow.shadow,
            ]}>
            <Text style={{fontSize: 20, color: 'white', fontWeight: '800'}}>Select</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};
