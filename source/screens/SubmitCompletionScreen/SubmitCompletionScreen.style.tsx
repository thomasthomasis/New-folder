import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const {width, height} = Dimensions.get("window")

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    bigCircle: {
        width: 100,
        aspectRatio: 1/1,
        backgroundColor: colors.blue,
        borderRadius: 100,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 20,
    },

    bigCircleText: {
        fontSize: 40,
        fontWeight: '800',
        color: 'white',
    },

    congratsText: {
        fontSize: 36,
        fontWeight: '900',
        marginBottom: 20,
    },

    smallCircle: {
        width: 40,
        aspectRatio: 1/1,
        backgroundColor: colors.blue,
        borderRadius: 30,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
    },

    smallCircleText: {
        fontSize: 18,
        fontWeight: '800',
        color: 'white',
    },

    progressBarContainer: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 50,
    },

    progressBar: {
        width: 200,
        height: 6,
        display: 'flex',
        flexDirection: 'row',
    },

    bar: {
        height: 6,
    },

    continueButton: {
        width: 200,
        height: 50,
        backgroundColor: colors.blue,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },

    text: {
        fontSize: 20,
        color: 'white',
        fontWeight: '600',
    },
})

export default styles;