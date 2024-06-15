import { StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const styles = StyleSheet.create({
    
    
    title: {
        fontSize: 25,
        fontWeight: '800',
    },

    smallBorder: {
        width: 200,
        height: 3,
        backgroundColor: 'black',
        marginBottom: 30,
    },

    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    input: {
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
        width: '80%',
    },

    textarea: {
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
        width: '80%',
    },

    button: {
        width: 160,
        height: 45,
        backgroundColor: colors.green,
        borderRadius: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 'auto',
        marginLeft: 'auto',
    },

    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '700',
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

    check: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeButtonText: {
        fontSize: 25,
        fontWeight: '800',
        color: 'white',
    },
})

export default styles;