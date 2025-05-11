import {StyleSheet} from 'react-native';

export const shadow = StyleSheet.create({
  shadow: {
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 3.84,

    // Add elevation for Android (required for shadow to be visible)
    elevation: 5,
  },
});
