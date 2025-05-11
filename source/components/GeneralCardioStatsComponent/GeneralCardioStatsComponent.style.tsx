import {StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },

  containerStats: {
    width: '95%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.red,
    borderRadius: 5,
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    textDecorationLine: 'underline',
  },

  text: {
    fontSize: 20,
  },

  closeButton: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    backgroundColor: 'black',
    top: 0,
    right: 0,
  },

  expandButton: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
});

export default styles;
