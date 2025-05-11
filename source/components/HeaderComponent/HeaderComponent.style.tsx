import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';
import {common} from '../../sharedStyling/CommonStyle';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  header: {
    width: screenWidth,
    height: 32,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    marginTop: 16,
    marginBottom: 32,
  },

  headerImage: {
    width: 32,
    height: 32,
    borderRadius: 60,
    borderWidth: 2.5,
    borderColor: 'white',
    marginLeft: 10,
  },
});

export default styles;
