import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Alert, FlatList, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import {Input, Button} from '@rneui/base';
import { useQuery, useRealm, useUser } from '@realm/react';
import { Users } from '../schemas/UsersSchema';
import { colors } from '../Colors';
import { Subscription } from 'realm/dist/bundle';
import { WaitForSync } from 'realm';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserStatistics } from '../schemas/UserStatisticsSchema';
import { shadow } from '../Shadow';


type AccountScreenProps = {
    onPress:any,
}

export const AccountScreen = (props: AccountScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const userData = useQuery(Users).sorted('_id').filtered("userId == $0", user.id);
    

    const [selectingProfilePicture, setSelectingProfilePicture] = useState<boolean>(false)
    const [imageSource, setImageSource] = useState(require('./assets/1.png'))
    const [imageSourceText, setImageSourceText] = useState('./assets/1.png')

    const [firstName, setFirstName] = useState<string | undefined>(userData[0].firstName)
    const [surname, setSurname] = useState<string | undefined>(userData[0].lastName)
    const [username, setUsername] = useState<string | undefined>(userData[0].username)
    const [title, setTitle] = useState<string | undefined>(userData[0].selectedTitle)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [newProfilePictureBool, setNewProfilePictureBool] = useState<boolean>(false)

    const titles = userData[0].titles

    const [isLoading, setIsLoading] = useState(true)

    const handleUsernameChange = (inputText:string) => {
        setUsername(inputText)
    }

    const handlefirstNameChange = (inputText:string) => {
        setFirstName(inputText)
    }

    const handleSurnameChange = (inputText:string) => {
        setSurname(inputText)
    }

    const handleTitleChange = (inputText:string) => {
        setTitle(inputText)
    }


    const returnToMainMenu = () => {
        setSelectingProfilePicture(false)
    }

    const updateImageSource = (source:string) => {
        if(source.includes('1'))
        {
            setImageSource(require('./assets/1.png'))
            setImageSourceText('./assets/1.png')
        }
        else if(source.includes('2'))
        {
            setImageSource(require('./assets/2.png'))
            setImageSourceText('./assets/2.png')
        }
        else if(source.includes('3'))
        {
            setImageSource(require('./assets/3.png'))
            setImageSourceText('./assets/3.png')
        }
        else if(source.includes('4'))
        {
            setImageSource(require('./assets/4.png'))
            setImageSourceText('./assets/4.png')
        }

        setNewProfilePictureBool(true)

        console.log(source)

        returnToMainMenu();
    }

    const updateUserInformation = (newProfilePicture:boolean) => {

        if(newProfilePicture)
        {
            realm.write(() => {
                userData[0].firstName = firstName;
                userData[0].lastName = surname;
                userData[0].profilePicture = imageSourceText;
                userData[0].username = username;
                userData[0].selectedTitle = title;
            })
        }
        else
        {
            realm.write(() => {
                userData[0].firstName = firstName;
                userData[0].lastName = surname;
                userData[0].username = username;
                userData[0].selectedTitle = title;
            }) 
        }

        

        props.onPress()
    }

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
              onPress: () => updateUserInformation(newProfilePictureBool)
            },
          ],
          { cancelable: false }
        );
      };

    useEffect(() => {

        console.log(userData)
        if(userData[0].profilePicture?.includes('1'))
        {
          setImageSource(require('./assets/1.png'))
        }
        else if(userData[0].profilePicture?.includes('2'))
        {
          setImageSource(require('./assets/2.png'))
        }
        else if(userData[0].profilePicture?.includes('3'))
        {
          setImageSource(require('./assets/3.png'))
        }
        else if(userData[0].profilePicture?.includes('4'))
        {
          setImageSource(require('./assets/4.png'))
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
          }, 500); // Change the delay time as needed

        return () => clearTimeout(timer)
      }, [])

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
            !selectingProfilePicture &&
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

                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10, position: 'absolute', zIndex: 2}}>
                    <TouchableOpacity onPress={props.onPress}>
                        <MaterialCommunityIcons name="arrow-left" color={'black'} size={40} style={{marginLeft: 10,}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleConfirm}>
                        <MaterialCommunityIcons name="check" color={'black'} size={40} style={{marginRight: 10,}}/>
                    </TouchableOpacity>
                </View>
            
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => setSelectingProfilePicture(true)}>
                            <Image source={imageSource} style={{width: 150, height: 150, borderRadius: 100,}}/>
                            <MaterialCommunityIcons name="image-edit-outline" color={'black'} size={40} style={{backgroundColor: 'white', borderRadius: 40, position: 'absolute', bottom: 0, right: 10, padding: 5,}}/>
                        </TouchableOpacity>

                        <View style={[styles.information, shadow.shadow]}>
                            <Text style={{fontSize: 25, fontWeight: '900', marginBottom: 5,}}>Information</Text>
                            <View style={styles.smallBorder}></View>
                            <View style={styles.row}>
                                <Text style={{fontSize: 18, fontWeight: '600', color: '#bfc0be'}}>Email</Text>
                                <Text style={{fontSize: 18, fontWeight: '600'}}>{user.profile.email}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={{fontSize: 18, fontWeight: '600', color: '#bfc0be'}}>Username</Text>
                                <TextInput
                                    style={{fontSize: 18, fontWeight: '600', borderBottomWidth: 2, borderBottomColor: 'lightgray', padding: 0,}}
                                    onChangeText={handleUsernameChange}
                                    value={username}
                                />
                            </View>
                            <View style={styles.row}>
                                <Text style={{fontSize: 18, fontWeight: '600', color: '#bfc0be'}}>First Name</Text>
                                <TextInput
                                    style={{fontSize: 18, fontWeight: '600', borderBottomWidth: 2, borderBottomColor: 'lightgray', padding: 0,}}
                                    onChangeText={handlefirstNameChange}
                                    value={firstName}
                                />
                            </View>
                            <View style={styles.row}>
                                <Text style={{fontSize: 18, fontWeight: '600', color: '#bfc0be'}}>Surname</Text>
                                <TextInput
                                    style={{fontSize: 18, fontWeight: '600', borderBottomWidth: 2, borderBottomColor: 'lightgray', padding: 0,}}
                                    onChangeText={handleSurnameChange}
                                    value={surname}
                                />
                            </View>
                            <View style={styles.row}>
                                <Text style={{fontSize: 18, fontWeight: '600', color: '#bfc0be'}}>Title</Text>
                                <TouchableOpacity style={{borderBottomWidth: 2, borderBottomColor: 'lightgray', padding: 0,}} onPress={() => setShowModal(true)}>
                                <Text style={{fontSize: 18, fontWeight: '600', }}>{title}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <Text style={{fontSize: 18, fontWeight: '600', color: '#bfc0be'}}>Joined</Text>
                                <Text style={{fontSize: 18, fontWeight: '600'}}>{userData[0].dateCreated?.toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            

                <Modal
                animationType="fade"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(!showModal)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowModal(!showModal)}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback>
                            
                                <View style={styles.modalContent}>
                                    {
                                        titles.map((item, index) => (
                                            <TouchableOpacity key={index} onPress={() => {setShowModal(!showModal); setTitle(item)}} style={[styles.titleButton, {marginTop: 5, marginBottom: 5}]}>
                                                <Text style={styles.titleButtonText}>{item}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                            
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                    
                </Modal>
            </>
            }

            

            
            </>
        }
            

            {
          selectingProfilePicture &&
          <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',}}>
            <TouchableOpacity onPress={returnToMainMenu} style={{width: 40, height: 40, borderRadius: 40, borderWidth: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <MaterialCommunityIcons name="arrow-left-thick" color={'black'} size={30}/>
            </TouchableOpacity>
            <Text style={styles.title}>Select Option</Text>
            <View style={[styles.smallBorder, {backgroundColor: 'black'}]}></View>
            <TouchableOpacity onPress={() => updateImageSource("./assets/1.png")}>
              <Image style={styles.image} source={require("./assets/1.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateImageSource("./assets/2.png")}>
              <Image style={styles.image} source={require("./assets/2.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateImageSource("./assets/3.png")}>
              <Image style={styles.image} source={require("./assets/3.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateImageSource("./assets/4.png")}>
              <Image style={styles.image} source={require("./assets/4.png")} />
            </TouchableOpacity>
          </View>
        }
        </>

        
    )
}

const styles = StyleSheet.create({

    container: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -70,
    },

    information: {
        width: '90%', 
        padding: 20, 
        backgroundColor: '#f2f2f2', 
        marginTop: 20, 
        borderRadius: 20,
    },

    smallBorder: {
        width: '100%',
        height: 2,
        backgroundColor: 'gray',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 15,
    },

    row: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 10,
    },

    title: {
        fontSize: 18,
    },

    image: {
        width: 150,
        height: 100,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
      modalText: {
        marginBottom: 20,
        fontSize: 18,
      },
    
      titleButton: {
        width: 150,
        height: 40,
        backgroundColor: colors.blue, 
        borderRadius: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },

      titleButtonText: {
        fontWeight: '800',
        fontSize: 20,
        color: 'white',
      }
    
})