import { StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 20,
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

    image: {
        width: 60,
        height: 60,
        borderRadius: 60,
        marginRight: 20,
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
    }
})

export default styles;