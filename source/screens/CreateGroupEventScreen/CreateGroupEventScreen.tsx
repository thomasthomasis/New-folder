import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Platform} from 'react-native';
import { useRealm, useUser } from '@realm/react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './CreateGroupEventScreen.style';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp } from '@react-navigation/native'
import Modal from 'react-native-modal';
import { colors } from '../../sharedStyling/Colors';
import { GroupEvents } from '../../schemas/GroupEventsScehma';
import { BSON } from 'realm';
import { shadow } from '../../sharedStyling/Shadow';
import DateTimePicker from '@react-native-community/datetimepicker';


type CreateGroupEventScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CreateGroupEvent'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'CreateGroupEvent'>;
};

export const CreateGroupEventScreen = ({ navigation, route}: CreateGroupEventScreenProps) => {

    const realm = useRealm();
    const user = useUser();

    const { group } = route.params;

    const goBack = () => {
        navigation.goBack()
    }

    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
    const [selectedColor, setSelectedColor] = useState<string>(colors.purple)

    const onChange = (event:any, selectedDate:any) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    type InputPair = {
        input1:string;
        input2:string;
    }

    // State to hold the list of text input values
    const [inputPairs, setInputPairs] = useState<InputPair[]>([]);

    // Handler to add a new pair of input fields
    const addInputPair = () => {
        setInputPairs([...inputPairs, { input1: '', input2: '' }]);
    };
    
    // Handler to handle text input changes
    const handleInputChange = (text:string, index:any, inputKey:any) => {
        const newInputPairs:any = [...inputPairs];
        newInputPairs[index][inputKey] = text;
        setInputPairs(newInputPairs);
    };
    
    // Handler to remove a pair of input fields
    const removeInputPair = (index:any) => {
        const newInputPairs = inputPairs.filter((_, i) => i !== index);
        setInputPairs(newInputPairs);
    };

    const colorsArray = [
        { color: colors.red, light: '#FF7F7F', dark: '#920f0a' },    // Light Red, Dark Red
        { color: '#ec9513', light: '#f6cc8e', dark: '#c37b10' }, // Light Orange, Dark Orange
        { color: '#f1f627', light: '#f8fb94', dark: '#b2b707' }, // Light Yellow, Dark Yellow
        { color: colors.green, light: '#90EE90', dark: '#1c8721' },  // Light Green, Dark Green
        { color: colors.blue, light: '#ADD8E6', dark: '#2639be' },   // Light Blue, Dark Blue
        { color: colors.purple, light: '#D8BFD8', dark: '#9c27a0' }, // Light Purple, Dark Purple
        { color: colors.pink, light: '#f1abdf', dark: '#db2dae' }    // Light Pink, Dark Pink
      ];
    
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    const onClose = () => {
        setModalVisible(false)
    }

    const createGroupEvent = (name:string, date:Date, color:string) => {

        const linkTitles:string[] = []
        const links:string[] = []

        inputPairs.forEach(pair => {
            linkTitles.push(pair.input1);
            links.push(pair.input2);
          });

        realm.write(() => {
      
            return new GroupEvents(realm, {
                _id: new BSON.ObjectID,
                groupId: group,
                eventId: new BSON.ObjectID().toString(),
                name:name,
                date:date,
                color:color,
                reactions: [],
                usersReacted: [],
                links: links,
                linkTitles: linkTitles,
            });
          });
    }

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
            realm.objects(GroupEvents)
            )
        });
        }, [realm, user]);

    const handleSubmit = () => {
     
        // Create the group (implement this logic as needed)
        createGroupEvent(name, date, selectedColor);
        
        // Show success message or navigate to another screen
        Alert.alert("Successfully created group");
        goBack()
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
                <View style={styles.headerTitle}>
                    <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                        <MaterialCommunityIcons name="arrow-left" size={40}/>
                    </TouchableOpacity> 
                    <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20,}}>Create Event</Text>
                </View>
                
                <TouchableOpacity onPress={handleSubmit} style={styles.check}>
                    <MaterialCommunityIcons name="check" size={40}/>
                </TouchableOpacity>
            </View>

            {
                showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date" // Change this to 'time' for a time picker
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )
            }

            <View style={[styles.container, shadow.shadow]}>
    
                <View style={styles.containerInput}>
                    <Text style={styles.inputTitle}>Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={text => setName(text)}
                        placeholder="Enter group name"
                        style={styles.input}
                    />
                </View>

                <View style={styles.containerInput}>
                    <Text style={styles.inputTitle}>Date</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                        <Text>{date.toDateString()}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.border}></View>

                {inputPairs.map((inputPair, index) => (
                    <View key={index} style={styles.containerLinks}>
                        <View style={[styles.containerInput, {width: '100%', marginBottom: 0}]}>
                        <Text style={styles.inputTitle}>Link Title</Text>
                        <TextInput
                            value={inputPair.input1}
                            onChangeText={text => handleInputChange(text, index, 'input1')}
                            placeholder="Enter group name"
                            style={[styles.input, {marginBottom: 0,}]}
                        />
                        </View>

                        <View style={[styles.containerInput, {width: '100%',}]}>
                        <Text style={styles.inputTitle}>Link</Text>
                        <TextInput
                            value={inputPair.input2}
                            onChangeText={text => handleInputChange(text, index, 'input2')}
                            placeholder="Enter group name"
                            style={styles.input}
                        />
                        </View>
                        <TouchableOpacity onPress={() => removeInputPair(index)} style={[styles.addButton, {marginRight: 'auto', marginLeft: 'auto',}]}>
                            <Text style={[styles.addButtonText, {fontWeight: '500'}]}>Remove Link</Text>
                        </TouchableOpacity>
                        <View style={styles.border}></View>
                    </View>
                    ))}
                    <TouchableOpacity onPress={addInputPair} style={styles.addButton}>
                        <Text style={styles.addButtonText}>Add Link</Text>
                    </TouchableOpacity>

                
        
                
                <View style={styles.containerInput}>
                    <Text style={styles.inputTitle}>Select Colour</Text>
                    <TouchableOpacity style={[styles.selectedColour, {backgroundColor: selectedColor}, shadow.shadow]} onPress={() => setModalVisible(true)}></TouchableOpacity>
                </View>
            </View>

            <Modal
                isVisible={modalVisible}
                swipeDirection={['down']}
                onSwipeComplete={onClose}
                onBackdropPress={onClose}
                style={styles.modalView}
            >
                <View style={styles.modalContent}>
                {
                    colorsArray.map((item, index) => (
                        <View key={new BSON.ObjectID().toString()} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '90%', marginBottom: 10}}>
                            <TouchableOpacity style={{width: '33%', height: 50, borderRadius: 15, backgroundColor: item.light, marginLeft: 2.5, marginRight: 2.5}}  onPress={() => {setSelectedColor(item.light); onClose()}}></TouchableOpacity>
                            <TouchableOpacity style={{width: '33%', height: 50, borderRadius: 15, backgroundColor: item.color, marginLeft: 2.5, marginRight: 2.5}}  onPress={() => {setSelectedColor(item.color); onClose()}}></TouchableOpacity>
                            <TouchableOpacity style={{width: '33%', height: 50, borderRadius: 15, backgroundColor: item.dark, marginLeft: 2.5, marginRight: 2.5}} onPress={() => {setSelectedColor(item.dark); onClose()}}></TouchableOpacity>
                        </View>
                        
                    ))
                }
                </View>
                
            </Modal> 

            </ScrollView>
        
    )
}