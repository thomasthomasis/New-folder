import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    container: {
      width: '100%',
      height: screenHeight,
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
      width: screenWidth,
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

  conatinerDates: {
    width: screenWidth - 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  dateText: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15,
  },

  border: {
    width: screenWidth - 40,
    height: 2,
    backgroundColor: 'lightgray',
    marginBottom: 20,
  },

  containerInterested: {
    width: screenWidth - 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 25,
  },

  icon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'lightgray',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },

  link: {
    padding: 15,
    height: 50,
    width: screenWidth - 50,
    backgroundColor: colors.blue,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
  },

  linkText: 
  {
    fontSize: 20,
    color: 'white',
    fontWeight: '800',
  },


  

  containerUsers: {
    width: screenWidth,
    height: 200,
    display: 'flex',
    alignItems: 'center',
  },

  usersAmount: {
    fontSize: 20,
    fontWeight: '800',
    width: 40,
    height: 40,
    borderRadius: 40,
    color: 'white',
    backgroundColor: colors.green,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  image: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 10,
  },

  profile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },

  username: {
    fontSize: 25,
    fontWeight: '800',

  },
    
  });


export default styles;