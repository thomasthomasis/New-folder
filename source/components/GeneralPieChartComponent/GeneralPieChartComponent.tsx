import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ScrollView, Linking, Dimensions} from 'react-native';
import {LineChart, PieChart, ProgressChart} from 'react-native-chart-kit';
import {colors} from '../../sharedStyling/Colors';
import styles from './GeneralPieChartComponent.style';
import {shadow} from '../../sharedStyling/Shadow';
import {BSON} from 'realm';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

type GeneralPieChartProps = {
  data: any;
  type: string;
};

export const GeneralPieChart = (props: GeneralPieChartProps) => {
  //console.log(props.data[1])

  const [data, setData] = useState<any[]>([]);

  const [totalCardioWorkouts, setTotalCardioWorkouts] = useState<number>(0);
  const [totalResistanceWorkouts, setTotalResistanceWorkouts] = useState<number>(0);
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0);

  const [totalHealthyWorkouts, setTotalHealthyWorkouts] = useState<number>(0);
  const [totalInjuredWorkouts, setTotalInjuredWorkouts] = useState<number>(0);
  const [totalAwayWorkouts, setTotalAwayWorkouts] = useState<number>(0);

  useEffect(() => {
    if (props.type == 'workoutType') {
      let dataArray = [];
      let totalCardio = 0;
      let totalResistance = 0;
      for (let i = 0; i < props.data.length; i++) {
        if (props.data[i].workoutType == 'Cardio') {
          totalCardio++;
        } else if (props.data[i].workoutType == 'Resistance') {
          totalResistance++;
        }
      }

      dataArray.push({
        name: 'Cardio',
        workouts: totalCardio,
        color: colors.red,
      });

      dataArray.push({
        name: 'Resistance',
        workouts: totalResistance,
        color: colors.black,
      });

      setTotalCardioWorkouts(totalCardio);
      setTotalResistanceWorkouts(totalResistance);

      setTotalWorkouts(totalCardio + totalResistance);

      setData(dataArray);

      //console.log("Data: ", data)
    } else if (props.type == 'status') {
      //console.log("status")
      let dataArray = [];
      let totalHealthy = 0;
      let totalInjured = 0;
      let totalAway = 0;

      for (let i = 0; i < props.data.length; i++) {
        if (props.data[i].userStatus == 'Healthy') {
          totalHealthy++;
        } else if (props.data[i].userStatus == 'Injured') {
          totalInjured++;
        } else if (props.data[i].userStatus == 'Away') {
          totalAway++;
        }
      }

      dataArray.push({
        name: 'Healthy',
        workouts: totalHealthy,
        color: colors.green,
      });

      dataArray.push({
        name: 'Injured',
        workouts: totalInjured,
        color: colors.red,
      });

      dataArray.push({
        name: 'Away',
        workouts: totalAway,
        color: colors.orange,
      });

      setTotalAwayWorkouts(totalAway);
      setTotalInjuredWorkouts(totalInjured);
      setTotalHealthyWorkouts(totalHealthy);

      setTotalWorkouts(totalAway + totalInjured + totalHealthy);

      setData(dataArray);

      //console.log("Data: ", data)

      //console.log("Total Workouts: ", (totalAway + totalHealthy + totalInjured))
      //console.log("Total Away: ", totalAway)
      //console.log("Total Injured: ", totalInjured)
      //console.log("Total Healthy: ", totalHealthy)
      //console.log(totalAway/(totalAway + totalHealthy + totalInjured))
    }
  }, [props.data]);

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    useShadowColorFromDataset: false, // optional
  };

  return (
    <View style={[styles.container, shadow.shadow]}>
      {props.type == 'status' && (
        <Text
          style={{
            marginBottom: 10,
            fontWeight: '500',
            color: colors.black,
            fontSize: 15,
          }}>
          User Status{'\n'}Distribution
        </Text>
      )}
      {props.type == 'workoutType' && (
        <Text
          style={{
            marginBottom: 10,
            fontWeight: '500',
            color: colors.black,
            fontSize: 15,
          }}>
          Workout Type{'\n'}Distribution
        </Text>
      )}

      <PieChart data={data} width={screenWidth / 2 - 20} height={screenWidth / 2 - 20} chartConfig={chartConfig} accessor={'workouts'} backgroundColor={'transparent'} paddingLeft={'10'} avoidFalseZero center={[30, 0]} hasLegend={false} />
      <View style={{flexDirection: 'column', alignSelf: 'center', marginTop: 0}}>
        {data.map((item, index) => (
          <View key={new BSON.ObjectID().toString()}>
            {item.workouts > 0 && (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 15,
                }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: item.color,
                    borderRadius: 5,
                    marginRight: 5,
                  }}
                />
                <Text>
                  {item.name} {((item.workouts / totalWorkouts) * 100).toFixed(2)}%
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
