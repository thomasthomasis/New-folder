import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    
    container: {
        display: 'flex',
        alignItems: 'center',   
    },

    title: {
        fontWeight: '800',
        marginTop: 20,
    },

    text: {
        fontWeight: '600',
        fontSize: 20,
    },

    smallBorder: {
        height: 2,
        width: '75%',
        backgroundColor: 'gray',
        marginTop: 10,
        marginBottom: 10,
    }
})

export default styles;