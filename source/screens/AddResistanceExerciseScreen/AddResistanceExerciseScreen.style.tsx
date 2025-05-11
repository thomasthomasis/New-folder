import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    height: 96,
    paddingBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,
    backgroundColor: colors.white,

    position: 'relative',
    zIndex: 5,
  },

  headerSearch: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    height: 96,
    paddingBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,
    backgroundColor: colors.white,

    position: 'relative',
    zIndex: 5,
  },

  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: -8,
  },

  input: {
    backgroundColor: colors.mediumGray,
    height: 40,
    width: screenWidth - 140,
    paddingLeft: 12,
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
  },

  searchIcon: {
    backgroundColor: colors.mediumGray,
    height: 40,
    paddingTop: 8,
    paddingRight: 12,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
  },

  container: {
    marginTop: 24,
    width: screenWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: colors.background,
    paddingBottom: 102,
  },

  title: {
    marginBottom: 8,
    marginLeft: 8,
  },

  containerAccordion: {
    width: '100%',
  },

  containerFavourites: {
    width: '100%',
    marginBottom: 24,
  },

  favouriteExercise: {
    width: '100%',
    height: 56,
    backgroundColor: 'white',

    marginLeft: 'auto',
    marginRight: 'auto',

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 32,
    paddingRight: 32,
    borderRadius: 16,
  },

  accordionHeader: {
    width: '100%',
    height: 64,
    paddingLeft: 32,
    paddingRight: 32,
    backgroundColor: 'white',

    marginLeft: 'auto',
    marginRight: 'auto',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.unselectedItem,
  },

  accordionHeaderText: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  accordionContent: {
    width: '100%',
    backgroundColor: colors.mediumGray,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingLeft: 32,
    paddingRight: 32,

    borderBottomWidth: 1,
    borderBottomColor: colors.text,
  },

  addButton: {
    marginRight: 'auto',
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    width: 156,
    height: 48,
    backgroundColor: colors.green,
  },

  modalView: {
    width: screenWidth,
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 90,
    zIndex: 4,
  },

  modalContent: {
    width: screenWidth,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    position: 'relative',
    zIndex: 3,
    paddingBottom: 8,
  },

  backdrop: {
    position: 'relative',
    marginTop: -20,
    backgroundColor: colors.unselectedItem,
    opacity: 0.4,
    height: screenHeight,
    width: screenWidth,
    zIndex: 1,
  },

  searchedExercise: {
    width: screenWidth - 64,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 24,
    paddingLeft: 24,
    height: 56,
    borderBottomColor: colors.unselectedItem,
    borderBottomWidth: 1,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

export default styles;
