import React, {useCallback, useState} from 'react';
import Realm, { BSON } from 'realm';
import {useApp} from '@realm/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import {Input, Button} from '@rneui/base';
import {colors} from '../../sharedStyling/Colors';
import styles from './WelcomeScreen.style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function WelcomeScreen(): React.ReactElement {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');


  // state values for toggable visibility of features in the UI
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isInSignUpMode, setIsInSignUpMode] = useState(true);

  const app = useApp();
  //const user = useUser();

  // signIn() uses the emailPassword authentication provider to log in
  const signIn = useCallback(async () => {
    const creds = Realm.Credentials.emailPassword(email, password);
    await app.logIn(creds)
  }, [app, email, password]);

  // onPressSignIn() uses the emailPassword authentication provider to log in
  const onPressSignIn = useCallback(async () => {
    try {
      await signIn();
    } catch (error: any) {
      Alert.alert(`Failed to sign in: ${error?.message}`);
    }
  }, [signIn]);

  // onPressSignUp() registers the user and then calls signIn to log the user in
  const onPressSignUp = useCallback(async () => {
    try {
      await app.emailPasswordAuth.registerUser({email, password});
      await signIn();
      await updateUserData(app.currentUser);
    } catch (error: any) {
      Alert.alert(`Failed to sign up: ${error?.message}`);
      console.log("Failed to sign up: " + error?.message)
    }
  }, [signIn, app, email, password]);


  const updateUserData = async (user:any) => {
    try {
      const result = await user.functions.updateUserInformation(firstName, surname, username)
      const userStatisticsResult = await user.functions.addUserStatistics(new BSON.ObjectID(), user.id)
      //console.log("Result", result)
      //console.log("User Stats", userStatisticsResult)
    }

    catch (e) {
      console.log(e)
    }
  } 

  return (
    <SafeAreaProvider style={{backgroundColor: 'white'}}>
      <View style={styles.viewWrapper}>
        <View style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 30}}>
          <MaterialCommunityIcons name="poll" color={colors.text} size={50} style={{marginRight: 10,}}/>
          <Text style={styles.title}>Ulti Tracker</Text>
        </View>

        <View style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {
            isInSignUpMode &&
            <>
            <Text style={{fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 10,}}>Create an account</Text>
            <View style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center',}}>
              <Text style={{fontWeight: '600', fontSize: 16}}>Already have an account?</Text>
              <TouchableOpacity onPress={() => setIsInSignUpMode(false)}>
                <Text style={{color: colors.blue, fontWeight: '600', fontSize: 16}}> Login</Text>
              </TouchableOpacity> 
            </View>
           
            </>
            
          }
          {
            !isInSignUpMode &&
            <>
            <Text style={{fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 10,}}>Login</Text>
            <View style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center',}}>
              <Text style={{fontWeight: '600', fontSize: 16}}>Dont have an account?</Text>
              <TouchableOpacity onPress={() => setIsInSignUpMode(true)}>
                <Text style={{color: colors.blue, fontWeight: '600', fontSize: 16}}> Signup</Text>
              </TouchableOpacity> 
            </View>
           
            </>
            
          }
        </View>
        
        <Input
          placeholder="email"
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        { isInSignUpMode &&
        <>
          <Input
            placeholder="first name"
            onChangeText={setFirstName}
            autoCapitalize="none"
          />
          <Input
            placeholder="surname"
            onChangeText={setSurname}
            autoCapitalize="none"
          />
          <Input
            placeholder="username"
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </>
        }
        
        
        <Input
          placeholder="password"
          onChangeText={setPassword}
          secureTextEntry={passwordHidden}
          rightIcon={
            <Button
              title={passwordHidden ? 'Show' : 'Hide'}
              onPress={() => {
                setPasswordHidden(!passwordHidden);
              }}
            />
          }
        />
        
      </View>
    </SafeAreaProvider>
  );
}

