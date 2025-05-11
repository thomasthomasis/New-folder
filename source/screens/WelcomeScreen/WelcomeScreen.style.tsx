import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  viewWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: 'white',
    minHeight: screenHeight + 150,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    padding: 10,
    color: 'gray',
    textAlign: 'center',
  },
  mainButton: {
    width: 350,
    backgroundColor: colors.green,
  },
  secondaryButton: {
    color: colors.green,
  },

  input: {},

  button: {
    width: screenWidth - 50,
    height: 50,
    backgroundColor: colors.green,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 20,
    marginTop: 20,
  },

  border: {
    width: screenWidth / 3,
    height: 2,
    backgroundColor: 'lightgray',
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
});

export default styles;
