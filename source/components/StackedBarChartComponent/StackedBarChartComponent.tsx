import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ScrollView, Linking, Dimensions} from 'react-native';
import {LineChart, PieChart, ProgressChart, StackedBarChart} from 'react-native-chart-kit';
import {colors} from '../../sharedStyling/Colors';
import styles from './StackedBarChartComponent.style';
import {shadow} from '../../sharedStyling/Shadow';
import {BSON} from 'realm';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

type StackedBarChartComponentProps = {
  data: any;
  type: string;
};

export const StackedBarChartComponent = (props: StackedBarChartComponentProps) => {
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

      //console.log(totalCardio/totalWorkouts * 200)
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

  //console.log(data)

  return (
    <View style={[styles.container, shadow.shadow]}>
      {!props.data && <Text>No Data!</Text>}
      {props.data && (
        <>
          <View
            style={{
              position: 'absolute',
              top: 0,
              width: screenWidth - 25,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 18, fontWeight: '500', color: colors.black}}>Total Workouts</Text>
          </View>
          <View style={styles.yAxis}></View>
          <View style={styles.yAxisNumbers}>
            <Text style={styles.yAxisText}>{(totalWorkouts * 1.25).toFixed(0)}</Text>
            <Text style={styles.yAxisText}>{(totalWorkouts * 0.75).toFixed(0)}</Text>
            <Text style={styles.yAxisText}>{(totalWorkouts * 0.25).toFixed(0)}</Text>
            <Text style={styles.yAxisText}>0</Text>
          </View>
          <View style={styles.xAxis}></View>

          <View style={{display: 'flex', padding: 10, width: '100%'}}>
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
              }}>
              {data.map((item: any, index: any) => (
                <View
                  key={index}
                  style={{
                    width: '80%',
                    height: (item.workouts / totalWorkouts) * 180,
                    backgroundColor: item.color,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 18, fontWeight: '800', color: 'white'}}>{item.workouts}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.legend}>
            {data.map((item: any, index: any) => (
              <View key={new BSON.ObjectID().toString()}>
                {item.workouts > 0 && (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 10,
                      marginRight: 10,
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 15,
                        backgroundColor: item.color,
                        marginRight: 5,
                      }}></View>
                    <Text style={{fontWeight: '600', color: colors.black}}>{item.name}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};
