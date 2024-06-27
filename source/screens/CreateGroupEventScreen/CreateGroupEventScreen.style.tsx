import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

  container: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 30,
    backgroundColor: 'white',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: 10,
    borderRadius: 20,
    marginBottom: 100,
},

    scrollView: {
      width: '100%',
      marginBottom: 200,
  },

  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
},

containerInput: {
  width: '95%',
},

inputTitle: {
  fontWeight: '500',
  fontSize: 18,
  marginBottom: 5,
  marginLeft: 5,
},

input: {
  borderWidth: 2,
  borderColor: 'gray',
  borderRadius: 15,
  marginBottom: 20,
  padding: 10,
},

textarea: {
  borderWidth: 2,
  borderColor: 'gray',
  borderRadius: 5,
  marginBottom: 10,
  padding: 10,
},

button: {
  width: 160,
  height: 45,
  backgroundColor: colors.green,
  borderRadius: 10,

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 'auto',
  marginLeft: 'auto',
},

buttonText: {
  fontSize: 20,
  color: 'white',
  fontWeight: '700',
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

check: {
  width: 40,
  height: 40,
  borderRadius: 40,
  marginRight: 10,

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
},

closeButtonText: {
  fontSize: 25,
  fontWeight: '800',
  color: 'white',
},

colorRow: {

},

color: {

},

selectedColour: {
  width: '100%',
  height: 40,
  borderRadius: 15,
  borderWidth: 1,
  borderColor: 'black',
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

  display: 'flex',
  alignItems: 'center',
},

addButton: {
  width: 200,
  height: 40,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'lightgray',
  borderRadius: 10,
  marginBottom: 10,
},

addButtonText: {
  fontWeight: '800',
  fontSize: 20,
},

containerLinks: {
  width: screenWidth - 70,
},

border: {
  width: screenWidth - 70,
  height: 2,
  backgroundColor: 'lightgray',
  marginBottom: 10,
  marginRight: 'auto',
  marginLeft: 'auto',
},

dateText: {
  marginBottom: 20,
  fontSize: 16,
},
datePickerStyle: {
  width: 200,
  marginTop: 20,
},
    
  });


export default styles;