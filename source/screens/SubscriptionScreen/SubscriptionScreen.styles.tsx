import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

container: {
    width: '100%',
    minHeight: screenHeight,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
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

containerOption: {
    width: '90%',
    paddingTop: 30,
    paddingLeft: 30,
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: '#fafafa',
    borderRadius: 5,
    paddingBottom: 30,
    marginBottom: 40,
}
    
});


export default styles;