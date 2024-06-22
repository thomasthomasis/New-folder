import React, {useEffect} from 'react';
import {View} from 'react-native';
import { MonthSummaryComponent } from '../../components/MonthSummaryComponent/MonthSummaryComponent';
import { useRealm, useQuery} from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import styles from './HomeScreen.style';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

export const HomeScreen = ({ navigation }: HomeScreenProps) => {

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
