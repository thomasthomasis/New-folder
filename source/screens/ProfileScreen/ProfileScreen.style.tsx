import { StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const styles = StyleSheet.create({

    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
    }, 
  
    information: {
      width: '100%',
      height: 200,
      backgroundColor: colors.blue,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  
    profilePictureContainer: {
      width: 120,
      aspectRatio: 1,
      borderRadius: 100,
      backgroundColor: 'black',
  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  
      marginRight: 10,
    },
  
    name: {
      color: 'black',
      fontSize: 25,
      fontWeight: '800',
    },
  
    username: {
      color: 'purple',
      fontSize: 20,
      fontWeight: '800',
    },
  
    title: {
      fontSize: 18,
      color: 'lightgray',
      marginBottom: 10,
    },
  
    smallBorder: {
      width: '85%',
      height: 2,
      backgroundColor: 'gray',
      marginBottom: 10,
    },
  
    buttons: {
      width: '80%',
      height: 200,
      display: 'flex',
      flexDirection: 'column',
  
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
  
    button: {
      display: 'flex',
      flexDirection: 'row',
      width: '90%',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 50,
      borderRadius: 15,
      borderWidth: 1.2,
      borderColor: 'gray',
      padding: 10,
    },
  
    profilePictureOptions: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    imageContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    image: {
      height: 100,
      width: '90%',
      resizeMode: 'contain',
      marginBottom: 10,
  
    },
  
    backButton: {
      width: 40,
      height: 40,
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 30,
  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    profileInfo: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  
  progressContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  
  },
  
  levelProgressContainer: {
      height: 2,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
  
  bar: {
      height: 4,
      borderRadius: 5,
  },
  
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue,
    
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  
    margin: 5,
  },
  
  circleText: {
    fontWeight: '800',
    color: 'white',
  },
  
    
  });


export default styles;