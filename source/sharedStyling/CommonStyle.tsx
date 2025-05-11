import { StyleSheet } from 'react-native';
import { colors } from './Colors';

export const common = StyleSheet.create({
    h1: {
        fontSize: 24,
        color: colors.text,
        fontFamily: 'Jost SemiBold',
    },
    h2: {
        fontSize: 16,
        color: colors.text,
        fontFamily: 'Jost SemiBold',
    },
    h3: {
        fontSize: 14,
        color: colors.text,
        fontFamily: 'Jost-Medium'
    },
    body: {
        fontSize: 12,
        fontWeight: '400', 
        color: colors.text,
    },

    containerOuterPadding: {
        paddingLeft: 24,
        paddingRight: 24,
    },

    conatinerInnerPadding: {
        paddingRight: 32,
        paddingLeft: 32,
    },

    iconSize: {
        width: 24,
        height: 24,
    }




})