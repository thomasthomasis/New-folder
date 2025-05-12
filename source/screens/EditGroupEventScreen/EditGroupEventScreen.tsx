import React, {useState, useEffect} from 'react';
import {Alert, Text, View, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import {useRealm, useUser} from '@realm/react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './EditGroupEventScreen.style';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {RouteProp} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {colors} from '../../sharedStyling/Colors';
import {GroupEvents} from '../../schemas/GroupEventsScehma';
import {BSON} from 'realm';
import {shadow} from '../../sharedStyling/Shadow';
import DateTimePicker from '@react-native-community/datetimepicker';

type EditGroupEventScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EditGroupEvent'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'EditGroupEvent'>;
};

export const EditGroupEventScreen = ({navigation, route}: EditGroupEventScreenProps) => {
  const realm = useRealm();
  const user = useUser();

  const {eventId} = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const [event, setEvent] = useState<any>(null);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [color, setColor] = useState<string>('');
  const [isTraining, setisTraining] = useState<boolean>(true);
  const [inputPairs, setInputPairs] = useState<InputPair[]>([]);

  const [showDatePickerStartDate, setShowDatePickerStartDate] = useState<boolean>(false);
  const [showDatePickerStartTime, setShowDatePickerStartTime] = useState<boolean>(false);

  const [showDatePickerEndDate, setShowDatePickerEndDate] = useState<boolean>(false);
  const [showDatePickerEndTime, setShowDatePickerEndTime] = useState<boolean>(false);

  useEffect(() => {
    let event = realm.objects(GroupEvents).filtered('eventId == $0', eventId);

    setEvent(event);
    setName(event[0].name ?? '');
    setStartDate(event[0].startDate ?? new Date());
    setEndDate(event[0].endDate ?? new Date());
    setisTraining(event[0].isTraining ?? true);
    setColor(event[0].color ?? colors.purple);

    let inputPairs: InputPair[] = [];
    for (let i = 0; i < event[0].links.length; i++) {
      inputPairs.push({
        input1: event[0].linkTitles[i],
        input2: event[0].links[i],
      });
    }

    console.log(inputPairs);

    setInputPairs(inputPairs);
  }, [eventId, realm]);

  type InputPair = {
    input1: string;
    input2: string;
  };

  // Handler to add a new pair of input fields
  const addInputPair = () => {
    setInputPairs([...inputPairs, {input1: '', input2: ''}]);
  };

  // Handler to handle text input changes
  const handleInputChange = (text: string, index: any, inputKey: any) => {
    const newInputPairs: any = [...inputPairs];
    newInputPairs[index][inputKey] = text;
    setInputPairs(newInputPairs);
  };

  // Handler to remove a pair of input fields
  const removeInputPair = (index: any) => {
    const newInputPairs = inputPairs.filter((_, i) => i !== index);
    setInputPairs(newInputPairs);
  };

  const onChangeStartDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;

    // Run your function here based on event.type === "set" (OK button pressed)
    if (event.type === 'set') {
      // Call your function here
      console.log('Selected date:', currentDate);
      setShowDatePickerStartDate(false);
      setShowDatePickerStartTime(true);
      setStartDate(currentDate);
      setEndDate(currentDate);
    }

    if (event.type === 'dismissed') {
      setShowDatePickerStartDate(false);
      setShowDatePickerStartTime(false);
    }

    console.log(currentDate);
    console.log(event);
  };

  const onChangeStartTime = (event: any, selectedTime: any) => {
    const currentDate = selectedTime;

    // Run your function here based on event.type === "set" (OK button pressed)
    if (event.type === 'set') {
      // Call your function here
      console.log('Selected time:', currentDate);
      setShowDatePickerStartTime(false);
      setStartTime(currentDate);
      setEndTime(currentDate);
    }

    if (event.type === 'dismissed') {
      setShowDatePickerStartDate(false);
      setShowDatePickerStartTime(false);
    }

    console.log(currentDate);
  };

  const onChangeEndDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;

    // Run your function here based on event.type === "set" (OK button pressed)
    if (event.type === 'set') {
      // Call your function here
      console.log('Selected date:', currentDate);
      setShowDatePickerEndDate(false);
      setShowDatePickerEndTime(true);
      setEndDate(currentDate);
    }

    if (event.type === 'dismissed') {
      setShowDatePickerEndDate(false);
      setShowDatePickerEndTime(false);
    }

    console.log(currentDate);
    console.log(event);
  };

  const onChangeEndTime = (event: any, selectedTime: any) => {
    const currentDate = selectedTime;

    // Run your function here based on event.type === "set" (OK button pressed)
    if (event.type === 'set') {
      // Call your function here
      console.log('Selected time:', currentDate);
      setShowDatePickerEndTime(false);
      setEndTime(currentDate);
    }

    if (event.type === 'dismissed') {
      setShowDatePickerEndDate(false);
      setShowDatePickerEndTime(false);
    }

    console.log(currentDate);
  };

  const calculateStartDateAndTime = (date: Date, time: Date) => {
    // Extract date parts from date1
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Extract time parts from timeDate
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    // Create a new Date object with combined date and time
    const combinedDateTime = new Date(year, month, day, hours, minutes, seconds, milliseconds);

    return combinedDateTime;
  };

  const formatDateTime = (date: Date) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = monthsOfYear[date.getMonth()];
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    // Format the day of the month with "st", "nd", "rd", or "th"
    let daySuffix;
    if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) {
      daySuffix = 'st';
    } else if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) {
      daySuffix = 'nd';
    } else if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) {
      daySuffix = 'rd';
    } else {
      daySuffix = 'th';
    }

    // Construct the formatted date string
    const formattedDate = `${dayOfWeek} ${dayOfMonth}${daySuffix} ${month} ${hours}:${minutes.toString().padStart(2, '0')}${period}`;

    return formattedDate;
  };

  // State to hold the list of text input values

  const colorsArray = [
    {color: colors.red, light: '#FF7F7F', dark: '#920f0a'}, // Light Red, Dark Red
    {color: '#ec9513', light: '#f6cc8e', dark: '#c37b10'}, // Light Orange, Dark Orange
    {color: '#f1f627', light: '#f8fb94', dark: '#b2b707'}, // Light Yellow, Dark Yellow
    {color: colors.green, light: '#90EE90', dark: '#1c8721'}, // Light Green, Dark Green
    {color: colors.green, light: '#ADD8E6', dark: '#2639be'}, // Light Blue, Dark Blue
    {color: colors.purple, light: '#D8BFD8', dark: '#9c27a0'}, // Light Purple, Dark Purple
    {color: colors.pink, light: '#f1abdf', dark: '#db2dae'}, // Light Pink, Dark Pink
  ];

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onClose = () => {
    setModalVisible(false);
  };

  const editGroupEvent = (name: string, startDate: Date, endDate: Date, color: string, isTraining: boolean) => {
    if (startDate > endDate) {
      Alert.alert('The end date cannot be before the start date!');
      return;
    }

    const linkTitles: string[] = [''];
    const links: string[] = [''];

    inputPairs.forEach(pair => {
      linkTitles.push(pair.input1);
      links.push(pair.input2);
    });

    realm.write(() => {
      event[0].name = name;
      event[0].startDate = startDate;
      event[0].endDate = endDate;
      event[0].color = color;
      event[0].isTraining = isTraining;
      event[0].links = links;
      event[0].linkTitles = linkTitles;
    });

    // Show success message or navigate to another screen
    goBack();
  };

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(GroupEvents));
    });
  }, [realm, user]);

  const handleSubmit = () => {
    // Create the group (implement this logic as needed)
    editGroupEvent(name, calculateStartDateAndTime(startDate, startTime), calculateStartDateAndTime(endDate, endTime), color, isTraining);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View
        style={{
          width: '100%',
          height: 60,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={styles.headerTitle}>
          <TouchableOpacity onPress={goBack} style={styles.closeButton}>
            <MaterialCommunityIcons name="arrow-left" size={40} />
          </TouchableOpacity>
          <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20}}>Edit Event</Text>
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.check}>
          <MaterialCommunityIcons name="check" size={40} />
        </TouchableOpacity>
      </View>

      {showDatePickerStartDate && (
        <DateTimePicker
          testID="datePicker"
          value={startDate}
          mode="date" // Change this to 'time' for a time picker
          display="default"
          onChange={onChangeStartDate}
        />
      )}
      {showDatePickerStartTime && (
        <DateTimePicker
          testID="timePicker"
          value={startTime}
          mode="time" // Change this to 'time' for a time picker
          display="default"
          is24Hour={true}
          onChange={onChangeStartTime}
        />
      )}
      {showDatePickerEndDate && (
        <DateTimePicker
          testID="datePicker"
          value={endDate}
          mode="date" // Change this to 'time' for a time picker
          display="default"
          onChange={onChangeEndDate}
        />
      )}
      {showDatePickerEndTime && (
        <DateTimePicker
          testID="timePicker"
          value={endTime}
          mode="time" // Change this to 'time' for a time picker
          display="default"
          is24Hour={true}
          onChange={onChangeEndTime}
        />
      )}

      <View style={[styles.container, shadow.shadow]}>
        <View style={styles.containerInput}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput value={name} onChangeText={text => setName(text)} placeholder="Enter group name" style={styles.input} />
        </View>

        <View style={styles.border}></View>

        <View
          style={[
            styles.containerInput,
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 15,
            },
          ]}>
          <TouchableOpacity
            onPress={() => setisTraining(true)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={[styles.option, isTraining && {backgroundColor: colors.black}, {marginRight: 5}]}></View>
            <Text style={styles.optionText}>Training</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setisTraining(false)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={[styles.option, !isTraining && {backgroundColor: colors.black}, {marginRight: 5}]}></View>
            <Text style={styles.optionText}>Tournament</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.border}></View>

        <View style={styles.containerInput}>
          <Text style={styles.inputTitle}>Start Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setShowDatePickerStartDate(true);
              console.log('showing date picker');
            }}>
            <Text>{formatDateTime(calculateStartDateAndTime(startDate, startTime))}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.inputTitle}>End Date</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePickerEndDate(true)}>
            <Text>{formatDateTime(calculateStartDateAndTime(endDate, endTime))}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.border}></View>

        {inputPairs.map((inputPair, index) => {
          if (inputPair.input1 == '' && inputPair.input2 == '') {
            return null;
          }

          return (
            <View key={index} style={styles.containerLinks}>
              <View style={[styles.containerInput, {width: '100%', marginBottom: 0}]}>
                <Text style={styles.inputTitle}>Link Title</Text>
                <TextInput value={inputPair.input1} onChangeText={text => handleInputChange(text, index, 'input1')} placeholder="Enter group name" style={[styles.input, {marginBottom: 0}]} />
              </View>

              <View style={[styles.containerInput, {width: '100%'}]}>
                <Text style={styles.inputTitle}>Link</Text>
                <TextInput value={inputPair.input2} onChangeText={text => handleInputChange(text, index, 'input2')} placeholder="Enter group name" style={styles.input} />
              </View>
              <TouchableOpacity onPress={() => removeInputPair(index)} style={[styles.addButton, {marginRight: 'auto', marginLeft: 'auto'}]}>
                <Text style={[styles.addButtonText, {fontWeight: '500'}]}>Remove Link</Text>
              </TouchableOpacity>
              <View style={styles.border}></View>
            </View>
          );
        })}
        <TouchableOpacity onPress={addInputPair} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Link</Text>
        </TouchableOpacity>

        <View style={styles.containerInput}>
          <Text style={styles.inputTitle}>Select Colour</Text>
          <TouchableOpacity style={[styles.selectedColour, {backgroundColor: color}, shadow.shadow]} onPress={() => setModalVisible(true)}></TouchableOpacity>
        </View>
      </View>

      <Modal isVisible={modalVisible} swipeDirection={['down']} onSwipeComplete={onClose} onBackdropPress={onClose} style={styles.modalView}>
        <View style={styles.modalContent}>
          {colorsArray.map(item => (
            <View
              key={new BSON.ObjectID().toString()}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '90%',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                style={{
                  width: '33%',
                  height: 50,
                  borderRadius: 15,
                  backgroundColor: item.light,
                  marginLeft: 2.5,
                  marginRight: 2.5,
                }}
                onPress={() => {
                  setColor(item.light);
                  onClose();
                }}></TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '33%',
                  height: 50,
                  borderRadius: 15,
                  backgroundColor: item.color,
                  marginLeft: 2.5,
                  marginRight: 2.5,
                }}
                onPress={() => {
                  setColor(item.color);
                  onClose();
                }}></TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '33%',
                  height: 50,
                  borderRadius: 15,
                  backgroundColor: item.dark,
                  marginLeft: 2.5,
                  marginRight: 2.5,
                }}
                onPress={() => {
                  setColor(item.dark);
                  onClose();
                }}></TouchableOpacity>
            </View>
          ))}
        </View>
      </Modal>
    </ScrollView>
  );
};
