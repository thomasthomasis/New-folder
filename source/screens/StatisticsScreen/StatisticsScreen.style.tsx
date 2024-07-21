import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

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


    container: {
      width: '100%',
      paddingRight: 10,
      paddingLeft: 10,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingBottom: 50,

    }, 
  
    information: {
      width: '100%',
      backgroundColor: colors.blue,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingBottom: 20,
      paddingTop: 10,
    },

    headerTitle: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.blue,
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
  
    profilePictureContainer: {
      width: 120,
      aspectRatio: 1,
      borderRadius: 100,
      backgroundColor: 'black',
  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  
      marginRight: 10,
    },
  
    name: {
      color: 'white',
      fontSize: 35,
      fontWeight: '800',
    },
  
    username: {
      color: 'white',
      fontSize: 20,
      fontWeight: '300',
    },
  
    title: {
      fontSize: 18,
      color: 'gray',
      marginBottom: 10,
    },

    status: {
      width: 100,
      height: 30,
      borderRadius: 5,

      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

    },

    statusText: {
      fontWeight: '800',
      color: 'white',
      fontSize: 20,
    },
  
    smallBorder: {
      width: '85%',
      height: 2,
      backgroundColor: 'gray',
      marginBottom: 10,
    },
  
    buttons: {
      width: '80%',
      height: 200,
      display: 'flex',
      flexDirection: 'column',
  
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
  
    button: {
      display: 'flex',
      flexDirection: 'row',
      width: '90%',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 50,
      borderRadius: 15,
      borderWidth: 1.2,
      borderColor: 'gray',
      padding: 10,
    },
  
    profilePictureOptions: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    imageContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    image: {
      height: 100,
      width: '90%',
      resizeMode: 'contain',
      marginBottom: 10,
  
    },
  
    backButton: {
      width: 40,
      height: 40,
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 30,
  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    profileInfo: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  
  progressContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  
  },
  
  levelProgressContainer: {
      height: 2,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
  
  bar: {
      height: 4,
      borderRadius: 5,
  },
  
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue,
    
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  
    margin: 5,
  },
  
  circleText: {
    fontWeight: '800',
    color: 'white',
  },

  containerProfile: {
    width: screenWidth - 25,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    paddingLeft: 10,
    paddingRight: 10,
    display: 'flex',
    alignItems: 'center',
    marginTop: 25,
  },

  profileText: {
    fontWeight: '900',
    fontSize: 18,
  },

  profileRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profileLevelContainer: {
    width: 85,
    height: 85,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: colors.purple,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileLevel: {
    width: 80,
    height: 80,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "#f0f0f0",
    backgroundColor: colors.purple,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileLevelText: {
    color: 'white',
    fontSize: 70,
    fontWeight: '500',
    height: 70,
    marginBottom: 15,
  },

  profileTitleText: {
    color: colors.black,
    fontSize: 50,
    fontWeight: '800',
  },

  containerFilters: {
    width: screenWidth - 20,
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 25,
  },

  filterButton: {
    width: '16%',
    height: 30,
    borderRadius: 20,
    backgroundColor: 'lightgray',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 2,
    marginLeft: 2,
  },

  filterButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
  
  containerPieCharts: {
    width: screenWidth,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 25,
  },
    
  });


export default styles;