import React from 'react';
import {Text, View} from 'react-native';

import {colors} from '../../sharedStyling/Colors';
import styles from './GeneralResistanceStatsComponent.style';

type GeneralResistanceStatsProps = {
  resistanceObjects: any;
};

export const GeneralResistanceStatsComponent = (props: GeneralResistanceStatsProps) => {
  let totalVolume = 0;
  let totalReps = 0;
  for (let i = 0; i < props.resistanceObjects.length; i++) {
    totalVolume += props.resistanceObjects[i].totalVolume;
    totalReps += props.resistanceObjects[i].totalReps;
  }

  return (
    <View style={styles.container}>
      {
        <View style={[styles.containerStats, {backgroundColor: colors.black}]}>
          <Text style={[styles.title, {color: 'white'}]}>Resistance</Text>
          <Text style={[styles.text, {color: 'white'}]}>{props.resistanceObjects.length} workouts</Text>
          <Text style={[styles.text, {color: 'white'}]}>{totalVolume} kgs lifted</Text>
          <Text style={[styles.text, {color: 'white', paddingBottom: 10}]}>{totalReps} reps</Text>
        </View>
      }
    </View>
  );
};
