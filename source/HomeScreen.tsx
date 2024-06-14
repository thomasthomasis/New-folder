import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import { MonthSummary } from './summaryScreens/monthly/MonthSummary';
import { useRealm, useQuery, useUser } from '@realm/react';
import { Users } from './schemas/UsersSchema';

export function HomeScreen() {

  const realm = useRealm()
  const users = useQuery(Users);

  useEffect(() => {
    const createSubscription = async () => {
      // Create subscription for filtered results.
      await realm.subscriptions.update(mutableSubs => {
        mutableSubs.add(users, {name: 'users data'});
      });
    };
    createSubscription().catch(console.error);
    // Set to state variable.
  }, []);
  
    return (
      <View style={styles.container}>
        <MonthSummary />
      </View>
      );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

    
  });