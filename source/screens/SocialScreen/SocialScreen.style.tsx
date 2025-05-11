import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

//const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: '100%',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  flatList: {
    width: screenWidth,
    marginRight: 'auto',
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },

  button: {
    width: 200,
    height: 60,
    backgroundColor: colors.green,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 10,
    borderRadius: 10,
  },

  addButtonContainer: {
    width: screenWidth,
    height: 70,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },

  groupButton: {
    width: screenWidth - 30,
    backgroundColor: colors.purple,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 20,
    borderRadius: 10,
    padding: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 25,
  },

  modalView: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    margin: 0,
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default styles;
