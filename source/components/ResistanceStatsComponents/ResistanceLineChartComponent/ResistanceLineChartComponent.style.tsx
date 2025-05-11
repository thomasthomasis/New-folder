import {Dimensions, StyleSheet} from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  mainContainer: {
    width: screenWidth,
    heigth: 700,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
  },

  container: {
    width: screenWidth - 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingBottom: 10,
    paddingTop: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
});

export default styles;
