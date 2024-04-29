import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Alert, FlatList, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, Image, TouchableOpacity} from 'react-native';
import {Input, Button} from '@rneui/base';
import { useQuery, useRealm, useUser } from '@realm/react';
import { Users } from '../schemas/UsersSchema';
import { colors } from '../Colors';
import { Subscription } from 'realm/dist/bundle';
import { WaitForSync } from 'realm';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserStatistics } from '../schemas/UserStatisticsSchema';


type AccountScreenProps = {
    userData:any,
    onPress:any,
}

export const AccountScreen = (props: AccountScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    return (
        <View>
            <Text>{props.userData.username}</Text>
            <TouchableOpacity onPress={props.onPress}>
                <Text>CLOSE SCREEN</Text>
            </TouchableOpacity>
        </View>
    )
}