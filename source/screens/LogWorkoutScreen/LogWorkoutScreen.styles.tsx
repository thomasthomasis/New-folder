import { StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const styles = StyleSheet.create({

   
    container: {
      width: '97.5%',
      
      borderRadius: 20,
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingTop: 10,

      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },

    plus: {
      position: 'absolute',
      color: 'black',

      bottom: 0,
      right: 5,

      fontSize: 40,
    },

    gridOption: {
      width: '48%',
      aspectRatio: 1/1,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    circle: {
      width: '70%',
      aspectRatio: 1/1,
      borderRadius: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    image: {
      width: '70%',
      height: '70%',
      resizeMode: 'contain',
    },

    cardioContainer: {
      width: '97%',
      backgroundColor: colors.red,
      borderRadius: 10,
      padding: 10,
    },

    form: {
      width: 300,
      height: 400,
    },

    button: {
      width: 170,
      backgroundColor: 'lightgray',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },

    continueButton: {
      width: 190,
      backgroundColor: colors.blue,
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      marginRight: 'auto',
      marginLeft: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    buttonText: {
      fontWeight: '800',
      color: 'white',
      fontSize: 20,
    },

    logWorkoutButton:{
      width: 150,
      height: 40,
      backgroundColor: colors.blue,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },

    logWorkoutButtonText:{
      fontWeight: '800',
      color: 'white',
      fontSize: 20,
    },

    

    
    
  });

export default styles;