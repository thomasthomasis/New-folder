import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

//const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth,
  },

  header: {
    width: '100%',
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },

  headerText: {
    fontWeight: '900',
    fontSize: 25,
    marginLeft: 15,
    color: colors.text,
  },

  headerImage: {
    width: 45,
    height: 45,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
    marginLeft: 10,
  },

  border: {
    width: screenWidth - 20,
    height: 2,
    backgroundColor: colors.black,
  },

  containerWorkouts: {
    width: screenWidth - 48,

    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 160,
  },

  card: {
    marginRight: 'auto',
    marginLeft: 'auto',
    width: screenWidth - 64,
    borderRadius: 16,
    backgroundColor: colors.white,
    height: 72,
    paddingLeft: 24,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  verticalBorder: {
    width: 1,
    height: 48,
    backgroundColor: colors.unselectedItem,
    borderRadius: 50,
    marginRight: 32,
  },

  modalButton: {
    position: 'absolute',
    bottom: 16,
    right: 24,
    backgroundColor: colors.lightGreen,
    width: 80,
    height: 80,
    borderRadius: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  containerModal: {
    width: '100%',
    height: 450,

    borderRadius: 20,
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingTop: 10,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  modalView: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    margin: 0,
  },

  modalContent: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
  },

  modalCard: {
    width: screenWidth - 50,
    height: 80,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: 'white',
    marginRight: 'auto',
    marginLeft: 'auto',
    borderRadius: 20,
    marginBottom: 10,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalHeader: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },

  modalHeaderText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },

  rowModal: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  buttonText: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 20,
  },

  continueButton: {
    width: 190,
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 'auto',
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
