import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {AppProvider, UserProvider, RealmProvider} from '@realm/react';
import {appId, baseUrl} from '../atlasConfig.json';

import {App} from './App';
import {WelcomeScreen} from './screens/WelcomeScreen/WelcomeScreen';

import {Item} from './schemas/ItemSchema';
import { CardioWorkout } from './schemas/CardioWorkoutSchema';
import { Users } from './schemas/UsersSchema';
import { ResistanceWorkout } from './schemas/ResistanceWorkoutSchema';
import { Workouts } from './schemas/WorkoutSchema';
import { UserStatistics } from './schemas/UserStatisticsSchema';
import { Groups } from './schemas/GroupsSchema';
import { JoinGroupRequests } from './schemas/JoinGroupRequestsSchema';
import { ExtraExercises } from './schemas/ExtraExercisesSchema';
import { Feedback } from './schemas/FeedbackSchema';
import { GroupEvents } from './schemas/GroupEventsScehma';


const LoadingIndicator = () => {
  return (
    <View style={styles.activityContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export const AppWrapper = () => {
  return (
    <AppProvider id={appId} baseUrl={baseUrl}>
      <UserProvider fallback={WelcomeScreen}>
        <RealmProvider
          schema={[Item, CardioWorkout, Users, ResistanceWorkout, Workouts, UserStatistics, Groups, JoinGroupRequests, ExtraExercises, Feedback, GroupEvents]}
          sync={{
            flexible: true,
            initialSubscriptions: {
              update(subs, realm) {
                subs.add(realm.objects('Users'))
              },
            },
            onError: (_session, error) => {
              // Show sync errors in the console
              console.error("Error: " + error);
            },
          }}
          fallback={LoadingIndicator}>
          <App />
        </RealmProvider>
      </UserProvider>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
