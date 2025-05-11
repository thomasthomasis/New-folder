import {StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const styles = StyleSheet.create({
  modalView: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    margin: 0,
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,

    display: 'flex',
    alignItems: 'center',
  },

  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
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

  buttons: {},

  removeButton: {
    width: 120,
    backgroundColor: colors.red,
    padding: 10,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  editButton: {
    width: 120,
    backgroundColor: colors.green,
    padding: 10,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
  },

  border: {
    width: '95%',
    height: 2,
    backgroundColor: 'lightgray',
    marginTop: 5,
    marginBottom: 20,
    marginRight: 'auto',
    marginLeft: 'auto',
  },

  group: {
    width: 170,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purple,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },

  userInfoContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },

  userData: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 70,
    marginRight: 10,
  },

  username: {
    fontSize: 20,
    fontWeight: '900',
  },

  role: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.purple,
  },

  button: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default styles;
