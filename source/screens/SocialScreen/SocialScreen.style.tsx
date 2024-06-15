import { StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const styles = StyleSheet.create({

    container: {
      width: '100%',
      height: '100%',
  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    button: {
      width: 170,
      height: 40,
      backgroundColor: colors.blue,
  
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  
      marginBottom: 10,
      borderRadius: 10,
    },
  
    groupButton: {
      width: 200,
      backgroundColor: colors.purple,
  
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  
      marginTop: 20,
      borderRadius: 10,
      padding: 10,
    },
  
    buttonText: {
      color: 'white',
      fontWeight: '800',
      fontSize: 25,
    },
  
    modalView: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      margin: 0,
  },
  
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
     
      
    });

export default styles;