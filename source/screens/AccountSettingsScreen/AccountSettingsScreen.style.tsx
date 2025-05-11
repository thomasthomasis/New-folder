import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    flex: 1,
    marginTop: -70,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    height: 60,
  },

  information: {
    width: screenWidth,
    padding: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
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

  row: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  input: {
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 2,
    borderColor: 'lightgray',
    padding: 10,
    borderRadius: 15,
    width: '95%',
    marginBottom: 10,
    color: colors.black,
  },

  inputTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#bfc0be',
    marginBottom: 5,
    marginLeft: 3,
  },

  deleteButton: {
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 2,
    borderColor: 'lightgray',
    padding: 10,
    borderRadius: 15,
    width: '95%',
    marginBottom: 10,
    color: 'white',
    backgroundColor: colors.red,
  },
});

export default styles;
