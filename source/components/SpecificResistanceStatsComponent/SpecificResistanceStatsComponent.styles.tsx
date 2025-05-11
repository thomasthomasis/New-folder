import {StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const styles = StyleSheet.create({
  container: {
    width: '95%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 5,
    padding: 10,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 25,
    textDecorationLine: 'underline',
    color: 'white',
    marginBottom: 10,
    marginRight: 10,
  },

  subTitle: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    marginBottom: 0,
  },

  text: {
    fontSize: 16,
    color: 'black',
  },

  stats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  border: {
    width: '98%',
    backgroundColor: 'black',
    height: 2,
    marginBottom: 10,
    marginTop: 5,
  },

  tinyBorder: {
    width: 75,
    backgroundColor: 'white',
    height: 1,
    marginBottom: 10,
    marginTop: 2,
    marginRight: 'auto',
    marginLeft: 'auto',
  },

  smallBorder: {
    width: '80%',
    backgroundColor: 'white',
    height: 1,
    marginBottom: 10,
    marginTop: 5,
    marginRight: 'auto',
    marginLeft: 'auto',
  },

  closeButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    backgroundColor: 'black',
  },

  containerCenter: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  flatlist: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },

  containerData: {
    backgroundColor: 'lightgray',
    width: '100%',
    borderRadius: 5,
    padding: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 10,
  },

  weightAndReps: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-evenly',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

export default styles;
