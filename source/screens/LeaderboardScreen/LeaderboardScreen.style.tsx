import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },

    dropdownButton: {
        width: 200,
        borderRadius: 5,
        marginBottom: 20,
        marginTop: 10,
        height: 40,
        backgroundColor: colors.blue,
      },

    buttonText: {
        color: 'white',
        fontWeight: '800',
    },

    options: {
        width: '90%',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    },

    button: {
        width: 150,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: colors.blue,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    selected: {
        borderWidth: 0,
        backgroundColor: colors.blue,
    },

    containerLeaderBoard: {
        width: '100%',
        height: screenHeight - 380,
        display: 'flex',
        alignItems: 'center',

        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white',
        paddingTop: 20,
    },

    containerPodium: {
        width: screenWidth - 30,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    podium: {
        width: '100%',
        height: 180,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    podiumContent: {
        width: '33.33%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    podiumText: {
        fontWeight: '900',
        fontSize: 70,
        color: 'white',
    },

    containerLoading: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        height: screenHeight - 280,
    },

    row: {
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    rowText: {
        fontSize: 20,
        fontWeight: '800',
    },

    data: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.green,
    },

    username: {
        fontSize: 18, 
        fontWeight: '800',
    },

    image: {
        width: 80,
        height: 80,
        borderRadius: 60,
    },

    containerColumn: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',

        marginBottom: 30,
    },

    column: {
        width: '30%',
        height: 200,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageColumn: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        color: '#ffffff',
        fontSize: 24,
      },
})

export default styles;