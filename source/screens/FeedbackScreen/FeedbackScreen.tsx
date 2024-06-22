import React, {useState, useEffect, useCallback} from 'react';
import {Alert, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard, ScrollView, Pressable} from 'react-native';
import { useQuery, useRealm, useUser } from '@realm/react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import styles from './FeedbackScreen.style';
import { colors } from '../../sharedStyling/Colors';
import { Feedback } from '../../schemas/FeedbackSchema';
import { BSON } from 'realm';

type FeedbackScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Feedback'>;
}

export const FeedbackScreen = ({ navigation }: FeedbackScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const goBack = () => {
        navigation.goBack()
    }

    const submitFeedback = () => {
        realm.write(() => {
            return new Feedback(realm, {
              _id: new BSON.ObjectID,
              rating: selectedRating,
              feedback: commentText,
            })
          })
    }

    const handleConfirm = () => {
        
        Alert.alert(
            'Confirm Action',
            'Are you sure you want to submit this feedback?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {submitFeedback(); goBack()},
              },
            ],
            { cancelable: false }
          );
          
        
      };

    const [selectedRating, setSelectedRating] = useState<string>('')
    const [commentText, setCommentText] = useState<string>('')

    const selectRating = (rating:string) => {

        if(selectedRating == rating)
        {
            setSelectedRating("")
        }
        else
        {
            setSelectedRating(rating)
        }
        
    }

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
          mutableSubs.add(
            realm.objects(Feedback),
          );
  
        });
    }, [realm, user]);

    return (
        <Pressable style={styles.container} onPress={Keyboard.dismiss}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10, position: 'absolute', zIndex: 2}}>
                <View style={styles.headerTitle}>
                    <TouchableOpacity onPress={goBack} >
                        <MaterialCommunityIcons name="arrow-left" color={'black'} size={40} style={{marginLeft: 10,}}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 20, fontWeight: '800', marginLeft: 20,}}>Feedback</Text>
                </View>

                
                    <TouchableOpacity onPress={handleConfirm} >
                        <MaterialCommunityIcons name="check" color={'black'} size={40} style={{marginRight: 10,}}/>
                    </TouchableOpacity>
                   
               
            </View>

            <View style={styles.containerFeedback}>
                <Text style={styles.title}>Rate Your Experience</Text>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.button, {backgroundColor: colors.red}, selectedRating == "Bad" && styles.selected]} onPress={() => selectRating("Bad")}>
                        <Text style={styles.buttonText}>Bad</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: colors.orange}, selectedRating == "Okay" && styles.selected]} onPress={() => selectRating("Okay")}>
                        <Text style={styles.buttonText}>Okay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: '#c6de21'}, selectedRating == "Good" && styles.selected]} onPress={() => selectRating("Good")}>
                        <Text style={styles.buttonText}>Good</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: colors.green}, selectedRating == "Great" && styles.selected]} onPress={() => selectRating("Great")}>
                        <Text style={styles.buttonText}>Great</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.smallBorder}></View>

            <View>
            <Text style={styles.commentTitle}>Write Your Comment (Optional)</Text>
            <TextInput
                style={[styles.textInput]}
                multiline={true}
                numberOfLines={20}
                value={commentText}
                onChangeText={setCommentText}
                placeholder="If you have any input at all, please type it here..."
            />
            </View>

            
        </Pressable>
    )
}