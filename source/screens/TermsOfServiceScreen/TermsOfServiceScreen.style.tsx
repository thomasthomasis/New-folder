import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: screenHeight,
    backgroundColor: 'white',
    display: 'flex',
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

  h1: {
    fontSize: 30,
    fontWeight: '900',
  },

  h2: {
    fontSize: 25,
    fontWeight: '700',
  },

  h3: {
    fontSize: 20,
    fontWeight: '500',
  },

  h4: {
    fontSize: 16,
    fontWeight: '400',
  },

  bold: {
    fontSize: 18,
    fontWeight: '900',
  },

  border: {
    width: '100%',
    height: 3,
    backgroundColor: 'lightgray',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

export default styles;
