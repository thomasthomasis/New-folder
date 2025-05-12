import React, {useState, useEffect} from 'react';
import {Alert, Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useRealm, useUser} from '@realm/react';
import {Users} from '../../schemas/UsersSchema';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './ProfileSettingsScreen.style';
import Modal from 'react-native-modal';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {colors} from '../../sharedStyling/Colors';

type ProfileSettingsProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProfileSettings'>;
};

export const ProfileSettingsScreen = ({navigation}: ProfileSettingsProps) => {
  const realm = useRealm();
  const user = useUser();

  const goBack = () => {
    navigation.goBack();
  };

  const [userData, setUserData] = useState<any>(null);

  const [selectingProfilePicture, setSelectingProfilePicture] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState(require('../../assets/defaultPFP.png'));
  const [imageSourceText, setImageSourceText] = useState('../../assets/defaultPFP.png');

  const [firstName, setFirstName] = useState<string | undefined>('');
  const [surname, setSurname] = useState<string | undefined>('');
  const [username, setUsername] = useState<string | undefined>('');
  const [title, setTitle] = useState<string | undefined>('');
  const [titles, setTitles] = useState<any>('');
  const [status, setStatus] = useState<string | undefined>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [newProfilePictureBool, setNewProfilePictureBool] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const statuses = ['Healthy', 'Away', 'Injured'];

  useEffect(() => {
    let userDataObject = realm.objects(Users).sorted('_id').filtered('userId == $0', user.id);

    setUserData(userDataObject);
    setFirstName(userDataObject[0].firstName);
    setUsername(userDataObject[0].username);
    setSurname(userDataObject[0].lastName);
    setTitle(userDataObject[0].selectedTitle);
    setStatus(userDataObject[0].status);
    setTitles(userDataObject[0].titles);

    console.log('user data: ', userData);

    if (userDataObject) {
      setLoading(false);
    }
  }, [realm, user.id, userData]);

  const closeModals = () => {
    setShowModal(false);
    setShowModalStatus(false);
  };

  const handleUsernameChange = (inputText: string) => {
    setUsername(inputText);
  };

  const handlefirstNameChange = (inputText: string) => {
    setFirstName(inputText);
  };

  const handleSurnameChange = (inputText: string) => {
    setSurname(inputText);
  };

  const returnToMainMenu = () => {
    setSelectingProfilePicture(false);
  };

  const updateImageSource = (source: string) => {
    if (source.includes('1')) {
      setImageSource(require('../../assets/1.png'));
      setImageSourceText('../../assets/1.png');
    } else if (source.includes('2')) {
      setImageSource(require('../../assets/2.png'));
      setImageSourceText('../../assets/2.png');
    } else if (source.includes('3')) {
      setImageSource(require('../../assets/3.png'));
      setImageSourceText('../../assets/3.png');
    } else if (source.includes('4')) {
      setImageSource(require('../../assets/4.png'));
      setImageSourceText('../../assets/4.png');
    } else {
      setImageSource(require('../../assets/defaultPFP.png'));
      setImageSourceText('../../assets/defaultPFP.png');
    }

    setNewProfilePictureBool(true);

    console.log(source);

    returnToMainMenu();
  };

  const updateUserInformation = (newProfilePicture: boolean) => {
    if (newProfilePicture) {
      realm.write(() => {
        userData[0].firstName = firstName;
        userData[0].lastName = surname;
        userData[0].profilePicture = imageSourceText;
        userData[0].username = username;
        userData[0].selectedTitle = title;
        userData[0].status = status;
      });
    } else {
      realm.write(() => {
        userData[0].firstName = firstName;
        userData[0].lastName = surname;
        userData[0].username = username;
        userData[0].selectedTitle = title;
        userData[0].status = status;
      });
    }
  };

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
          onPress: () => {
            updateUserInformation(newProfilePictureBool);
            goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    let userData = realm.objects(Users).sorted('_id').filtered('userId == $0', user.id);

    console.log(userData);
    if (userData[0].profilePicture?.includes('1')) {
      setImageSource(require('../../assets/1.png'));
    } else if (userData[0].profilePicture?.includes('2')) {
      setImageSource(require('../../assets/2.png'));
    } else if (userData[0].profilePicture?.includes('3')) {
      setImageSource(require('../../assets/3.png'));
    } else if (userData[0].profilePicture?.includes('4')) {
      setImageSource(require('../../assets/4.png'));
    } else {
      setImageSource(require('../../assets/defaultPFP.png'));
    }
  }, [realm, user.id]);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Users));
    });
  }, [realm, user]);

  return (
    <>
      {!selectingProfilePicture && (
        <>
          {loading && (
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          {!loading && (
            <>
              <View style={styles.header}>
                <View style={styles.headerTitle}>
                  <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                    <MaterialCommunityIcons name="arrow-left" size={40} />
                  </TouchableOpacity>
                  <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20}}>Edit Profile</Text>
                </View>
                <TouchableOpacity onPress={handleConfirm}>
                  <MaterialCommunityIcons name="check" color={'black'} size={40} style={{marginRight: 10}} />
                </TouchableOpacity>
              </View>

              <View style={styles.container}>
                <TouchableOpacity onPress={() => setSelectingProfilePicture(true)}>
                  <Image source={imageSource} style={styles.image} />
                  <MaterialCommunityIcons
                    name="image-edit-outline"
                    color={'black'}
                    size={25}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 40,
                      position: 'absolute',
                      bottom: -10,
                      right: 5,
                      padding: 5,
                    }}
                  />
                </TouchableOpacity>

                <View style={styles.information}>
                  <View style={styles.row}>
                    <Text style={styles.inputTitle}>Username</Text>
                    <TextInput style={styles.input} onChangeText={handleUsernameChange} value={username} />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.inputTitle}>First Name</Text>
                    <TextInput style={styles.input} onChangeText={handlefirstNameChange} value={firstName} />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.inputTitle}>Surname</Text>
                    <TextInput style={styles.input} onChangeText={handleSurnameChange} value={surname} />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.inputTitle}>Title</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowModal(true)}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '600',
                          color: colors.black,
                        }}>
                        {title}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.inputTitle}>Status</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowModalStatus(true)}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '600',
                          color: colors.black,
                        }}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Modal isVisible={showModal} swipeDirection={['down']} onSwipeComplete={closeModals} onBackdropPress={closeModals} style={styles.modalView}>
                <View style={styles.modalContent}>
                  <View style={styles.modalContent}>
                    {titles.map((item: any, index: any) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          closeModals();
                          setTitle(item);
                        }}
                        style={[styles.titleButton, {marginTop: 5, marginBottom: 5}]}>
                        <Text style={styles.titleButtonText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Modal>

              <Modal isVisible={showModalStatus} swipeDirection={['down']} onSwipeComplete={closeModals} onBackdropPress={closeModals} style={styles.modalView}>
                <View style={styles.modalContent}>
                  <View style={styles.modalContent}>
                    {statuses.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          closeModals();
                          setStatus(item);
                        }}
                        style={[styles.titleButton, {marginTop: 5, marginBottom: 5}, index == 1 && {backgroundColor: colors.orange}, index == 2 && {backgroundColor: colors.red}]}>
                        <Text style={styles.titleButtonText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Modal>
            </>
          )}
        </>
      )}

      {selectingProfilePicture && (
        <>
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <TouchableOpacity onPress={returnToMainMenu} style={styles.closeButton}>
                <MaterialCommunityIcons name="arrow-left" size={40} />
              </TouchableOpacity>
              <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20}}>Select Image</Text>
            </View>
          </View>

          <View style={[styles.information, {alignItems: 'center'}]}>
            <TouchableOpacity onPress={() => updateImageSource('../../assets/1.png')}>
              <Image style={styles.image} source={require('../../assets/1.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateImageSource('../../assets/2.png')}>
              <Image style={styles.image} source={require('../../assets/2.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateImageSource('../../assets/3.png')}>
              <Image style={styles.image} source={require('../../assets/3.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateImageSource('./assets/4.png')}>
              <Image style={styles.image} source={require('../../assets/4.png')} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};
