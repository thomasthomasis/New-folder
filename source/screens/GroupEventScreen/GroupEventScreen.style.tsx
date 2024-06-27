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

    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 40,
      marginLeft: 10,

      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },

  headerTitle: {
      width: 150,
      paddingLeft: 15,
      fontSize: 20,
      fontWeight: '800',
  },


  closeButtonText: {
      fontSize: 25,
      fontWeight: '800',
      color: 'white',
  },

  column: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginRight: 10,
  },
    
  });


export default styles;