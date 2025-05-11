import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: screenHeight,
    backgroundColor: colors.background,
    display: 'flex',
    alignItems: 'center',
    padding: 10,
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

  row: {
    width: screenWidth,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },

  option: {
    width: 32,
    height: 32,
    borderWidth: 3,
    borderColor: colors.text,
    borderRadius: 32,
    marginLeft: 10,
  },
});

export default styles;
