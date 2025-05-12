import React, {ScrollView, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../sharedStyling/Colors';
import {BSON} from 'realm';
import styles from './CardioWorkoutDisplayScreen.style';
import {useRealm, useUser} from '@realm/react';
import {ExtraExercises} from '../../schemas/ExtraExercisesSchema';
import {useEffect} from 'react';

type CardioWorkoutDisplayScreenProps = {
  data: any;
};

export const CardioWorkoutDisplayScreen = (props: CardioWorkoutDisplayScreenProps) => {
  const realm = useRealm();
  const user = useUser();

  const date = new Date(props.data[0].dateCreated);
  const formatedDate = date.toUTCString();

  const totalTime = props.data[0].totalTime;
  const totalDistance = props.data[0].totalDistance;

  const allExercises = props.data[0].allExercises;
  const distance = props.data[0].distance;
  const time = props.data[0].time;
  const extraNotes = props.data[0].extraNotes;

  //console.log(JSON.parse(distance[0])[0])

  const convertIdToName = (id: string) => {
    const exercise = realm.objects(ExtraExercises).filtered('userId == $0 AND exerciseId == $1', user.id, id);

    console.log(id);

    if (exercise.length == 0) {
      return id; // Return null if the exercise is not found
    } else {
      return exercise[0].name ?? '';
    }
  };

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(ExtraExercises));
    });
  }, [realm, user]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, {color: colors.green}]}>{formatedDate}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          width: 250,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialCommunityIcons name="clock-time-five-outline" color={'black'} size={30} />
          <Text style={styles.text}>{totalTime} min</Text>
        </View>
        <View style={{height: 20, width: 2, backgroundColor: 'gray'}}></View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialCommunityIcons name="shoe-print" color={'black'} size={30} />
          <Text style={styles.text}>{totalDistance}km</Text>
        </View>
      </View>
      <View style={styles.smallBorder}></View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        {allExercises.map((item: any, index: any) => {
          return (
            <>
              <Text
                key={new BSON.ObjectID().toString()}
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  marginBottom: 10,
                  color: colors.green,
                }}>
                {convertIdToName(item)}
              </Text>
              {JSON.parse(time[index]).map((item: any, innerIndex: any) => {
                return (
                  <View
                    key={new BSON.ObjectID().toString()}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      width: 200,
                    }}>
                    <Text>{innerIndex + 1}</Text>
                    <View
                      style={{
                        height: 20,
                        width: 2,
                        backgroundColor: 'gray',
                      }}></View>
                    <Text style={{fontSize: 18, fontWeight: '600'}}>{item.value} min</Text>
                    <Text style={{fontSize: 18, fontWeight: '600'}}>{JSON.parse(distance[index])[innerIndex].value} km</Text>
                  </View>
                );
              })}

              {JSON.parse(extraNotes[index]).value.length > 0 && (
                <Text
                  key={new BSON.ObjectID().toString()}
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: colors.green,
                    marginTop: 10,
                  }}>
                  "{JSON.parse(extraNotes[index]).value}"
                </Text>
              )}

              <View key={new BSON.ObjectID().toString()} style={[styles.smallBorder, {backgroundColor: 'lightgray'}]}></View>
            </>
          );
        })}
      </View>
    </ScrollView>
  );
};
