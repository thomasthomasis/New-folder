import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    height: 96,
    paddingBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,
    backgroundColor: colors.white,

    position: 'relative',
    zIndex: 5,
  },

  flatListContainer: {
    display: 'flex',
  },

  flatlist: {
    flexGrow: 0,
  },

  setHeader: {
    width: screenWidth,
    paddingLeft: 16,
    paddingRight: 8,
    marginTop: 16,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  addSetButton: {
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 154,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.green,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  weightInputContainer: {
    width: screenWidth,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },

  input: {
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth - 134,
    height: 56,
    borderRadius: 16,
    paddingLeft: 24,
    marginLeft: 24,
    marginRight: 8,
  },

  weightType: {
    width: 56,
    height: 56,
    backgroundColor: colors.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
});

export default styles;
