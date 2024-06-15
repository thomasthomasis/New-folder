import React, {useEffect} from 'react';
import {View} from 'react-native';
import { MonthSummaryComponent } from '../../components/MonthSummaryComponent/MonthSummaryComponent';
import { useRealm, useQuery} from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import styles from './HomeScreen.style';

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
        <MonthSummaryComponent />
      </View>
      );
}
