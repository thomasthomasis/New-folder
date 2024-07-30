import { StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const styles = StyleSheet.create({
    
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        marginBottom: 10,
      },

      arrows: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 10,
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
        backgroundColor: 'lightgray',
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
        marginTop: 10,
        fontWeight: '800',
      },

      currentDay: {
        borderRadius: 100,
        backgroundColor: 'black',
        height: 50,
        width: 50,
      },

      currentDayText: {
        color: colors.green,

      },

      selectedDay: {
        backgroundColor: 'yellow',
      },

      title: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 10,
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

      dot: {
        width: 5,
        height: 5,
        backgroundColor: 'black',
        borderRadius: 5,
      }
    });

export default styles;