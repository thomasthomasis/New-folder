import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

  mainContainer: {
    width: screenWidth - 20,
    backgroundColor: 'white',

  },

  container: {
    width: screenWidth - 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingBottom: 10,
    paddingTop: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,

  },

  legendContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  legendItem: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  legendText: {
    fontSize: 14,
  },
 
    
  });


export default styles;