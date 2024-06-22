import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
 
    container: {
      display: 'flex',
      alignItems: 'center',
        marginBottom: 10,
    },

    expandButton: {
        position: 'absolute',
        top: 0,
        right: 20,
    },

    subtitle: {
        textAlign: 'center',
        fontSize: 20,
    },

    smallBorder: {
        width: 100,
        height: 2,
        backgroundColor: 'gray',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 10,
    },

    text: {
        textAlign: 'center',
        fontSize: 20,
    },

    pagerView: {
        flex: 1,
        width: '100%', // Adjust width as needed
        height: 1000,
        backgroundColor: 'red',
      },
    
    pageVisualiser: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 5,
    marginTop: 10,

    marginRight: 'auto',
    marginLeft: 'auto',
    },

    bar: {
    width: '50%',
    backgroundColor: 'white',
    height: 40,
    borderRadius: 40,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    },
    
     
       
  });

export default styles;