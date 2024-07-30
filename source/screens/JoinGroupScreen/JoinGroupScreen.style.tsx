import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../sharedStyling/Colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

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

    headerTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    searchBar: {
        width: screenWidth,
        height: 50,
        marginTop: 20,
        marginBottom: 10,
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
    },

    input: {
        borderWidth: 2,
        borderColor: 'lightgray',
        borderRadius: 30,
        paddingLeft: 10,
        width: screenWidth - 50,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    bellIcon: {
        marginRight: 10,
    },

    groups: {
        display: 'flex',
        alignItems: 'center',
    },

    group: {
        width: screenWidth - 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: colors.purple,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },

    icon: {
        position: 'absolute',
        right: 10,
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
        backgroundColor: colors.green,
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