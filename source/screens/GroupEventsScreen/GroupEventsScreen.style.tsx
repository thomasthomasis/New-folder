import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
  },

  scrollView: {
    minHeight: screenHeight - 150,
  },

  button: {
    marginTop: 20,
    backgroundColor: colors.green,
    width: 200,
    height: 40,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: colors.green,
    width: 70,
    height: 70,
    borderRadius: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontWeight: '800',
    color: 'white',
    fontSize: 20,
  },

  eventCard: {
    width: screenWidth - 50,
    height: 100,
    borderRadius: 15,
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 15,
    marginRight: 'auto',
    marginLeft: 'auto',
  },

  eventText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 20,
  },

  eventRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  border: {
    width: '95%',
    backgroundColor: 'lightgray',
    height: 2,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 5,
    marginBottom: 10,
  },

  filters: {
    marginTop: 0,
    marginBottom: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
    width: screenWidth - 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  filterButton: {
    width: '25%',
    height: 30,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },

  filterButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: 'white',
  },
});

export default styles;
