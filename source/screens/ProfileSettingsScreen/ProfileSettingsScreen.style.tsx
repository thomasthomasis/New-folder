import { StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const styles = StyleSheet.create({

    container: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -70,
    },

    information: {
        width: '90%', 
        padding: 20, 
        backgroundColor: '#f2f2f2', 
        marginTop: 20, 
        borderRadius: 20,
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
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 10,
    },

    title: {
        fontSize: 18,
    },

    image: {
        width: 150,
        height: 100,
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
        backgroundColor: colors.blue, 
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