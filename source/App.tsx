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
import { GroupEventsScreen } from './screens/GroupEventsScreen/GroupEventsScreen';
import { GroupEventScreen } from './screens/GroupEventScreen/GroupEventScreen';
import { CreateGroupEventScreen } from './screens/CreateGroupEventScreen/CreateGroupEventScreen';
import { EditGroupEventScreen } from './screens/EditGroupEventScreen/EditGroupEventScreen';
import { AccountSettingsScreen } from './screens/AccountSettingsScreen/AccountSettingsScreen';
import { PrivacyPolicyScreen } from './screens/PrivacyPolicyScreen/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from './screens/TermsOfServiceScreen/TermsOfServiceScreen';
import { SubscriptionScreen } from './screens/SubscriptionScreen/SubscriptionScreen';
import { PreferencesScreen } from './screens/PreferencesScreen/PreferencesScreen';
import { ResistanceStatsScreen } from './screens/ResistanceStatsScreen/ResistanceStatsScreen';
import { MenuProvider } from 'react-native-popup-menu';
import { CardioStatsScreen } from './screens/CardioStatsScreen/CardioStatsScreen';
import { ResistanceExerciseStatsScreen } from './screens/ResistanceExerciseStatsScreen/ResistanceExerciseStatsScreen';
import { CardioExerciseStatsScreen } from './screens/CardioExerciseStatsScreen/CardioExerciseStatsScreen';
import { StatisticsScreen } from './screens/StatisticsScreen/StatisticsScreen';

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

  const HistoryStack = () => {
    return (
    <Stack.Navigator screenOptions={{
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
        close: { animation: 'timing', config: { duration: 100, easing: Easing.linear } },
      },
    }}>
      <Stack.Screen name="Home" options={{ headerShown: false}} component={HomeScreen}/>
      <Stack.Screen name="ProfileSettings" options={{ headerShown: false }} component={ProfileSettingsScreen} />
      <Stack.Screen name="LogWorkoutCardio" component={LogWorkoutCardioScreen} initialParams={{ continuingWorkout: false }} options={{ headerShown: false}} />
      <Stack.Screen name="LogWorkoutResistance" component={LogWorkoutResistanceScreen} initialParams={{ continuingWorkout: false }} options={{ headerShown: false}}/>
      <Stack.Screen name="AddExercise" component={AddExerciseScreen} options={{ headerShown: false}}/>
      <Stack.Screen name="SubmitCompletion" component={SubmitCompletion} initialParams={{ levelUp: false, gainedXp: 0 }} options={{ headerShown: false}}/>
      <Stack.Screen name="EditResistanceExercise" component={EditResistanceExerciseScreen} initialParams={{ exercise: "" }} options={{ headerShown: false}}/>
      <Stack.Screen name="EditCardioExercise" component={EditCardioExerciseScreen} initialParams={{ exercise: "" }} options={{ headerShown: false}}/>
      <Stack.Screen name="WorkoutDisplay" options={{ headerShown: false}} component={WorkoutDisplayScreen} initialParams={{ data: "", dataType: "" }}/>
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
        <Stack.Screen name="AccountSettings" options={{ headerShown: false }} component={AccountSettingsScreen} />
        <Stack.Screen name="Feedback" options={{ headerShown: false }} component={FeedbackScreen} />
        <Stack.Screen name="PrivacyPolicy" options={{ headerShown: false }} component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsOfService" options={{ headerShown: false }} component={TermsOfServiceScreen} />
        <Stack.Screen name="Subscription" options={{ headerShown: false }} component={SubscriptionScreen} />
        <Stack.Screen name="Preferences" options={{ headerShown: false }} component={PreferencesScreen} />
        <Stack.Screen name="SocialScreen" options={{ headerShown: false}} component={SocialScreen}/>
        <Stack.Screen name="CreateGroup" options={{ headerShown: false}} component={CreateGroupScreen} />
        <Stack.Screen name="JoinGroup" options={{ headerShown: false}} component={JoinGroupScreen} />
        <Stack.Screen name="GroupMembersSettings" options={{ headerShown: false}} component={GroupMembersSettingsScreen} initialParams={{ group: "" }}/>
        <Stack.Screen name="GroupSettings" options={{ headerShown: false}} component={GroupSettingsScreen} initialParams={{ group: "" }}/>
        <Stack.Screen name="Group" options={{ headerShown: false}} component={GroupScreen} initialParams={{ group: "" }}/>
        <Stack.Screen name="WorkoutDisplay" options={{ headerShown: false}} component={WorkoutDisplayScreen} initialParams={{ data: "", dataType: "" }}/>
        <Stack.Screen name="History" options={{ headerShown: false}} component={HistoryScreen} initialParams={{ group: "" }}/>
        <Stack.Screen name="GroupEvents" options={{ headerShown: false}} component={GroupEventsScreen} initialParams={{ group: "" }}/>
        <Stack.Screen name="GroupEvent" options={{ headerShown: false}} component={GroupEventScreen} initialParams={{ event: "" }}/>
        <Stack.Screen name="CreateGroupEvent" options={{ headerShown: false}} component={CreateGroupEventScreen} initialParams={{ group: "" }}/>
        <Stack.Screen name="EditGroupEvent" options={{ headerShown: false}} component={EditGroupEventScreen} initialParams={{ event: "" }}/>
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
          <Stack.Screen name="Statistics" options={{ headerShown: false }} component={StatisticsScreen} initialParams={{ userId: user.id }}/>
          <Stack.Screen name="ResistanceStats" options={{ headerShown: false }} component={ResistanceStatsScreen} />
          <Stack.Screen name="CardioStats" options={{ headerShown: false }} component={CardioStatsScreen} />
          <Stack.Screen name="ResistanceExerciseStats" options={{ headerShown: false }} component={ResistanceExerciseStatsScreen} />
          <Stack.Screen name="CardioExerciseStats" options={{ headerShown: false }} component={CardioExerciseStatsScreen} />
          <Stack.Screen name="ProfileSettings" options={{ headerShown: false }} component={ProfileSettingsScreen} />
          
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
        <Stack.Screen name="ProfileSettings" options={{ headerShown: false }} component={ProfileSettingsScreen} />
        
      </Stack.Navigator>
      )
  }


  return (
    <>
      {/* All screens nested in RealmProvider have access
            to the configured realm's hooks. */}
      <MenuProvider>
      <GestureHandlerRootView style={{flex: 1, backgroundColor: 'white'}}>
      <SafeAreaProvider style={{backgroundColor: 'white'}}>
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
                  name="History"
                  component={HistoryStack}
                  options={({route}) => ({
                    headerStyle: {
                      height: 0,
                    },
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons name="calendar-blank" color={color} size={40} />
                    ),
                    tabBarStyle: ((route) => {
                      const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                      if(routeName === "ProfileSettings" || routeName == "LogWorkoutCardio" || routeName == "LogWorkoutResistance" || routeName == "AddExercise" || routeName == "SubmitCompletion" || routeName == "EditResistanceExercise" || routeName == "EditCardioExercise" || routeName == "WorkoutDisplay")
                        {
                          return {display: "none"}
                        }
                        return
                    })(route),
                  })} 
                >
              </Tab.Screen>
              <Tab.Screen 
                  name="Stats"
                  component={StatisticsStack}
                  options={({route}) => ({
                    headerStyle: {
                      height: 0,
                    },
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons name="poll" color={color} size={40} />
                    ),
                    tabBarStyle: ((route) => {
                      const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                      if(routeName == "ResistanceStats" || routeName == "CardioStats" || routeName == "ResistanceExerciseStats" || routeName == "CardioExerciseStats")
                        {
                          return {display: "none"}
                        }
                        return
                    })(route),
                  })} 
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
                      if(routeName === 'Account' || routeName === "AppSettings" || routeName === "ProfileSettings" || routeName === "Feedback" || routeName === "AccountSettings" || routeName === "PrivacyPolicy" || routeName === "TermsOfService" || routeName == "Subscription" || routeName == "Preferences" ){
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
      </MenuProvider>
    </>
  );
};
