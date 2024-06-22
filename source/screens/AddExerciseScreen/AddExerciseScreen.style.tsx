import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

    muscleChoice: {
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 5,
        marginTop: 5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    
        flexDirection: 'row',
      },
    
      checkbox: {
        backgroundColor: 'gray',
        height: 50,
        width: 150,
        borderRadius: 10,
        padding: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },

      checkBoxText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 20,
      },
    
      borderBottom: {
        width: '90%',
        height: 2,
        backgroundColor: 'lightgray',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 10,
      }
})

export default styles;