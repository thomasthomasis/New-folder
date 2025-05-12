import {useQuery, useRealm, useUser} from '@realm/react';
import {ActivityIndicator, Image, ScrollView, Text, View} from 'react-native';
import {Groups} from '../../schemas/GroupsSchema';
import {useCallback, useEffect, useState} from 'react';
import {UserStatistics} from '../../schemas/UserStatisticsSchema';
import SelectDropdown from 'react-native-select-dropdown';
import {colors} from '../../sharedStyling/Colors';
import {Users} from '../../schemas/UsersSchema';
import React from 'react';
import styles from './LeaderboardScreen.style';
import {CardioWorkout} from '../../schemas/CardioWorkoutSchema';
import {ResistanceWorkout} from '../../schemas/ResistanceWorkoutSchema';
import {BSON} from 'realm';
import {shadow} from '../../sharedStyling/Shadow';
import LinearGradient from 'react-native-linear-gradient';

type LeaderboardScreenProps = {
  group: string;
};

export const LeaderboardScreen = (props: LeaderboardScreenProps) => {
  const realm = useRealm();
  const user = useUser();

  const group = useQuery(Groups).filtered('groupId == $0', props.group);
  const stringIds = group[0].members.map(member => member);

  const [data, setData] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const getNumWorkouts = (stringIds: string[], dataSet: string) => {
    let usersTemp = [];
    let dataTemp = [];

    let sortedUsers: any[] = [];
    let sortedData: any[] = [];

    for (let i = 0; i < stringIds.length; i++) {
      let user = realm.objects(Users).filtered('userId == $0', stringIds[i]);
      usersTemp.push(user[0].userId);

      let userJoinDate = group[0].membersDateJoined[i];

      let numWorkouts = 0;
      if (dataSet == 'CardioWorkouts') {
        numWorkouts = realm.objects(CardioWorkout).filtered('user_id == $0 AND dateCreated >= $1', stringIds[i], userJoinDate).length;

        dataTemp.push({count: numWorkouts, user: user[0].userId});
      } else if (dataSet == 'ResistanceWorkouts') {
        numWorkouts = realm.objects(ResistanceWorkout).filtered('userId == $0 AND dateCreated >= $1', stringIds[i], userJoinDate).length;

        dataTemp.push({count: numWorkouts, user: user[0].userId});
      } else if (dataSet == 'Workouts') {
        let cardioWorkouts = realm.objects(CardioWorkout).filtered('user_id == $0 AND dateCreated >= $1', stringIds[i], userJoinDate).length;
        let resistanceWorkouts = realm.objects(ResistanceWorkout).filtered('userId == $0 AND dateCreated >= $1', stringIds[i], userJoinDate).length;

        numWorkouts = cardioWorkouts + resistanceWorkouts;

        dataTemp.push({count: numWorkouts, user: user[0].userId});
      }

      dataTemp.sort((a, b) => b.count - a.count);

      sortedUsers = dataTemp.map(item => item.user);
      sortedData = dataTemp.map(item => item.count);
    }

    setUsers(sortedUsers);
    setData(sortedData);

    setLoading(false);
  };

  const getTotalCardioData = (stringIds: string[], dataSet: string) => {
    let usersTemp = [];
    let dataTemp = [];

    let sortedUsers: any[] = [];
    let sortedData: any[] = [];

    for (let i = 0; i < stringIds.length; i++) {
      let user = realm.objects(Users).filtered('userId == $0', stringIds[i]);
      usersTemp.push(user[0].userId);

      let userJoinDate = group[0].membersDateJoined[i];

      if (dataSet == 'TotalTime') {
        let workouts = realm.objects(CardioWorkout).filtered('user_id == $0 AND dateCreated >= $1', stringIds[i], userJoinDate);
        let totalData = 0;
        for (let j = 0; j < workouts.length; j++) {
          totalData += workouts[i].totalTime ?? 0;
        }

        dataTemp.push({totalData: totalData, user: user[0].userId});
      } else if (dataSet == 'TotalDistance') {
        let workouts = realm.objects(CardioWorkout).filtered('user_id == $0 AND dateCreated >= $1', stringIds[i], userJoinDate);
        let totalData = 0;
        for (let j = 0; j < workouts.length; j++) {
          totalData += workouts[i].totalDistance ?? 0;
        }

        dataTemp.push({totalData: totalData, user: user[0].userId});
      }

      dataTemp.sort((a, b) => b.totalData - a.totalData);

      sortedUsers = dataTemp.map(item => item.user);
      sortedData = dataTemp.map(item => item.totalData);
    }

    setUsers(sortedUsers);
    setData(sortedData);

    setLoading(false);
  };

  const getTotalResistanceData = (stringIds: string[], dataSet: string) => {
    let usersTemp = [];
    let dataTemp = [];

    let sortedUsers: any[] = [];
    let sortedData: any[] = [];

    for (let i = 0; i < stringIds.length; i++) {
      let user = realm.objects(Users).filtered('userId == $0', stringIds[i]);
      usersTemp.push(user[0].userId);

      let userJoinDate = group[0].membersDateJoined[i];

      if (dataSet == 'TotalVolume') {
        let workouts = realm.objects(ResistanceWorkout).filtered('userId == $0 AND dateCreated >= $1', stringIds[i], userJoinDate);
        let totalData = 0;
        for (let j = 0; j < workouts.length; j++) {
          totalData += Number(workouts[i].totalVolume ?? 0);
        }

        dataTemp.push({totalData: totalData, user: user[0].userId});
      } else if (dataSet == 'TotalReps') {
        let workouts = realm.objects(ResistanceWorkout).filtered('userId == $0 AND dateCreated >= $1', stringIds[i], userJoinDate);
        let totalData = 0;
        for (let j = 0; j < workouts.length; j++) {
          totalData += workouts[i].totalReps ?? 0;
        }

        dataTemp.push({totalData: totalData, user: user[0].userId});
      }

      dataTemp.sort((a, b) => b.totalData - a.totalData);

      sortedUsers = dataTemp.map(item => item.user);
      sortedData = dataTemp.map(item => item.totalData);
    }

    setUsers(sortedUsers);
    setData(sortedData);

    setLoading(false);
  };

  const getLevels = useCallback(
    (stringIds: string[]) => {
      let users: any = [];
      let levels: any = [];

      for (let i = 0; i < stringIds.length; i++) {
        let user = realm.objects(Users).filtered('userId == $0', stringIds[i]);
        users.push(user[0].userId);

        let userStats = realm.objects(UserStatistics).filtered('userId == $0', stringIds[i]);
        let level = userStats[0].lvl;

        levels.push(level);
      }

      setUsers(users);
      setData(levels);

      setLoading(false);
    },
    [realm],
  );

  useEffect(() => {
    getLevels(stringIds);
  }, [getLevels, stringIds]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Groups)), mutableSubs.add(realm.objects(Users)), mutableSubs.add(realm.objects(UserStatistics)), mutableSubs.add(realm.objects(ResistanceWorkout)), mutableSubs.add(realm.objects(CardioWorkout));
    });
  }, [realm, user]);

  const filters = ['Workouts', 'Cardio Workouts', 'Resistance Workouts', 'Total Time', 'Total Distance', 'Total Volume', 'Total Reps', 'Level'];
  const [loading, setLoading] = useState<boolean>(true);

  const chooseFilter = (filter: string) => {
    setLoading(true);

    if (filter == 'Workouts') {
      getNumWorkouts(stringIds, 'Workouts');
    } else if (filter == 'Cardio Workouts') {
      getNumWorkouts(stringIds, 'CardioWorkouts');
    } else if (filter == 'Resistance Workouts') {
      getNumWorkouts(stringIds, 'ResistanceWorkouts');
    } else if (filter == 'Total Time') {
      getTotalCardioData(stringIds, 'TotalTime');
    } else if (filter == 'Total Distance') {
      getTotalCardioData(stringIds, 'TotalDistance');
    } else if (filter == 'Total Volume') {
      getTotalResistanceData(stringIds, 'TotalVolume');
    } else if (filter == 'Total Reps') {
      getTotalResistanceData(stringIds, 'TotalReps');
    } else if (filter == 'Level') {
      getLevels(stringIds);
    }
  };

  const getUsername = (userId: string) => {
    const user = realm.objects(Users).filtered('userId == $0', userId);

    return user[0].username;
  };

  const getProfilePicture = (userId: string) => {
    const user = realm.objects(Users).filtered('userId == $0', userId);

    if (user) {
      const path = user[0].profilePicture ?? '';

      if (path.includes('1')) {
        return require('../../assets/1.png');
      } else if (path.includes('2')) {
        return require('../../assets/2.png');
      } else if (path.includes('3')) {
        return require('../../assets/3.png');
      } else if (path.includes('4')) {
        return require('../../assets/4.png');
      }
    }

    return require('../../assets/1.png');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SelectDropdown
        data={filters}
        onSelect={selectedItem => {
          chooseFilter(selectedItem);
        }}
        buttonStyle={[styles.dropdownButton, shadow.shadow, {backgroundColor: colors.green}, group[0].color != null && {backgroundColor: group[0].color}]}
        buttonTextStyle={styles.buttonText}
        defaultButtonText="Level"
        defaultValue={'Level'}
      />
      {loading && (
        <View style={styles.containerLoading}>
          <ActivityIndicator size={'large'} color={'black'} />
        </View>
      )}
      {!loading && (
        <>
          <View style={styles.containerPodium}>
            {users.length > 2 && (
              <View style={styles.podiumContent}>
                <Image source={getProfilePicture(users[2])} style={styles.image} />
                <Text style={styles.username}>{getUsername(users[2])}</Text>
                <Text style={styles.data}>{data[2]}</Text>
                <LinearGradient
                  colors={['#95741f', '#e6cb84']}
                  style={[
                    styles.podium,
                    {
                      height: 100,
                      borderTopLeftRadius: 10,
                      borderWidth: 1,
                      borderColor: 'black',
                    },
                  ]}>
                  <Text style={styles.podiumText}>3</Text>
                </LinearGradient>
              </View>
            )}
            <View style={styles.podiumContent}>
              <Image source={getProfilePicture(users[0])} style={styles.image} />
              <Text style={styles.username}>{getUsername(users[0])}</Text>
              <Text style={styles.data}>{data[0]}</Text>
              <LinearGradient
                colors={['#ccb825', '#eadf8c']}
                style={[
                  styles.podium,
                  shadow.shadow,
                  {
                    position: 'relative',
                    zIndex: 2,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    borderWidth: 1,
                    borderColor: 'black',
                  },
                ]}>
                <Text style={styles.podiumText}>1</Text>
              </LinearGradient>
            </View>
            {users.length > 1 && (
              <View style={styles.podiumContent}>
                <Image source={getProfilePicture(users[1])} style={styles.image} />
                <Text style={styles.username}>{getUsername(users[1])}</Text>
                <Text style={styles.data}>{data[1]}</Text>
                <LinearGradient
                  colors={['#6f726e', '#dbdcdb']}
                  style={[
                    styles.podium,
                    shadow.shadow,
                    {
                      height: 140,
                      borderTopRightRadius: 10,
                      borderWidth: 1,
                      borderColor: 'black',
                    },
                  ]}>
                  <Text style={styles.podiumText}>2</Text>
                </LinearGradient>
              </View>
            )}
          </View>

          <View
            style={[
              styles.containerLeaderBoard,
              shadow.shadow,
              {
                position: 'relative',
                zIndex: 3,
                borderWidth: 1,
                borderColor: 'black',
              },
            ]}>
            {data.map((item: any, index: any) => {
              let user = users[index];

              if (user) {
                return (
                  <View key={new BSON.ObjectID().toString()} style={styles.row}>
                    <Text style={[styles.rowText, {marginRight: 10}]}>{index + 1}</Text>
                    <Image source={getProfilePicture(user)} style={[styles.image, {marginRight: 20}]} />

                    <View style={{width: 170}}>
                      <Text style={styles.rowText}>{getUsername(user)}</Text>
                    </View>
                    <Text style={styles.rowText}>{item}</Text>
                  </View>
                );
              }
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
};
