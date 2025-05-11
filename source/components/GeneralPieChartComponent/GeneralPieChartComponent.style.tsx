import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingBottom: 10,
    flexDirection: 'column',
    width: screenWidth / 2 - 15,
    minHeight: screenWidth / 2 + 70,
  },
});

export default styles;
