import {StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginLeft: 10,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    width: 150,
    paddingLeft: 15,
    fontSize: 20,
    fontWeight: '800',
  },

  closeButtonText: {
    fontSize: 25,
    fontWeight: '800',
    color: 'white',
  },

  pagerView: {
    flex: 1,
    width: '100%', // Adjust width as needed
  },

  pageVisualiser: {
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 5,
    marginTop: 0,
    marginRight: 'auto',
    marginLeft: 'auto',
  },

  bar: {
    width: '33.33%',
    backgroundColor: 'white',
    height: 40,
    borderRadius: 40,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

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
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },

  text: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
  },

  smallBorder: {
    width: 100,
    height: 2,
    backgroundColor: 'lightgray',
    marginBottom: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
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
