import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

  header: {
    width: '100%', 
    height: 60, 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: 'lightgray',
    paddingBottom: 10,
  },

  headerText: {
    fontWeight: '900',
    fontSize: 25,
    marginLeft: 15,
  },

  headerImage: {
    marginTop: 10,
    width: 60,
    height: 60,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
  },

  container: {
    width: '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingTop: 10,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    backgroundColor: 'lightgray',
   
  },

  containerPieChart: {
    width: screenWidth - 30,
    backgroundColor: 'white',
    height: screenHeight - 110 - 200,
    borderRadius: 60,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    
    marginBottom: 20,


  },

  rowPieChart: {
    width: screenWidth - 70,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  pieChart: {
    height: screenHeight - 110 - 200 - 60,
    width: screenWidth - 40,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 60,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth - 30,
  },

  containerBarChart: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 40,
    height: screenHeight - 110 - (screenHeight - 250),
    width: screenWidth - 130,
  },

  logWorkoutButton:{
    width: 80,
    height: 80,
    backgroundColor: colors.blue,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80,
  },

  logWorkoutButtonText:{
    fontWeight: '800',
    color: 'white',
    fontSize: 20,
  },

    plus: {
      position: 'absolute',
      color: 'black',

      bottom: 0,
      right: 5,

      fontSize: 40,
    },

    gridOption: {
      width: '48%',
      aspectRatio: 1/1,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    circle: {
      width: '70%',
      aspectRatio: 1/1,
      borderRadius: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    image: {
      width: '70%',
      height: '70%',
      resizeMode: 'contain',
    },

    cardioContainer: {
      width: '97%',
      backgroundColor: colors.red,
      borderRadius: 10,
      padding: 10,
    },

    form: {
      width: 300,
      height: 400,
    },

    button: {
      width: 170,
      backgroundColor: 'lightgray',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },

    continueButton: {
      width: 190,
      backgroundColor: colors.blue,
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      marginRight: 'auto',
      marginLeft: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    buttonText: {
      fontWeight: '800',
      color: 'white',
      fontSize: 20,
    },

  containerModal: {
    width: '100%',
    height: 300,
    
    borderRadius: 20,
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingTop: 10,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  modalView: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    margin: 0,
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },

  modalHeader: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
  },

  modalHeaderText: {
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'left',
  },

  rowModal: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    


  },

    
    
  });

export default styles;