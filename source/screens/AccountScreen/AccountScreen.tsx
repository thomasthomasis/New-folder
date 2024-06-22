import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { useQuery, useRealm, useUser } from '@realm/react';
import { Users } from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { shadow } from '../../sharedStyling/Shadow';
import styles from './AccountScreen.style';
import Modal from 'react-native-modal';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { colors } from '../../sharedStyling/Colors';

type AccountScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Account'>;
}

export const AccountScreen = ({ navigation }: AccountScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const goBack = () => {
        navigation.goBack()
    }   

    const userData = useQuery(Users).sorted('_id').filtered("userId == $0", user.id);
    
    const [selectingProfilePicture, setSelectingProfilePicture] = useState<boolean>(false)
    const [imageSource, setImageSource] = useState(require('../../assets/1.png'))
    const [imageSourceText, setImageSourceText] = useState('../../assets/1.png')

    const [firstName, setFirstName] = useState<string | undefined>(userData[0].firstName)
    const [surname, setSurname] = useState<string | undefined>(userData[0].lastName)
    const [username, setUsername] = useState<string | undefined>(userData[0].username)
    const [title, setTitle] = useState<string | undefined>(userData[0].selectedTitle)
    const [status, setStatus] = useState<string | undefined>(userData[0].status)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showModalStatus, setShowModalStatus] = useState<boolean>(false)
    const [newProfilePictureBool, setNewProfilePictureBool] = useState<boolean>(false)

    const statuses = ["Healthy", "Away", "Injured"]

    const closeModals = () => {
        setShowModal(false)
        setShowModalStatus(false)
    }

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

    const returnToMainMenu = () => {
        setSelectingProfilePicture(false)
    }

    const updateImageSource = (source:string) => {
        if(source.includes('1'))
        {
            setImageSource(require('../../assets/1.png'))
            setImageSourceText("../../assets/1.png")
        }
        else if(source.includes('2'))
        {
            setImageSource(require('../../assets/2.png'))
            setImageSourceText('../../assets/2.png')
        }
        else if(source.includes('3'))
        {
            setImageSource(require('../../assets/3.png'))
            setImageSourceText('../../assets/3.png')
        }
        else if(source.includes('4'))
        {
            setImageSource(require('../../assets/4.png'))
            setImageSourceText('../../assets/4.png')
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
                userData[0].status = status;
            })
        }
        else
        {
            realm.write(() => {
                userData[0].firstName = firstName;
                userData[0].lastName = surname;
                userData[0].username = username;
                userData[0].selectedTitle = title;
                userData[0].status = status;
            }) 
        }

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
              onPress: () => {updateUserInformation(newProfilePictureBool); goBack()}
            },
          ],
          { cancelable: false }
        );
      };

    useEffect(() => {

        console.log(userData)
        if(userData[0].profilePicture?.includes('1'))
        {
          setImageSource(require('../../assets/1.png'))
        }
        else if(userData[0].profilePicture?.includes('2'))
        {
          setImageSource(require('../../assets/2.png'))
        }
        else if(userData[0].profilePicture?.includes('3'))
        {
          setImageSource(require('../../assets/3.png'))
        }
        else if(userData[0].profilePicture?.includes('4'))
        {
          setImageSource(require('../../assets/4.png'))
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
                    <TouchableOpacity onPress={goBack}>
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
                                <Text style={{fontSize: 18, fontWeight: '600', color: '#bfc0be'}}>Status</Text>
                                <TouchableOpacity style={{borderBottomWidth: 2, borderBottomColor: 'lightgray', padding: 0,}} onPress={() => setShowModalStatus(true)}>
                                <Text style={{fontSize: 18, fontWeight: '600', }}>{status}</Text>
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
                isVisible={showModal}
                swipeDirection={['down']}
                onSwipeComplete={closeModals}
                onBackdropPress={closeModals}
                style={styles.modalView}
                >
                        <View style={styles.modalContent}>
                                <View style={styles.modalContent}>
                                    {
                                        titles.map((item, index) => (
                                            <TouchableOpacity key={index} onPress={() => {closeModals(); setTitle(item)}} style={[styles.titleButton, {marginTop: 5, marginBottom: 5}]}>
                                                <Text style={styles.titleButtonText}>{item}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </View>
                        </View>
                    
                    
                </Modal>

                <Modal
                isVisible={showModalStatus}
                swipeDirection={['down']}
                onSwipeComplete={closeModals}
                onBackdropPress={closeModals}
                style={styles.modalView}
                >
                    
                    <View style={styles.modalContent}>
                            <View style={styles.modalContent}>
                                {
                                    statuses.map((item, index) => (
                                        <TouchableOpacity key={index} onPress={() => {closeModals(); setStatus(item)}} style={[styles.titleButton, {marginTop: 5, marginBottom: 5}, index == 1 && {backgroundColor: colors.orange}, index == 2 && {backgroundColor: colors.red}]}>
                                            <Text style={styles.titleButtonText}>{item}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                    </View>
                  
                    
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
            <TouchableOpacity onPress={() => updateImageSource("../../assets/1.png")}>
              <Image style={styles.image} source={require("../../assets/1.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateImageSource("../../assets/2.png")}>
              <Image style={styles.image} source={require("../../assets/2.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateImageSource("../../assets/3.png")}>
              <Image style={styles.image} source={require("../../assets/3.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateImageSource("./assets/4.png")}>
              <Image style={styles.image} source={require("../../assets/4.png")} />
            </TouchableOpacity>
          </View>
        }
        </>

        
    )
}

