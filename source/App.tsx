import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer, getFocusedRouteNameFromRoute} from '@react-navigation/native';

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

import { RootStackParamList } from './navgiation/NavigationTypes';
import { CreateGroupScreen } from './screens/CreateGroupScreen/CreateGroupScreen';
import { JoinGroupScreen } from './screens/JoinGroupScreen/JoinGroupScreen';
import { GroupMembersSettingsScreen } from './screens/GroupMembersSettingsScreen/GroupMembersSettingsScreen';
import { GroupSettingsScreen } from './screens/GroupSettingsScreen/GroupSettingsScreen';
import { GroupScreen } from './screens/GroupScreen/GroupScreen';
import { WorkoutDisplayScreen } from './screens/WorkoutDisplayScreen/WorkoutDisplayScreen';
import { HistoryScreen } from './screens/HistoryScreen/HistoryScreen';
import { AppSettingsScreen } from './screens/AppSettingsScreen/AppSettingsScreen';
import { ProfileSettingsScreen } from './screens/ProfileSettingsScreen/ProfileSettingsScreen';
import { FeedbackScreen } from './screens/FeedbackScreen/FeedbackScreen';
import { EditResistanceExerciseScreen } from './screens/EditResistanceExerciseScreen/EditResistanceExerciseScreen';
import { EditCardioExerciseScreen } from './screens/EditCardioExerciseScreen/EditCardioExerciseScreen';

// If you're getting this app code by cloning the repository at
// https://github.com/mongodb/ template-app-react-native-todo,
// it does not contain the data explorer link. Download the
// app template from the Atlas UI to view a link to your data
const dataExplorerMessage = `View your data in MongoDB Atlas: ${dataExplorerLink}.`;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>()


export const App = () => {

  const realm = useRealm()
  const user = useUser()

  const HomeStack = () => {
    return (
    <Stack.Navigator screenOptions={{
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
        close: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
      },
    }}>
      <Stack.Screen name="Home" options={{ headerShown: false}} component={HomeScreen}/>
    </Stack.Navigator>
    )
  }

  const ProfileStack = () => {
    return (
      <Stack.Navigator initialRouteName='ProfileScreen' screenOptions={{
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
          close: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
        },
      }}>
        <Stack.Screen name="ProfileScreen" options={{ headerShown: false}} component={ProfileScreen} initialParams={{ userId: user.id, restrictedView: false}}/>
        <Stack.Screen name="Account" options={{ headerShown: false}} component={AccountScreen} />
        <Stack.Screen name="AppSettings" options={{ headerShown: false }} component={AppSettingsScreen} />
        <Stack.Screen name="ProfileSettings" options={{ headerShown: false }} component={ProfileSettingsScreen} />
        <Stack.Screen name="Feedback" options={{ headerShown: false }} component={FeedbackScreen} />
      </Stack.Navigator>
    )
  }

  

  const SocialStack = () => {
    return (
      <Stack.Navigator screenOptions={{
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
            close: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
          },
        }}>
          <Stack.Screen name="SocialScreen" options={{ headerShown: false}} component={SocialScreen}/>
          <Stack.Screen name="CreateGroup" options={{ headerShown: false}} component={CreateGroupScreen} />
          <Stack.Screen name="JoinGroup" options={{ headerShown: false}} component={JoinGroupScreen} />
          <Stack.Screen name="GroupMembersSettings" options={{ headerShown: false}} component={GroupMembersSettingsScreen} initialParams={{ group: "" }}/>
          <Stack.Screen name="GroupSettings" options={{ headerShown: false}} component={GroupSettingsScreen} initialParams={{ group: "" }}/>
          <Stack.Screen name="Group" options={{ headerShown: false}} component={GroupScreen} initialParams={{ group: "" }}/>
          <Stack.Screen name="WorkoutDisplay" options={{ headerShown: false}} component={WorkoutDisplayScreen} initialParams={{ data: "", dataType: "" }}/>
          <Stack.Screen name="History" options={{ headerShown: false}} component={HistoryScreen} initialParams={{ group: "" }}/>
          <Stack.Screen name="ProfileScreen" options={{ headerShown: false}} component={ProfileScreen} initialParams={{ userId: "", restrictedView: true}}/>
      </Stack.Navigator>
    )
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
        <Stack.Screen name="LogWorkoutResistance" component={LogWorkoutResistanceScreen} initialParams={{ continuingWorkout: false }} options={{ headerShown: false}}/>
        <Stack.Screen name="AddExercise" component={AddExerciseScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="SubmitCompletion" component={SubmitCompletion} initialParams={{ levelUp: false, gainedXp: 0 }} options={{ headerShown: false}}/>
        <Stack.Screen name="EditResistanceExercise" component={EditResistanceExerciseScreen} initialParams={{ exercise: "" }} options={{ headerShown: false}}/>
        <Stack.Screen name="EditCardioExercise" component={EditCardioExerciseScreen} initialParams={{ exercise: "" }} options={{ headerShown: false}}/>
        
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
          <Tab.Navigator>
            
              <Tab.Screen 
                  name="Dashboard"
                  component={LogWorkoutStack}
                  options={({ route }) => ({
                    headerStyle: {
                      height: 0,
                    },
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons name="view-dashboard" color={color} size={40} />
                    ),
                    tabBarStyle: ((route) => {
                      const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                      if(routeName === "LogWorkoutCardio" || routeName === "LogWorkoutResistance" || routeName === "AddExercise" || routeName === "EditResistanceExercise" || routeName === "EditCardioExercise")
                        {
                          return {display: "none"}
                        }
                        return
                    })(route),
                  })} 
                >
              </Tab.Screen>
              <Tab.Screen 
                  name="Statistics"
                  component={HomeStack}
                  options={{
                    headerStyle: {
                      height: 0,
                    },
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons name="poll" color={color} size={40} />
                    ),
                  }} 
                >
              </Tab.Screen>
              <Tab.Screen 
                  name="Social"
                  component={SocialStack}
                  options={{
                    headerStyle: {
                      height: 0,
                    },
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons name="account-group" color={color} size={40} />
                    ),
                  }} 
                >
              </Tab.Screen>
              <Tab.Screen 
                  name="Profile"
                  component={ProfileStack}
                  options={({ route }) => ({
                    headerStyle: {
                      height: 0,
                    },
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons name="account" color={color} size={40} />
                    ),
                    tabBarStyle: ((route) => {
                      const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                      if(routeName === 'Account' || routeName === "AppSettings" || routeName === "ProfileSettings" || routeName === "Feedback"){
                        return {display: "none"}
                      }
                      return
                    })(route),
                  })} 
                >
              </Tab.Screen>
          </Tab.Navigator>
          
        </NavigationContainer>
      </SafeAreaProvider>
      </GestureHandlerRootView>
    </>
  );
};
