import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    mainContainer: {
      width: screenWidth - 20,
      backgroundColor: 'white',
      marginTop: 15,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 20,
      borderRadius: 25,
    },
    
    container: {
      width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        marginBottom: 10,
      },

      arrows: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '90%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
      },

      month: {
        fontWeight: '800',
        fontSize: 20,
        marginLeft: 20,
        marginRight: 20,
      },

      weekdays: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      weekday: {
        width: '14.28%', // 1/7th of the width for each day of the week
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'

      },

      currentWeekDay: {
        backgroundColor: '#e0e0e0',
        borderRadius: 0,
      },

      day: {
        width: '14.28%', // 1/7th of the width for each day of the week
        height: 1,
        aspectRatio: 1/1, // Ensure each day is square
        display: 'flex',
        alignItems: 'center',
        borderRadius: 10,
      },

      dayText: {
        fontSize: 16,
        marginTop: 15,
        fontWeight: '800',
      },

      currentDay: {
        position: 'absolute',
        width: '100%',
        aspectRatio: 1/1,
        borderWidth: 2,
        borderColor: colors.blue,
        borderRadius: 100,
      },

      currentDayText: {
        color: colors.text,
      },

      selectedDay: {
        backgroundColor: colors.blue,
        borderRadius: 50,
      },

      selectedDayText: {
        color: 'white',
      },

      title: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 10,
      },

      currentDayCircle: {
        position: 'absolute',
        width: '100%',
        aspectRatio: 1/1,
        backgroundColor: colors.blue,
        borderRadius: 100,
      },

      dots: {
        position: 'absolute',
        bottom: 5,
        width: '90%',
        marginRight: 'auto',
        marginLeft: 'auto',

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',

      },

      dotsUserStatus: {
        position: 'absolute',
        top: 2,
        width: '100%',
        height: 10,
        marginRight: 'auto',
        marginLeft: 'auto',

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        zIndex: 2,
      },

      dot: {
        width: 5,
        height: 5,
        backgroundColor: colors.blue,
        borderRadius: 5,
      },

      dotUserStatusInjured: {
        position: 'absolute',
        top: 8,
        width: '100%',
        height: 5,
        backgroundColor: colors.red,
        marginBottom: 2,
        borderRadius: 2,
        zIndex: 2,
      },

      dotUserStatusAway: {
        position: 'absolute',
        top: 1,
        width: '100%',
        paddingRight: 10,
        height: 5,
        backgroundColor: colors.orange,
        marginBottom: 2,
        borderRadius: 2,
        zIndex: 2,
      },
    });

export default styles;