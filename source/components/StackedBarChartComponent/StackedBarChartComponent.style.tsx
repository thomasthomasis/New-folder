import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../sharedStyling/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    paddingTop: 20,
    paddingBottom: 30,
    width: screenWidth - 25,
    marginTop: 25,
  },

  xAxis: {
    width: '90%',
    height: 3,
    backgroundColor: colors.black,
    position: 'absolute',
    bottom: 37,
    left: 30,
  },

  yAxis: {
    width: 3,
    height: 210,
    backgroundColor: colors.black,
    position: 'absolute',
    bottom: 25,
    left: 30,
  },

  yAxisNumbers: {
    position: 'absolute',
    left: 7.5,
    bottom: 35,
    height: 205,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  yAxisText: {
    fontSize: 18,
    fontWeight: '700',
  },

  legend: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
  },
});

export default styles;
