import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    container: {
      width: screenWidth,
      minHeight: screenHeight,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingBottom: 100,
    }, 

    headerTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.black,
    },
    
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginLeft: 10,
    
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    containerFilters: {
      width: screenWidth,
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingTop: 25,
      marginRight: 'auto',
      marginLeft: 'auto',
      backgroundColor: 'white',

    },
  
    filterButton: {
      width: '16%',
      height: 30,
      borderRadius: 20,
      backgroundColor: 'lightgray',
  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  
      marginRight: 2,
      marginLeft: 2,
    },
  
    filterButtonText: {
      color: 'white',
      fontWeight: '500',
      fontSize: 15,
    },

    card: {
      width: screenWidth - 25,
      borderRadius: 10,
      backgroundColor: '#f0f0f0',
      padding: 10,
      marginTop: 25,

      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }
    
  
    
  });


export default styles;