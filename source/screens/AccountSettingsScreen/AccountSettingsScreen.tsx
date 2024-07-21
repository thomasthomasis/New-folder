import React, {useState, useEffect, useCallback} from 'react';
import {Alert, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { useApp, useQuery, useRealm, useUser } from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { shadow } from '../../sharedStyling/Shadow';
import styles from './AccountSettingsScreen.style';
import Modal from 'react-native-modal';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { colors } from '../../sharedStyling/Colors';

type AccountSettingsProps = {
    navigation: StackNavigationProp<RootStackParamList, 'AccountSettings'>;
}

export const AccountSettingsScreen = ({ navigation }: AccountSettingsProps) => {

    const app = useApp()
    const realm = useRealm()
    const user = useUser()

    const goBack = () => {
        navigation.goBack()
    }   

    const userData = useQuery(Users).sorted('_id').filtered("userId == $0", user.id);

    const [password, setPassword] = useState<string>('')

    const handlePasswordChange = (inputText:string) => {
        setPassword(inputText)
    }

    const [isLoading, setIsLoading] = useState(false)

    const resetPassword = () => {

       console.log("Password reset")

    }

    const deleteAccount = async () => {
        try
        {
            await app.deleteUser(user)
        }
        catch (error)
        {
            console.error("Error deleting account:", error)
        }
    }

    const signOut = useCallback(() => {
        user?.logOut();
      }, [user]);

    const handleConfirm = () => {
        // Show confirmation popup
        Alert.alert(
          'Confirm Action',
          'Are you sure you want to update your information?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {resetPassword();}
            },
          ],
          { cancelable: false }
        );
      };

      const handleConirmDeleteFirst = () => {
        // Show confirmation popup
        Alert.alert(
            'Confirm Action',
            'Are you sure you want to delete your account?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {handleConfirmDeleteSecond()}
              },
            ],
            { cancelable: false }
          );
      }

      const handleConfirmDeleteSecond = () => {
        // Show confirmation popup
        Alert.alert(
            'Confirm Action',
            'Are you completely sure??',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {handleConfirmDeleteThird()}
              },
            ],
            { cancelable: false }
          );
      }

      const handleConfirmDeleteThird = () => {
        // Show confirmation popup
        Alert.alert(
            'Are you really sure???',
            'Last chance, are you suuuure?????',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {deleteAccount();}
              },
            ],
            { cancelable: false }
          );
      }

      useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
            realm.objects(Users),
            );
        });
        }, [realm, user]);

    return (
       
            <>

            {
                isLoading && 
                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            }
            {
                !isLoading &&
                <>
                <View style={styles.header}>
                    <View style={styles.headerTitle}>
                        <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                            <MaterialCommunityIcons name="arrow-left" size={40}/>
                        </TouchableOpacity> 
                        <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20,}}>Edit Account</Text>
                    </View>
                    <TouchableOpacity onPress={handleConfirm}>
                        <MaterialCommunityIcons name="check" color={'black'} size={40} style={{marginRight: 10,}}/>
                    </TouchableOpacity>
                </View>
            
                <View style={styles.container}>
                     <View style={styles.information}>
                        <View style={styles.row}>
                            <Text style={styles.inputTitle}>Email</Text>
                            <Text style={styles.input}>{user.profile.email}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.inputTitle}>Password</Text>
                            
                            <TouchableOpacity style={styles.input} onPress={resetPassword}>
                                <Text style={{fontWeight: '800', fontSize: 18, color: colors.black}}>***********</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.inputTitle}>Date Created</Text>
                            <Text style={styles.input}>{userData[0].dateCreated?.toLocaleString()}</Text>
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity style={[styles.deleteButton, shadow.shadow]} onPress={handleConirmDeleteFirst}>
                                <Text style={{fontWeight: '800', color: 'white', fontSize: 20}}>Delete Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </>
            }
                 
            </>  
        
    )
}

