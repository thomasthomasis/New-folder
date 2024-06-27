import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    container: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      marginTop: 10,
    }, 

    button: {
        marginTop: 20, 
        backgroundColor: colors.blue, 
        width: 200, 
        height: 40, 
        borderRadius: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    addButton: {
        marginTop: 20, 
        backgroundColor: colors.blue, 
        width: 70, 
        height: 70, 
        borderRadius: 25,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        position: 'absolute',
        bottom: 20,
        right: 20,
    },

    buttonText: {
        fontWeight: '800',
        color: 'white',
        fontSize: 20,
    },

    eventCard: {
      width: screenWidth - 50,
      height: 100,
      borderRadius: 15,
      padding: 10,
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 15,
    },

    eventText: {
      color: 'white',
      fontWeight: '800',
      fontSize: 20,
    },

    eventRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    border: {
      width: '95%',
      backgroundColor: 'lightgray',
      height: 2,
      marginRight: 'auto',
      marginLeft: 'auto',
      marginTop: 5,
      marginBottom: 10,
    },

   
  });


export default styles;