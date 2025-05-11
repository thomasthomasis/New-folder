import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ScrollView, Linking, Dimensions} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import {colors} from '../../../sharedStyling/Colors';
import styles from './ResistancePieChartComponent.style';
import {ExtraExercises} from '../../../schemas/ExtraExercisesSchema';
import {useRealm, useUser} from '@realm/react';
import {BSON} from 'realm';

type ResistancePieChartComponentProps = {
  coloursArray: string[];
  graphVolume: any[];
  graphReps: any[];
  labels: any[];
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const ResistancePieChartComponent = (props: ResistancePieChartComponentProps) => {
  const realm = useRealm();
  const user = useUser();

  const screenWidth = Dimensions.get('window').width;

  //console.log("Data passed in: ", props.data[0]._id)
  //console.log(props.data[0].userId)

  const [loading, setLoading] = useState(true);

  const [extraExercises, setExtraExercises] = useState<any>(realm.objects(ExtraExercises).filtered('userId == $0 && type == $1', user.id, 'Resistance'));
  const [graphTotalVolume, setGraphTotalVolume] = useState<any[]>([]);
  const [graphTotalReps, setGraphTotalReps] = useState<any[]>([]);

  const sections = [
    {
      title: 'Neck',
      content: [
        {id: '0', name: 'Neck Curls'},
        {id: '1', name: 'Neck Raises'},
        {id: '2', name: 'Side Raises'},
      ],
    },
    {
      title: 'Back',
      content: [
        {id: '3', name: 'Bar Pullover'},
        {id: '4', name: 'Barbell Incline Row'},
        {id: '5', name: 'Barbell Row'},
        {id: '6', name: 'Barbell Upright Row'},
        {id: '7', name: 'Cable Row'},
        {id: '8', name: 'Chest Supported Row'},
        {id: '9', name: 'Chin Up'},
        {id: '10', name: 'Clean & Press'},
        {id: '11', name: 'Deadlift'},
        {id: '12', name: 'Dumbbell One Arm Row'},
        {id: '13', name: 'Farmer Carry'},
        {id: '14', name: 'Good Morning'},
        {id: '15', name: 'Hyperextension'},
        {id: '16', name: 'Iso-lateral Pulldown'},
        {id: '17', name: 'Iso-lateral Row Machine'},
        {id: '18', name: 'Lat Pulldown'},
        {id: '19', name: 'Pendlay Row'},
        {id: '20', name: 'Pull Up'},
        {id: '21', name: 'Lat Pulldown'},
        {id: '22', name: 'Rope Pullover'},
        {id: '23', name: 'Seated Row Machine'},
        {id: '24', name: 'Single Arm Lat Pulldown'},
        {id: '25', name: 'T-Bar Row'},
        {id: '26', name: 'Weighted Pullup'},
      ],
    },
    {
      title: 'Shoulders',
      content: [
        {id: '27', name: 'Arnold Press'},
        {id: '28', name: 'Cable Front Raise'},
        {id: '29', name: 'Cable Lateral Raise'},
        {id: '30', name: 'Cable Rear Delt Fly'},
        {id: '31', name: 'Cable Shoulder Press'},
        {id: '32', name: 'Clean & Press'},
        {id: '33', name: 'Dumbbell Front Raise'},
        {id: '34', name: 'Dumbbell Lateral Raise'},
        {id: '35', name: 'Dumbbell Rear Delt Fly'},
        {id: '36', name: 'Dumbbell Shoulder Press'},
        {id: '37', name: 'External Rotations'},
        {id: '38', name: 'Face Pull'},
        {id: '39', name: 'Internal Rotations'},
        {id: '40', name: 'Lateral Raise Machine'},
        {id: '41', name: 'Military Press'},
        {id: '42', name: 'Rear Delt Fly Machine'},
        {id: '43', name: 'Seated Lateral Raise'},
        {id: '44', name: 'Shoulder Press Machine'},
        {id: '45', name: 'Smith Machine Shoulder Press'},
        {id: '46', name: 'Upright Row'},
      ],
    },
    {
      title: 'Chest',
      content: [
        {id: '47', name: 'Barbell Bench Press'},
        {id: '48', name: 'Cable Chest Press'},
        {id: '49', name: 'Cable Crossover'},
        {id: '50', name: 'Cable Fly (high to low)'},
        {id: '51', name: 'Cable Fly (low to high)'},
        {id: '52', name: 'Close Grip Bench Press'},
        {id: '53', name: 'Decline Bench Press'},
        {id: '54', name: 'Decline Dumbbell Press'},
        {id: '55', name: 'Decline Smith Machine Bench Press'},
        {id: '56', name: 'Dips'},
        {id: '57', name: 'Dumbbell Fly'},
        {id: '58', name: 'Dumbbell Press'},
        {id: '59', name: 'Incline Bench Press'},
        {id: '60', name: 'Incline Cable Press'},
        {id: '61', name: 'Incline Dumbbell Fly'},
        {id: '62', name: 'Incline Dumbbell Press'},
        {id: '63', name: 'Incline Smith Machine Press'},
        {id: '64', name: 'Iso-lateral Chest Press'},
        {id: '65', name: 'Pec Deck Machine'},
        {id: '66', name: 'Push Up'},
        {id: '67', name: 'Seated Chest Press Machine'},
        {id: '68', name: 'Smith Machine Bench Press'},
        {id: '69', name: 'Weighted Dips'},
      ],
    },
    {
      title: 'Biceps',
      content: [
        {id: '70', name: 'Barbell Bicep Curl'},
        {id: '71', name: 'Barbell Preacher Curl'},
        {id: '72', name: 'Bayesian Curl'},
        {id: '73', name: 'Cable Curl'},
        {id: '74', name: 'Cable Hammer Curl'},
        {id: '75', name: 'Chin Up'},
        {id: '76', name: 'Concentration Curl'},
        {id: '77', name: 'Dumbbell Bicep Curl'},
        {id: '78', name: 'Dumbbell Preacher Curl'},
        {id: '79', name: 'EZ Bar Preacher Curl'},
        {id: '80', name: 'Face Away Cable Curl'},
        {id: '81', name: 'Hammer Curl'},
        {id: '82', name: 'Preacher Curl Machine'},
        {id: '83', name: 'Spider Curl'},
      ],
    },
    {
      title: 'Triceps',
      content: [
        {id: '84', name: 'Bar Pushdown'},
        {id: '85', name: 'Barbell Skullcrusher'},
        {id: '86', name: 'Cable Kickback'},
        {id: '87', name: 'Cable Single Arm Extension'},
        {id: '88', name: 'Close Grip Bench Press'},
        {id: '89', name: 'Dips'},
        {id: '90', name: 'Dumbbell Kickback'},
        {id: '91', name: 'Dumbbell Skullcrusher'},
        {id: '92', name: 'Dumbbell Tricep Extension'},
        {id: '93', name: 'EZ Bar Skullcrusher'},
        {id: '94', name: 'Katana Extension'},
        {id: '95', name: 'Diamond Push Up'},
        {id: '96', name: 'Rope Overhead Extension'},
        {id: '97', name: 'Smith Machine JM Press'},
        {id: '98', name: 'Tricep Extension'},
        {id: '99', name: 'Weighted Dips'},
      ],
    },
    {
      title: 'Forearms',
      content: [
        {id: '100', name: 'Reverse Barbell Curl'},
        {id: '101', name: 'Reverse Dumbbell Curl'},
        {id: '102', name: 'Wrist Curl'},
      ],
    },
    {
      title: 'Core',
      content: [
        {id: '103', name: 'Ab Crunch'},
        {id: '104', name: 'Back Extension'},
        {id: '105', name: 'Cable Crunch'},
        {id: '106', name: 'Ex Oblique Cable Twist'},
        {id: '107', name: 'Farmer Carry'},
        {id: '108', name: 'Good Morning'},
        {id: '109', name: 'Russian Twist'},
        {id: '110', name: 'Sit Up'},
      ],
    },
    {
      title: 'Quads',
      content: [
        {id: '111', name: 'Barbell Back Squat'},
        {id: '112', name: 'Barbell Front Squat'},
        {id: '113', name: 'Barbell Lunge'},
        {id: '114', name: 'Bodyweight Pistol Squat'},
        {id: '115', name: 'Bulgarian Split Squat'},
        {id: '116', name: 'Clean'},
        {id: '117', name: 'Deadlift'},
        {id: '118', name: 'Dumbbell Lunge'},
        {id: '119', name: 'Goblet Squat'},
        {id: '120', name: 'Hack Squat'},
        {id: '121', name: 'Leg Extension'},
        {id: '122', name: 'Leg Press'},
        {id: '123', name: 'Lunge'},
        {id: '124', name: 'Pendulum Squat'},
        {id: '125', name: 'Reverse Nordic'},
        {id: '126', name: 'Single-Leg Leg Press'},
        {id: '127', name: 'Sled Push'},
        {id: '128', name: 'Smith Machine Squat'},
        {id: '129', name: 'Snatch'},
        {id: '130', name: 'Sumo Deadlift'},
      ],
    },
    {
      title: 'Glutes',
      content: [
        {id: '131', name: 'Barbell Back Squat'},
        {id: '132', name: 'Barbell Front Squat'},
        {id: '133', name: 'Barbell Lunge'},
        {id: '134', name: 'Barbell RDL'},
        {id: '135', name: 'Bulgarian Split Squat'},
        {id: '136', name: 'Clean'},
        {id: '137', name: 'Deadlift'},
        {id: '138', name: 'Donkey Kick'},
        {id: '139', name: 'Dumbbell Lunge'},
        {id: '140', name: 'Glute Ham Raise'},
        {id: '141', name: 'Glute Kickback'},
        {id: '142', name: 'Good Morning'},
        {id: '143', name: 'Hip Abductor'},
        {id: '144', name: 'Hip Thrust'},
        {id: '145', name: 'Leg Press'},
        {id: '146', name: 'Lunge'},
        {id: '147', name: 'Romanian Deadlift'},
        {id: '148', name: 'Single-Leg Leg Press'},
        {id: 149, name: 'Sled Push'},
        {id: 150, name: 'Stiff Leg Deadlift'},
        {id: 151, name: 'Sumo Deadlift'},
      ],
    },
    {
      title: 'Hamstrings',
      content: [
        {id: '152', name: 'Barbell Back Squat'},
        {id: '153', name: 'Barbell Lunge'},
        {id: '154', name: 'Barbell RDL'},
        {id: '155', name: 'Bulgarian Split Squat'},
        {id: '156', name: 'Deadlift'},
        {id: '157', name: 'Dumbbell Lunge'},
        {id: '158', name: 'Dumbbell RDL'},
        {id: '159', name: 'Glute Ham Raise'},
        {id: '160', name: 'Good Morning'},
        {id: '161', name: 'Leg Curl'},
        {id: '162', name: 'Lunge'},
        {id: '163', name: 'Lying Leg Curl'},
        {id: '164', name: 'Nordic Curls'},
        {id: '165', name: 'Romanian Deadlift'},
        {id: '166', name: 'Sled Push'},
        {id: '167', name: 'Stiff Leg Deadlift'},
        {id: '168', name: 'Sumo Deadlift'},
      ],
    },
    {
      title: 'Hip Flexors',
      content: [
        {id: '169', name: 'Hip March'},
        {id: '170', name: 'Lying Reverse Squat'},
      ],
    },
    {
      title: 'Groin',
      content: [{id: '171', name: 'Hip Adductor'}],
    },
    {
      title: 'Calves',
      content: [
        {id: '172', name: 'Seated Calf Raises'},
        {id: '173', name: 'Standing Calf Raises'},
      ],
    },
    {
      title: 'Other',
      content: [
        // Additional exercises can be added here
      ],
    },
  ];

  useEffect(() => {
    addExtraExercisesToSection();

    if (extraExercises) {
      setLoading(false);
    }

    let objectsVolume: any[] = [];
    let objectsReps: any[] = [];

    for (let i = 0; i < props.graphVolume.length; i++) {
      let objectVolume = {
        value: props.graphVolume[i],
        color: props.coloursArray[i],
      };

      let objectReps = {
        value: props.graphReps[i],
        color: props.coloursArray[i],
      };

      objectsVolume.push(objectVolume);
      objectsReps.push(objectReps);
    }

    setGraphTotalVolume(objectsVolume);
    setGraphTotalReps(objectsReps);
  }, [props.coloursArray]);

  const getExerciseName = (id: string) => {
    const exercise = extraExercises.filtered('userId == $0 AND exerciseId == $1', user.id, id);

    if (exercise.length == 0) {
      for (let section of sections) {
        let exercise = section.content.find(ex => ex.id === id);
        if (exercise) {
          return exercise.name;
        }
      }
      return ''; // Return null if the exercise is not found
    } else {
      return exercise[0].name ?? '';
    }
  };

  const convertIdToName = (id: string) => {
    //console.log("id: ", id)

    let name = getExerciseName(id);

    //console.log("name: ", name)

    return name;
  };

  const addExtraExercisesToSection = () => {
    for (let i = 0; i < extraExercises.length; i++) {
      let extraInformation = extraExercises[i].extraInformation ?? '';
      //console.log(extraExercises[i])

      if (extraInformation == '') {
        let section = sections.find(section => section.title == 'Other');

        if (section) {
          let alreadyExists = section.content.some(item => item.name === getExerciseName(extraExercises[i].exerciseId));
          if (alreadyExists) continue;

          let name = getExerciseName(extraExercises[i].exerciseId);
          let newExercise = {id: extraExercises[i].exerciseId, name: name};
          section.content.push(newExercise);
        }
        continue;
      }

      let muscleGroups = extraInformation.split(',');

      for (let j = 0; j < muscleGroups.length; j++) {
        if (muscleGroups[j] == '') continue;

        let section = sections.find(section => section.title == muscleGroups[j]);

        if (section) {
          let name = getExerciseName(extraExercises[i].exerciseId);
          let newExercise = {id: extraExercises[i].exerciseId, name: name};
          section.content.push(newExercise);
        }

        section = sections.find(section => section.title == 'Other');

        if (section) {
          let alreadyExists = section.content.some(item => item.name === getExerciseName(extraExercises[i].exerciseId));
          if (alreadyExists) continue;

          let name = getExerciseName(extraExercises[i].exerciseId);
          let newExercise = {id: extraExercises[i].exerciseId, name: name};
          section.content.push(newExercise);
        }
      }
    }
  };

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(ExtraExercises));
    });
  }, [realm, user]);

  const calculateLargestPercentage = (objects: any[]) => {
    let largest = 0;
    let total = 0;

    for (let i = 0; i < objects.length; i++) {
      total += objects[i].value;
      if (objects[i].value > largest) {
        largest = objects[i].value;
      }
    }
    //console.log(largest)

    return ((largest / total) * 100).toFixed(1);
  };

  const getLargestExercise = (objects: any[]) => {
    let largestIndex = 0;
    let largest = 0;

    for (let i = 0; i < objects.length; i++) {
      if (objects[i].value > largest) {
        largest = objects[i].value;
        largestIndex = i;
      }
    }
    //console.log(largest)

    return largestIndex;
  };

  const calculatePercentage = (objects: any[], object: any) => {
    //console.log(objects)

    let total = 0;

    for (let i = 0; i < objects.length; i++) {
      total += objects[i].value;
    }

    return ((object.value / total) * 100).toFixed(1);
  };

  const limitString = (str: string, maxLength: number, useEllipsis: boolean) => {
    if (!str) {
      return str;
    }

    if (str.length <= maxLength) {
      return str;
    }

    const ellipsis = useEllipsis ? '...' : '';
    const limit = maxLength - ellipsis.length;

    return str.slice(0, limit) + ellipsis;
  };

  return (
    <>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: colors.text,
            marginBottom: 10,
          }}>
          Volume Distribution
        </Text>
        <PieChart
          data={graphTotalVolume}
          donut
          showGradient
          radius={screenWidth / 2 - 110}
          innerRadius={screenWidth / 2 - 135}
          innerCircleColor={'#f0f0f0'}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: colors.text}}>{calculateLargestPercentage(graphTotalVolume)}%</Text>
                <Text style={{fontSize: 14, color: colors.text}}>{limitString(props.labels[getLargestExercise(graphTotalVolume)], 11, true)}</Text>
              </View>
            );
          }}
        />
        <View style={{width: '100%', marginTop: 10}}>
          {graphTotalVolume.map((item, index) => (
            <View
              key={new BSON.ObjectId().toString()}
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: 5,
                paddingLeft: 5,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: props.coloursArray[index],
                    borderRadius: 10,
                    marginRight: 10,
                  }}></View>
                <Text style={{fontSize: 14, color: colors.text}}>{limitString(props.labels[index], 17, true)}</Text>
              </View>
              <Text>{calculatePercentage(graphTotalVolume, item)}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.container}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: colors.text,
            marginBottom: 10,
          }}>
          Reps Distribution
        </Text>
        <PieChart
          data={graphTotalReps}
          donut
          showGradient
          radius={screenWidth / 2 - 110}
          innerRadius={screenWidth / 2 - 135}
          innerCircleColor={'#f0f0f0'}
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: colors.text}}>{calculateLargestPercentage(graphTotalReps)}%</Text>
                <Text style={{fontSize: 14, color: colors.text}}>{limitString(props.labels[getLargestExercise(graphTotalReps)], 11, true)}</Text>
              </View>
            );
          }}
        />
        <View style={{width: '100%', marginTop: 10}}>
          {graphTotalReps.map((item, index) => (
            <View
              key={new BSON.ObjectId().toString()}
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: 5,
                paddingLeft: 5,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: props.coloursArray[index],
                    borderRadius: 10,
                    marginRight: 10,
                  }}></View>
                <Text style={{fontSize: 14, color: colors.text}}>{limitString(props.labels[index], 17, true)}</Text>
              </View>
              <Text>{calculatePercentage(graphTotalReps, item)}%</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
};
