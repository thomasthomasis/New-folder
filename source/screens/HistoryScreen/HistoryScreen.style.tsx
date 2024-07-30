import { StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const styles = StyleSheet.create({
    
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 20,
    },

    
    text: {
        color: colors.green,
        width: '80%',
        fontSize: 20,
        fontWeight: '800',
    },

    border: {
        position: 'absolute',
        left: 10,
        top: 0,
        width: 3,
        height: '100%',
        backgroundColor: 'gray',
    },

    smallBorder: {
        width: '80%',
        height: 2,
        backgroundColor: 'black'
    },

    circle: {
        width: 20,
        height: 20,
        backgroundColor: 'gray',
        borderRadius: 20,

        left: -8,
        top: '50%',
        
    }
})

export default styles;