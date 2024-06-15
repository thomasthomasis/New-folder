import { StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

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

    closeButtonText: {
        fontSize: 25,
        fontWeight: '800',
        color: 'white',
    },

    input: {
        borderWidth: 2,
        borderColor: 'lightgray',
        borderRadius: 30,
        paddingLeft: 10,
        marginBottom: 10,
        width: 200,
        marginTop: 20,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    groups: {
        display: 'flex',
        alignItems: 'center',
    },

    group: {
        width: 230,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.purple,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },

    icon: {
        color: 'white'
    },

    modalView: {

        display: 'flex',
        justifyContent: 'flex-end',
        margin: 0,
    },

    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },

    title: {
        fontSize: 25,
        fontWeight: '800',
    },

    text: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 30,
    },

    smallBorder: {
        width: 100,
        height: 2,
        backgroundColor: 'lightgray',
        marginBottom: 10,
    },

    button: {
        backgroundColor: colors.blue,
        width: 170,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    notice: {
        backgroundColor: colors.red,
        width: 170,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }

})

export default styles;