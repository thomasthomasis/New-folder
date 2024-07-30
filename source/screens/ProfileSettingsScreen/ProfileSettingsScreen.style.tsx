import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    container: {
        width: screenWidth,
        height: screenHeight,
        flex: 1,
        marginTop: -70,
        justifyContent: 'center',
        alignItems: 'center',
    },

    header: {
      display: 'flex', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      width: '100%', marginTop: 10, 
      height: 60,
    },

    information: {
        width: screenWidth, 
        padding: 20, 
        backgroundColor: '#f2f2f2', 
        borderRadius: 20,
    },

    headerTitle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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

    smallBorder: {
        width: '100%',
        height: 2,
        backgroundColor: 'gray',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 15,
    },

    row: {
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        marginBottom: 10,
    },

    input: {
      fontSize: 18, 
      fontWeight: '600', 
      borderWidth: 2, 
      borderColor: 'lightgray', 
      padding: 10,
      borderRadius: 15,
      width: '95%',
      marginBottom: 10,
      color: colors.black,
    },

    inputTitle: {
      fontSize: 18, 
      fontWeight: '600', 
      color: '#bfc0be',
      marginBottom: 5,
      marginLeft: 3,
    },

    title: {
        fontSize: 18,
    },

    image: {
      width: 100, 
      height: 100, 
      borderRadius: 100, 
      padding: 15,
      marginBottom: 10,
    },

    modalView: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      margin: 0,
    },

    modalContent: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 20,
    },

      modalText: {
        marginBottom: 20,
        fontSize: 18,
      },
    
      titleButton: {
        width: 150,
        height: 40,
        backgroundColor: colors.green, 
        borderRadius: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },

      titleButtonText: {
        fontWeight: '800',
        fontSize: 20,
        color: 'white',
      }
    
})

export default styles;