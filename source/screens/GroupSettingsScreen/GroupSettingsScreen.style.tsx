import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginLeft: 10,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  information: {
    width: '90%',
    padding: 20,
    backgroundColor: '#f2f2f2',
    marginTop: 20,
    borderRadius: 20,

    marginRight: 'auto',
    marginLeft: 'auto',
  },

  smallBorder: {
    width: '100%',
    height: 2,
    backgroundColor: 'gray',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 15,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  rowTextarea: {
    display: 'flex',
    flexDirection: 'column',
  },

  textarea: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginTop: 10,
  },
});

export default styles;
