import React, {useCallback, useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useRealm, useUser} from '@realm/react';
import {Groups} from '../../schemas/GroupsSchema';
import {BSON} from 'realm';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './CreateGroupScreen.style';
import Modal from 'react-native-modal';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import {shadow} from '../../sharedStyling/Shadow';
import {colors} from '../../sharedStyling/Colors';
import {RouteProp} from '@react-navigation/native';

type CreateGroupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CreateGroup'>;
  route: RouteProp<RootStackParamList, 'CreateGroup'>;
};

export const CreateGroupScreen = ({navigation, route}: CreateGroupScreenProps) => {
  const realm = useRealm();
  const user = useUser();

  const {isClub} = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(colors.purple);
  const [groupSport, setGroupSport] = useState('');
  const [image, setImage] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);

  function handleSubmit() {
    if (!groupName.trim()) {
      Alert.alert('Please enter a name');
      return;
    } else if (image.trim().length == 0) {
      Alert.alert('Please select a group picture');
    }
    // Create the group (implement this logic as needed)
    createGroup(groupName, groupDescription, groupSport, selectedColor, image, isClub, isPublic);

    // Show success message or navigate to another screen
    Alert.alert('Successfully created group');
    goBack();
  }

  const generateTag = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '#';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  };

  const createGroup = useCallback(
    (groupName: string, groupDescription: string, groupSport: string, groupColor: string, groupImage: string, isClub: boolean, isPublic: boolean) => {
      console.log(groupName);
      // if the realm exists, create an Item

      realm.write(() => {
        return new Groups(realm, {
          _id: new BSON.ObjectID(),
          dateCreated: new Date(),
          description: groupDescription,
          groupId: new BSON.ObjectID().toString(),
          memberRoles: ['captain'],
          members: [user.id],
          membersDateJoined: [new Date()],
          name: groupName,
          owner: user.id,
          color: groupColor,
          sport: groupSport,
          image: groupImage,
          isClub: isClub,
          isPublic: isPublic,
          groupTag: generateTag(),
        });
      });
    },
    [realm, user],
  );

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Groups));
    });
  }, [realm, user]);

  const colorsArray = [
    {color: colors.red, light: '#FF7F7F', dark: '#920f0a'}, // Light Red, Dark Red
    {color: '#ec9513', light: '#f6cc8e', dark: '#c37b10'}, // Light Orange, Dark Orange
    {color: '#f1f627', light: '#f8fb94', dark: '#b2b707'}, // Light Yellow, Dark Yellow
    {color: colors.green, light: '#90EE90', dark: '#1c8721'}, // Light Green, Dark Green
    {color: colors.green, light: '#ADD8E6', dark: '#2639be'}, // Light Blue, Dark Blue
    {color: colors.purple, light: '#D8BFD8', dark: '#9c27a0'}, // Light Purple, Dark Purple
    {color: colors.pink, light: '#f1abdf', dark: '#db2dae'}, // Light Pink, Dark Pink
  ];

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false);

  const onClose = () => {
    setModalVisible(false);
    setImageModalVisible(false);
  };

  const selectImage = (icon: string) => {
    setImage(icon);
    onClose();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View
        style={{
          width: '100%',
          height: 60,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={styles.headerTitle}>
          <TouchableOpacity onPress={goBack} style={styles.closeButton}>
            <MaterialCommunityIcons name="arrow-left" size={40} />
          </TouchableOpacity>
          <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20}}>Create group</Text>
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.check}>
          <MaterialCommunityIcons name="check" size={40} />
        </TouchableOpacity>
      </View>

      <View style={[styles.container, shadow.shadow]}>
        <TouchableOpacity style={[styles.conatinerImage, shadow.shadow]}>
          {image && (
            <TouchableOpacity
              onPress={() => setImageModalVisible(true)}
              style={{
                backgroundColor: selectedColor,
                width: 100,
                height: 100,
                borderRadius: 100,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons name={image} size={80} color={'black'} />
            </TouchableOpacity>
          )}
          {!image && (
            <TouchableOpacity onPress={() => setImageModalVisible(true)}>
              <MaterialCommunityIcons name="image-edit-outline" size={40} color={'lightgray'} />
              <Text style={{color: 'white'}}>Choose</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        <View style={styles.containerInput}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput value={groupName} onChangeText={text => setGroupName(text)} placeholder="Enter group name" style={styles.input} />
        </View>
        <View style={[styles.containerInput, {flexDirection: 'row', justifyContent: 'space-between', width: 180}]}>
          <TouchableOpacity onPress={() => setIsPublic(true)} style={{display: 'flex', flexDirection: 'row'}}>
            <View
              style={[
                {
                  width: 25,
                  height: 25,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: colors.black,
                },
                isPublic && {backgroundColor: colors.black},
              ]}></View>
            <Text style={styles.inputTitle}>Public</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsPublic(false)} style={{display: 'flex', flexDirection: 'row'}}>
            <View
              style={[
                {
                  width: 25,
                  height: 25,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: colors.black,
                },
                !isPublic && {backgroundColor: colors.black},
              ]}></View>
            <Text style={styles.inputTitle}>Private</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerInput}>
          <Text style={styles.inputTitle}>Sport</Text>
          <TextInput value={groupSport} onChangeText={text => setGroupSport(text)} placeholder="Enter group sport" style={styles.input} />
        </View>
        <View style={styles.containerInput}>
          <Text style={styles.inputTitle}>Description</Text>
          <TextInput multiline numberOfLines={10} textAlignVertical="top" value={groupDescription} onChangeText={text => setGroupDescription(text)} placeholder="Enter group description" style={styles.textarea} />
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.inputTitle}>Select Colour</Text>
          <TouchableOpacity style={[styles.selectedColour, {backgroundColor: selectedColor}, shadow.shadow]} onPress={() => setModalVisible(true)}></TouchableOpacity>
        </View>
      </View>

      <Modal isVisible={modalVisible} swipeDirection={['down']} onSwipeComplete={onClose} onBackdropPress={onClose} style={styles.modalView}>
        <View style={styles.modalContent}>
          {colorsArray.map(item => (
            <View
              key={new BSON.ObjectID().toString()}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '90%',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                style={{
                  width: '33%',
                  height: 50,
                  borderRadius: 15,
                  backgroundColor: item.light,
                  marginLeft: 2.5,
                  marginRight: 2.5,
                }}
                onPress={() => {
                  setSelectedColor(item.light);
                  onClose();
                }}></TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '33%',
                  height: 50,
                  borderRadius: 15,
                  backgroundColor: item.color,
                  marginLeft: 2.5,
                  marginRight: 2.5,
                }}
                onPress={() => {
                  setSelectedColor(item.color);
                  onClose();
                }}></TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '33%',
                  height: 50,
                  borderRadius: 15,
                  backgroundColor: item.dark,
                  marginLeft: 2.5,
                  marginRight: 2.5,
                }}
                onPress={() => {
                  setSelectedColor(item.dark);
                  onClose();
                }}></TouchableOpacity>
            </View>
          ))}
        </View>
      </Modal>

      <Modal isVisible={imageModalVisible} swipeDirection={['down']} onSwipeComplete={onClose} onBackdropPress={onClose} style={styles.modalView}>
        <View style={styles.modalContent}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => selectImage('rugby')}>
              <MaterialCommunityIcons name="rugby" size={50} color={'black'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectImage('tennis-ball')}>
              <MaterialCommunityIcons name="tennis-ball" size={50} color={'black'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectImage('billiards')}>
              <MaterialCommunityIcons name="billiards" size={50} color={'black'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => selectImage('baseball')}>
              <MaterialCommunityIcons name="baseball" size={50} color={'black'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectImage('soccer')}>
              <MaterialCommunityIcons name="soccer" size={50} color={'black'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectImage('basketball')}>
              <MaterialCommunityIcons name="basketball" size={50} color={'black'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => selectImage('disc')}>
              <MaterialCommunityIcons name="disc" size={50} color={'black'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectImage('pokeball')}>
              <MaterialCommunityIcons name="pokeball" size={50} color={'black'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectImage('volleyball')}>
              <MaterialCommunityIcons name="volleyball" size={50} color={'black'} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
