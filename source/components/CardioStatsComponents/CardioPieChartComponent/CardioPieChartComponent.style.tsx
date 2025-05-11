import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  mainContainer: {
    width: screenWidth - 25,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  container: {
    width: (screenWidth - 40) / 2,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingBottom: 10,
    paddingTop: 20,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
});

export default styles;
