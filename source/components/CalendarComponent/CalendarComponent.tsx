import React, {useState, useEffect} from 'react';
import {Dimensions, FlatList, ScrollView, Text, View} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {useQuery, useRealm, useUser} from '@realm/react';
import {Workouts} from '../../schemas/WorkoutSchema';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './CalendarComponent.style';
import {shadow} from '../../sharedStyling/Shadow';
import {common} from '../../sharedStyling/CommonStyle';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {Dropdown} from 'react-native-element-dropdown';

type CalendarProps = {
  setWorkouts: any;
};

export const CalendarComponent = (props: CalendarProps) => {
  const realm = useRealm();
  const user = useUser();
  const isFocused = useIsFocused();

  const currentDate = new Date();
  let currentDay = currentDate.toISOString().split('T')[0].split('-')[2];
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth());
  const [daysStatus, setDaysStatus] = useState<any[]>([]);
  const [daysStatusDates, setDaysStatusDates] = useState<any[]>([]);
  const [calendarDays, setCalendarDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('none');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let monthWord = monthNames[month];

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const [workouts, setWorkouts] = useState<any>(realm.objects(Workouts).sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1 && userId == $2', startOfMonth, endOfMonth, user.id));

  useEffect(() => {
    let workouts = realm.objects(Workouts).sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1 AND userId == $2', startOfMonth, endOfMonth, user.id);
    setWorkouts(workouts);
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  const selectDay = (day: string) => {
    console.log(day);

    if (day == selectedDay) {
      const date = new Date(year, month, 1);

      let startOfMonth = date;
      let endOfMonth = new Date(year, month + 1, 0);

      let workouts = realm.objects(Workouts).sorted('dateCreated', true).filtered('dateCreated >= $0 AND dateCreated < $1 AND userId == $2', startOfMonth, endOfMonth, user.id);
      props.setWorkouts(workouts);

      setSelectedDay('none');
    } else {
      const startOfDay = new Date(year, month, parseInt(day), 0, 0, 0, 0); // Start of the specific day
      const endOfDay = new Date(year, month, parseInt(day), 23, 59, 59, 999); // End of the specific day

      const workoutsOfDay = realm.objects(Workouts).filtered('dateCreated >= $0 AND dateCreated < $1 AND userId == $2', startOfDay, endOfDay, user.id);

      props.setWorkouts(workoutsOfDay);
      setSelectedDay(day);
    }
  };

  const selectMonth = (month: number, year: number) => {
    if (month == -1) {
      getCalendarDays(1, year - 1);
      setYear(year - 1);
      setMonth(11);
    } else if (month == 12) {
      getCalendarDays(0, year + 1);
      setYear(year + 1);
      setMonth(0);
    } else {
      getCalendarDays(month, year);
      setMonth(month);
    }

    setSelectedDay('');
  };

  const selectYear = (year: number) => {
    getCalendarDays(month, year);
    setYear(year);
    setSelectedDay('');
  };

  useEffect(() => {
    let numDaysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayOfWeek = new Date(year, month, 0).getDay();

    //console.log("Days in Month: ", numDaysInMonth)
    //console.log("First Day of Week: ", firstDayOfWeek)

    let days: string[] = [];

    let numDaysOfPreviousMonth = new Date(year, month - 1, 0).getDate();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push((numDaysOfPreviousMonth - (firstDayOfWeek - 1) + i).toString() + '+extraDay');
    }
    for (let i = 1; i <= numDaysInMonth; i++) {
      days.push(i.toString());
    }

    if (days.length <= 35) {
      let counter = 1;
      for (let i = days.length; i < 35; i++) {
        days.push(counter.toString() + '+extraDay');
        counter++;
      }
    } else {
      let counter = 1;
      for (let i = days.length; i < 42; i++) {
        days.push(counter.toString() + '+extraDay');
        counter++;
      }
    }

    //console.log(days)
    setCalendarDays(days);
  }, []);

  const getCalendarDays = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    //console.log("month: ", date.toLocaleString())

    let startOfMonth = date;
    let endOfMonth = new Date(year, month + 1, 0);

    let workouts = realm.objects(Workouts).sorted('dateCreated', true).filtered('dateCreated >= $0 AND dateCreated < $1 AND userId == $2', startOfMonth, endOfMonth, user.id);
    setWorkouts(workouts);
    props.setWorkouts(workouts);

    let numDaysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayOfWeek = new Date(year, month, 0).getDay();

    let days: string[] = [];

    let numDaysOfPreviousMonth = new Date(year, month - 1, 0).getDate();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push((numDaysOfPreviousMonth - (firstDayOfWeek - 1) + i).toString() + '+extraDays');
    }
    for (let i = 1; i <= numDaysInMonth; i++) {
      days.push(i.toString());
    }

    if (days.length <= 35) {
      let counter = 1;
      for (let i = days.length; i < 35; i++) {
        days.push(counter.toString() + '+extraDay');
        counter++;
      }
    } else {
      let counter = 1;
      for (let i = days.length; i < 42; i++) {
        days.push(counter.toString() + '+extraDay');
        counter++;
      }
    }

    //console.log(days)
    setCalendarDays(days);

    return days;
  };

  const extractDayAndWorkoutType = (data: any): any[] => {
    return data.map((item: any) => {
      const dayNumber = new Date(item.dateCreated).getDate(); // Extract day number from the date
      return {dayNumber, userStatus: item.userStatus};
    });
  };

  useEffect(() => {
    const result = extractDayAndWorkoutType(workouts);

    const dayNumbers = result.map(item => item.dayNumber.toString());
    const userStatuses = result.map(item => item.userStatus);

    let newUserStatuses = [];

    for (let i = 1; i <= 31; i++) {
      if (dayNumbers.includes(i.toString())) {
        let index = dayNumbers.indexOf(i.toString());
        newUserStatuses.push(userStatuses[index]);
      } else {
        newUserStatuses.push('');
      }
    }

    setDaysStatus(newUserStatuses);
    setDaysStatusDates(dayNumbers);
  }, [workouts, isFocused]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Workouts));
    });
  }, [realm, user]);

  return (
    <>
      <View style={[styles.mainContainer, shadow.shadow]}>
        <View style={[styles.arrows, common.conatinerInnerPadding]}>
          <TouchableOpacity onPress={() => selectMonth(month - 1, year)}>
            <MaterialCommunityIcons name="chevron-left" color={colors.text} size={24} />
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={[styles.month, common.h2, {marginRight: 10}]}>
              {monthWord} {year}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <MaterialCommunityIcons name="calendar-outline" color={colors.text} size={24} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => selectMonth(month + 1, year)}>
            <MaterialCommunityIcons name="chevron-right" color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
        <View style={[styles.weekdays, common.containerOuterPadding]}>
          <View style={styles.weekday}>
            <Text style={[{color: colors.text}, common.h2]}>M</Text>
          </View>
          <View style={styles.weekday}>
            <Text style={[{color: colors.text}, common.h2]}>T</Text>
          </View>
          <View style={styles.weekday}>
            <Text style={[{color: colors.text}, common.h2]}>W</Text>
          </View>
          <View style={styles.weekday}>
            <Text style={[{color: colors.text}, common.h2]}>T</Text>
          </View>
          <View style={styles.weekday}>
            <Text style={[{color: colors.text}, common.h2]}>F</Text>
          </View>
          <View style={styles.weekday}>
            <Text style={[{color: colors.text}, common.h2]}>S</Text>
          </View>
          <View style={styles.weekday}>
            <Text style={[{color: colors.text}, common.h2]}>S</Text>
          </View>
        </View>
        <View style={[styles.container, common.containerOuterPadding]}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity key={index} style={[styles.day, day.includes('+extraDay') && {pointerEvents: 'none'}]} onPress={() => selectDay(day.toString())}>
              <View style={styles.dots}>{daysStatusDates.includes(day) && <View style={styles.dot}></View>}</View>

              <View style={styles.dotsUserStatus}>
                {daysStatus[index] == 'Injured' && <View style={styles.dotUserStatusInjured}></View>}
                {daysStatus[index] == 'Away' && <View style={styles.dotUserStatusAway}></View>}
              </View>

              {selectedDay == day.toString() && <View style={styles.currentDayCircle}></View>}

              {currentDay == day && month == currentMonth && year == currentYear && <View style={styles.currentDay}></View>}

              <Text style={[common.h3, currentDay == day && month == currentMonth && styles.currentDayText, day.includes('+extraDay') && {color: colors.unselectedItem}, selectedDay == day && month == currentMonth && year == currentYear && styles.selectedDayText]}>
                {day.includes('+extraDay') && day.split('+')[0].length == 1 && '0' + day.split('+')[0]}
                {day.includes('+extraDay') && day.split('+')[0].length > 1 && day.split('+')[0]}
                {(day.length == 1 && '0' + day) || ''}
                {(day.length == 2 && day) || ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal isVisible={modalVisible} onBackdropPress={closeModal} swipeDirection={['down']} onSwipeComplete={closeModal} style={styles.modalView}>
        <View style={styles.modalContent}>
          <View style={styles.containerModal}>
            <View style={styles.modalHeader}>
              <Text style={[common.h1, {textAlign: 'center'}]}>Select a Date</Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginBottom: 24,
              }}>
              <TouchableOpacity onPress={() => selectYear(year - 1)}>
                <MaterialCommunityIcons name="chevron-left" color={colors.text} size={24} />
              </TouchableOpacity>

              <Text style={[styles.month, common.h2, {marginRight: 10}]}>{year}</Text>

              <TouchableOpacity onPress={() => selectYear(year + 1)}>
                <MaterialCommunityIcons name="chevron-right" color={colors.text} size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.gridContainer}>
              <View style={[styles.gridColumn, {alignItems: 'flex-start'}]}>
                <TouchableOpacity onPress={() => selectMonth(0, year)}>
                  <Text style={[common.h3, styles.gridText]}>Jan</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectMonth(4, year)}>
                  <Text style={[common.h3, styles.gridText]}>May</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectMonth(8, year)}>
                  <Text style={[common.h3, styles.gridText]}>Sep</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.gridColumn, {alignItems: 'center'}]}>
                <TouchableOpacity onPress={() => selectMonth(1, year)}>
                  <Text style={[common.h3, styles.gridText]}>Feb</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectMonth(5, year)}>
                  <Text style={[common.h3, styles.gridText]}>Jun</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectMonth(9, year)}>
                  <Text style={[common.h3, styles.gridText]}>Oct</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.gridColumn, {alignItems: 'center'}]}>
                <TouchableOpacity onPress={() => selectMonth(2, year)}>
                  <Text style={[common.h3, styles.gridText]}>Mar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectMonth(6, year)}>
                  <Text style={[common.h3, styles.gridText]}>Jul</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectMonth(10, year)}>
                  <Text style={[common.h3, styles.gridText]}>Nov</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.gridColumn, {alignItems: 'flex-end'}]}>
                <TouchableOpacity onPress={() => selectMonth(3, year)}>
                  <Text style={[common.h3, styles.gridText]}>Apr</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectMonth(7, year)}>
                  <Text style={[common.h3, styles.gridText]}>Aug</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectMonth(11, year)}>
                  <Text style={[common.h3, styles.gridText]}>Dec</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
