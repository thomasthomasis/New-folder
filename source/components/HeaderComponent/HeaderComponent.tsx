import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import { useRealm, useQuery, useUser} from '@realm/react';
import styles from './HeaderComponent.style';

import { useIsFocused } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../sharedStyling/Colors';
import { common } from '../../sharedStyling/CommonStyle';

type HeaderProps = {
    goToProfileSettings:any,
    title:string,
}

export const HeaderComponent = (props: HeaderProps) => {

    const realm = useRealm()
    const user = useUser()
    const isFocused = useIsFocused()

    const [userData, setUserData] = useState<any>(realm.objects("Users").sorted('_id').filtered("userId == $0", user.id));
    const [imageSource, setImageSource] = useState(require("../../assets/defaultPFP.png"))

    //set profile picture
    useEffect(() => {
    
        let profilePicture;
        if(userData[0])
        {
            profilePicture = userData[0].profilePicture as string;
        }
        
        if(profilePicture)
        {
            //console.log(profilePicture)
            if(profilePicture.includes('1'))
            {
                setImageSource(require('../../assets/1.png'))
            }
            else if(profilePicture.includes('2'))
            {
                setImageSource(require('../../assets/2.png'))
            }
            else if(profilePicture.includes('3'))
            {
                setImageSource(require('../../assets/3.png'))
            }
            else if(profilePicture.includes('4'))
            {
                setImageSource(require('../../assets/4.png'))
            }
            else
            {
                setImageSource(require('../../assets/defaultPFP.png'))
            }
        }
      
    }, [isFocused])

    return (
        <View style={[styles.header, common.containerOuterPadding]}>
            <Text style={common.h1}>{props.title}</Text>
            <View style={{display: 'flex', flexDirection: 'row',  alignItems: 'center'}} >
              <MaterialCommunityIcons name={"bell-outline"} size={24} color={colors.text}/>
              <TouchableOpacity onPress={() => props.goToProfileSettings()}>
                <Image source={imageSource} style={styles.headerImage}/>
              </TouchableOpacity>
            </View>
            
        </View>
    )
}
