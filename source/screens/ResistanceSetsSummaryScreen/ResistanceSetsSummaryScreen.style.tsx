import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth,
    height: 102,
    paddingTop: 10,
    backgroundColor: colors.white,

    position: 'relative',
    zIndex: 5,
  },

  addExerciseButton: {
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 180,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.green,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 120,
  },

  scrollView: {
    width: screenWidth,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 24,
  },

  form: {
    width: screenWidth - 48,
    padding: 16,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 24,
    marginRight: 'auto',
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  collapsibleContent: {
    width: screenWidth - 48,
    backgroundColor: colors.white,
    borderRadius: 24,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingTop: 8,
    paddingLeft: 24,
    paddingRight: 16,
    paddingBottom: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },

  smallBorder: {
    width: 130,
    height: 2,
    backgroundColor: 'lightgray',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 20,
  },

  row: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',

    marginBottom: 0,
  },

  rowButtons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',

    marginBottom: 10,
    marginTop: 30,
  },

  inputs: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  inputBoxes: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',

    marginRight: 70,
  },

  inputContainer: {
    width: 50,
    marginLeft: 5,
    marginRight: 5,
    display: 'flex',
    flexDirection: 'column',

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
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.mediumGray,
    padding: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    height: 340,
  },

  input: {
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth - 48,
    height: 56,
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 16,
  },

  confirmButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 16,
    width: 148,
    backgroundColor: colors.green,
  },
});

export default styles;
