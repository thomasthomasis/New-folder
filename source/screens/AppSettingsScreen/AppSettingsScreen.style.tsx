import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    display: 'flex',
    height: screenHeight,
    alignItems: 'center',

    backgroundColor: 'lightgray',
  },

  logoutButton: {
    marginRight: 'auto',
    marginLeft: 'auto',

    width: 140,
    height: 40,
    backgroundColor: colors.red,
    borderRadius: 5,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutButtonText: {
    fontSize: 25,
    fontWeight: '800',
    color: 'white',
  },

  cards: {
    width: screenWidth,
    height: screenHeight - 30,

    display: 'flex',

    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth - 70,
    borderRadius: 10,
    height: 80,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 25,
    fontWeight: '800',
  },

  column: {
    display: 'flex',
    flexDirection: 'row',
    width: 130,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  icon: {
    backgroundColor: 'lightgray',
    padding: 5,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: 'gray',
  },

  row: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
