import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet, Linking, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import {dataExplorerLink} from '../atlasConfig.json';
import {LogoutButton} from './LogoutButton';
import {LogWorkoutScreen} from './LogWorkoutScreen';
import {HomeScreen} from './HomeScreen';
import {OfflineModeButton} from './OfflineModeButton';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileScreen } from './profile/ProfileScreen';
import { Header } from './components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SocialScreen } from './social/SocialScreen';
import { useRealm, useUser } from '@realm/react';

// If you're getting this app code by cloning the repository at
// https://github.com/mongodb/ template-app-react-native-todo,
// it does not contain the data explorer link. Download the
// app template from the Atlas UI to view a link to your data
const dataExplorerMessage = `View your data in MongoDB Atlas: ${dataExplorerLink}.`;

console.log(dataExplorerMessage);

const headerRight = () => {
  return <OfflineModeButton />;
};

const headerLeft = () => {
  return <LogoutButton />;
};

const Tab = createBottomTabNavigator();

export const App = () => {

  const realm = useRealm()
  const user = useUser()

  return (
    <>
      {/* All screens nested in RealmProvider have access
            to the configured realm's hooks. */}
      <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            >
            <Tab.Screen 
              name='Statistics' 
              component={HomeScreen}
              options={{
                headerStyle: {
                  height: 0
                },
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="chart-box" color={color} size={40} />
                ),
              }} 
              />
            <Tab.Screen 
              name="Log Workout" 
              component={LogWorkoutScreen} 
              options={{
                headerStyle: {
                  height: 0
                },
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="dumbbell" color={color} size={40} />
                ),
              }} 
              />

              <Tab.Screen 
              name='Social' 
              component={SocialScreen}
              options={{
                headerStyle: {
                  height: 0,
                },
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account-group" color={color} size={40} />
                ),
              }} 
              />
              
            <Tab.Screen 
              name="Profile"
              options={{
                headerStyle: {
                  height: 0,
                },
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account" color={color} size={40} />
                ),
              }} 
            >
              {() => <ProfileScreen restrictedView={false} user={user.id} closeProfile={''}></ProfileScreen>}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 4,
  },
  hyperlink: {
    color: 'blue',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  header: {

  }
});
