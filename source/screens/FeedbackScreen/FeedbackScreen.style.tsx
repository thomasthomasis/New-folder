import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

    container: {
        width: screenWidth,
        height: screenHeight,
        display: 'flex',
        alignItems: 'center',
    },

    headerTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    containerFeedback: {
        marginTop: 100,
    },

    title: {
        fontSize: 25,
        fontWeight: '900',
        marginBottom: 20,
        textAlign: 'center',
    },

    row: {
        width: screenWidth - 70,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 20,
    },

    smallBorder: {
        width: '90%',
        height: 2,
        backgroundColor: 'gray',
        marginBottom: 20,
    },

    button: {
        width: '25%',
        height: 40,
        backgroundColor: colors.green,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        fontWeight: '800',
        color: 'white',
        fontSize: 20,
    },

    selected: {
        borderWidth: 2,
        borderColor: 'gray',
    },

    commentTitle: {
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 10,
    },

    textInput: {
        width: screenWidth - 90,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        padding: 15,
        textAlignVertical: 'top',
    },
    
})

export default styles;