import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {useQuery, useRealm, useUser} from '@realm/react';
import {UserStatistics} from '../../schemas/UserStatisticsSchema';
import styles from './SubmitCompletionScreen.style';
import {useNavigation} from '@react-navigation/native';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp} from '@react-navigation/native';

type SubmitCompletionProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SubmitCompletion'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'SubmitCompletion'>;
};

export const SubmitCompletion = ({navigation, route}: SubmitCompletionProps) => {
  const realm = useRealm();
  const user = useUser();

  const {levelUp, gainedXp, navigationScreen} = route.params;

  const goToLogWorkout = () => {
    if (navigationScreen == 'LogWorkout') {
      navigation.navigate('LogWorkout');
    } else if (navigationScreen == 'Home') {
      navigation.navigate('Home');
    }
  };

  const userStats = useQuery(UserStatistics).filtered('userId == $0', user.id);

  const [unleveled, setUnleveled] = useState<number>(200);
  const [leveled, setLeveled] = useState<number>(0);

  useEffect(() => {
    let xp = userStats[0].xp;

    setLeveled(Number(((xp / userStats[0].xpTarget) * 200).toFixed(0)));
    setUnleveled(200 - leveled);
  }, [userStats]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(UserStatistics));
    });
  }, [realm, user]);

  return (
    <View style={styles.container}>
      <View style={styles.bigCircle}>
        <Text style={styles.bigCircleText}>{userStats[0].lvl}</Text>
      </View>
      {levelUp && <Text style={styles.congratsText}>LEVEL UP</Text>}
      {!levelUp && <Text style={styles.congratsText}>WELL DONE</Text>}
      <View style={styles.progressBarContainer}>
        <View style={styles.smallCircle}>
          <Text style={styles.smallCircleText}>XP</Text>
        </View>
        <View style={{display: 'flex', flexDirection: 'column'}}>
          <View style={styles.progressBar}>
            <View style={[styles.bar, {width: leveled, backgroundColor: colors.green}]}></View>
            <View style={[styles.bar, {width: unleveled, backgroundColor: 'lightgray'}]}></View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {gainedXp >= 0 && <Text>+{gainedXp}</Text>}
            {gainedXp < 0 && <Text>+0</Text>}

            <Text>
              {userStats[0].xp} / {userStats[0].xpTarget}
            </Text>
          </View>
        </View>

        <View style={styles.smallCircle}>
          <Text style={styles.smallCircleText}>{userStats[0].lvl + 1}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={goToLogWorkout} style={styles.continueButton}>
        <Text style={styles.text}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};
