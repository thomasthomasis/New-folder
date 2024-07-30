import { StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const styles = StyleSheet.create({
    container: {
      width: '100%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: "#f2f2f2",
      marginTop: -30,
      height: '100%',
    },
  
    header: {
      display: 'flex', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      width: '100%', 
      paddingTop: 10, 
      paddingBottom: 50, 
      backgroundColor: colors.black,
    },
  
    form: {
      padding: 10,
      marginBottom: 10,
      borderBottomWidth: 2, 
      borderBottomColor: 'black',
    },
  
    exercise: {
      textAlign: 'center',
      fontSize: 20,
      paddingTop: 5,
      fontWeight: '700',
    },
  
    smallBorder: {
      width: 130,
      height: 2,
      backgroundColor: 'lightgray',
      marginRight: 'auto',
      marginLeft: 'auto',
      marginBottom: 20,
    },
  
    row: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
  
      marginBottom: 0,
    },
  
    rowButtons: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
  
      marginBottom: 10,
      marginTop: 30,
    },
  
    inputs: {
      width: '90%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
  
    inputBoxes: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
  
      marginRight: 70,
    },
  
    inputContainer: {
      width: 50,
      marginLeft: 5,
      marginRight: 5,
      display: 'flex',
      flexDirection: 'column',
  
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    input: {
      backgroundColor: 'lightgray',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      width: '100%',
      fontSize: 23,
      fontWeight: '800',
      textAlign: 'center',
      padding: 0,
      height: 35,
    },
  
    removeButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 30,
      width: 30,
      marginLeft: 30,
    },
  
    removeButton: {
      backgroundColor: 'lightgray',
      borderWidth: 1,
      borderColor: 'gray',
      height: 35,
      width: 40,
      borderRadius: 3,
  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    addButton: {
      width: 120,
      backgroundColor: 'lightgray',
      borderRadius: 5,
      height: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 'auto',
      marginLeft: 'auto',
      marginBottom: 5,
    },
  
    button: {
      width: 150,
      backgroundColor: 'lightgray',
      borderRadius: 5,
      height: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 'auto',
      marginLeft: 'auto',
      marginBottom: 100,
      marginTop: 10,
    },
  
    submitButton: {
      width: 200,
      height: 50,
      backgroundColor: colors.green,
      borderRadius: 15,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 'auto',
      marginLeft: 'auto',
      marginBottom: 5,
    },
  
    containerAccordion: {
      width: '100%',
    },
  
    accordionHeader: {
      width: '80%',
      backgroundColor: 'white',
  
      marginLeft: 'auto',
      marginRight: 'auto',
  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 12,
      borderWidth: 1,
      borderColor: 'black',
    },
  
    accordionHeaderText: {
      fontSize: 20,
      fontWeight: '800',
      color: 'black',
    },
  
    accordionContent: {
      width: '80%',
      backgroundColor: colors.green,
  
      marginLeft: 'auto',
      marginRight: 'auto',
  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 12,
      borderWidth: 1,
      borderColor: 'black',
    },
  
    accordionContentText: {
      fontSize: 18,
      color: 'white',
    },

    modalView: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      margin: 0,
    },

    modalContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 20,
    },
      

    modalButton: {
      width: 170,
      height: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.green,
      marginBottom: 10,
      borderRadius: 15,
    },

    modalButtonText: {
      fontWeight: '800',
      color: 'white',
      fontSize: 20,
    }

  
    });

export default styles;