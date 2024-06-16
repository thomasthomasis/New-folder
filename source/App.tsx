import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';

import {dataExplorerLink} from '../atlasConfig.json';
import {LogWorkoutScreen} from './screens/LogWorkoutScreen/LogWorkoutScreen';
import {HomeScreen} from './screens/HomeScreen/HomeScreen';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileScreen } from './screens/ProfileScreen/ProfileScreen';
import { AccountScreen } from './screens/AccountScreen/AccountScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SocialScreen } from './screens/SocialScreen/SocialScreen';
import { useRealm, useUser } from '@realm/react';
import { Easing } from 'react-native';
import { LogWorkoutCardioScreen } from './screens/LogWorkoutCardioScreen/LogWorkoutCardioScreen';
import { LogWorkoutResistanceScreen } from './screens/LogWorkoutResistanceScreen/LogWorkoutResistanceScreen';
import { AddExerciseScreen } from './screens/AddExerciseScreen/AddExerciseScreen';
import { SubmitCompletion } from './screens/SubmitCompletionScreen/SubmitCompletion';

// If you're getting this app code by cloning the repository at
// https://github.com/mongodb/ template-app-react-native-todo,
// it does not contain the data explorer link. Download the
// app template from the Atlas UI to view a link to your data
const dataExplorerMessage = `View your data in MongoDB Atlas: ${dataExplorerLink}.`;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator()


export const App = () => {

  const realm = useRealm()
  const user = useUser()

  const ProfileStack = () => {
    return (
      <Stack.Navigator screenOptions={{
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
          close: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
        },
      }}>
        <Stack.Screen name="ProfileScreen" options={{ headerShown: false}} >
          {() => <ProfileScreen restrictedView={false} user={user.id} closeProfile={''}></ProfileScreen>}
        </Stack.Screen>
        <Stack.Screen name="Account" options={{ headerShown: false}}>
          {() => <AccountScreen />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  const StatisticsStack = () => {
    return (
    <Stack.Navigator screenOptions={{
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
        close: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
      },
    }}>
      <Stack.Screen name="Profile" options={{ headerShown: false}} >
        {() => <HomeScreen></HomeScreen>}
      </Stack.Screen>
    </Stack.Navigator>
    )
  }

  const SocialNavigation = () => {

  }

  const LogWorkoutStack = () => {
    return (
      <Stack.Navigator screenOptions={{
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
          close: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
        },
      }}>
        <Stack.Screen name="LogWorkout" component={LogWorkoutScreen}  options={{ headerShown: false}} />
        <Stack.Screen name="LogWorkoutCardio" component={LogWorkoutCardioScreen} initialParams={{ continuingWorkout: false }} options={{ headerShown: false}} />
        <Stack.Screen name="LogWorkoutResistance" options={{ headerShown: false}} >
          {() => <LogWorkoutResistanceScreen continuingWorkout={false} />}
        </Stack.Screen>
        <Stack.Screen name="AddExercise" options={{ headerShown: false}} >
          {() => <AddExerciseScreen />}
        </Stack.Screen>
        <Stack.Screen name="SubmitCompletion" options={{ headerShown: false}} >
          {() => <SubmitCompletion levelUp={false} gainedXp={0} />}
        </Stack.Screen>
      </Stack.Navigator>
      )
  }


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
              component={StatisticsStack}
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
              component={LogWorkoutStack} 
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
              component={ProfileStack}
              options={{
                headerStyle: {
                  height: 0,
                },
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account" color={color} size={40} />
                ),
              }} 
            >
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
      </GestureHandlerRootView>
    </>
  );
};
