import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    mainContainer: {
      width: screenWidth - 48,
      backgroundColor: 'white',
      borderRadius: 32,
    },
    
    container: {
      width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 16,
      },

      arrows: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 24,
        marginBottom: 12,
      },

      month: {
        fontWeight: '800',
        color: colors.text,
      },

      weekdays: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 4,
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
        paddingTop: 8,
        paddingBottom: 8,
      },

      currentDay: {
        position: 'absolute',
        top: 1,
        width: 32,
        aspectRatio: 1/1,
        borderWidth: 2,
        borderColor: colors.green,
        borderRadius: 100,
      },

      currentDayText: {
        color: colors.text,
      },

      selectedDay: {
        backgroundColor: colors.green,
        borderRadius: 50,
      },

      selectedDayText: {
        color: colors.white,
      },

      title: {
        textAlign: 'center',
        fontSize: 20,
      },

      currentDayCircle: {
        position: 'absolute',
        top: 1,
        width: 32,
        aspectRatio: 1/1,
        backgroundColor: colors.green,
        borderRadius: 100,
      },

      dots: {
        position: 'absolute',
        bottom: 8,
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
        width: 4,
        height: 4,
        backgroundColor: colors.green,
        borderRadius: 4,
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

      modalContent: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 20,
      },

      containerModal: {
        width: '100%',
        height: 250,
        
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginRight: 'auto',
        marginLeft: 'auto',
        paddingTop: 10,
    
        display: 'flex',
        flexDirection: 'column',
      },
    
      modalView: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        margin: 0,
      },
    
      modalHeader: {
        marginTop: 20,
        marginBottom: 20,
        paddingLeft: 24,
        paddingRight: 24,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
      },

      gridContainer: {
        width: screenWidth - 48,
        marginRight: 'auto',
        marginLeft: 'auto',
        display: 'flex',
        flexDirection: 'row',
        
        justifyContent: 'center',
      },

      gridColumn: {
        width: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },

      gridText: {
        marginTop: 8,
        marginBottom: 8,
      },


    });

export default styles;