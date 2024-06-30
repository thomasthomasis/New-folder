import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Text, View, Image, TouchableOpacity, Linking, FlatList} from 'react-native';
import { useRealm, useUser } from '@realm/react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './GroupEventScreen.style';
import Modal from 'react-native-modal';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp } from '@react-navigation/native'
import { Groups } from '../../schemas/GroupsSchema';
import { GroupEvents } from '../../schemas/GroupEventsScehma';
import { BSON } from 'realm';
import { colors } from '../../sharedStyling/Colors';
import { Users } from '../../schemas/UsersSchema';
import { ScrollView } from 'react-native-gesture-handler';
import { shadow } from '../../sharedStyling/Shadow';

type GroupEventScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'GroupEvent'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'GroupEvent'>;
};

export const GroupEventScreen = ({ navigation, route}: GroupEventScreenProps) => {

    const realm = useRealm();
    const user = useUser();

    const { event } = route.params;

    //console.log(event)

    const goBack = () => {
        navigation.goBack()
    }

    const goToEditEvent = (eventId:string) => {
        console.log("edit event: ", eventId)
    }

    const truncateText = (text:string, limit:number) => {
        if (text.length > limit) {
            return text.substring(0, limit) + '...';
          }
          return text;
    }

    const deleteEvent = (eventId:string) => {
        const event = realm.objects(GroupEvents).filtered("eventId == $0", eventId)

        realm.write(() => {
            realm.delete(event)
        })
    }

    const handleConfirmDeletion = (eventId:string) => {
        // Show confirmation popup
        Alert.alert(
          'Confirm Action',
          'Are you sure you want to edit this exercise?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {deleteEvent(eventId); goBack()},
            },
          ],
          { cancelable: false }
        );
      };


    let eventData = realm.objects(GroupEvents).filtered("eventId == $0", event)
    const [eventUseState, setEventUseState] = useState<any>(eventData)

    const formatDate = (date:Date) => {
        const targetDate = new Date(date);
        
        // Ensure the target date is valid
        if (isNaN(targetDate.getTime())) {
            return 'Invalid date';
        }
        
        const day = targetDate.getDate();
        const month = targetDate.toLocaleString('default', { month: 'short' });
        const year = targetDate.getFullYear();
        
        // Function to get the ordinal suffix for a given day
        const getOrdinalSuffix = (day:any) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
            }
        };
        
        const dayWithSuffix = day + getOrdinalSuffix(day);
        
        return `${dayWithSuffix} ${month} ${year}`;
    }

    const getDuration = (startDate:Date, endDate:Date) => {
        const diffInMs = Math.abs(endDate.getTime() - startDate.getTime());
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30); // Approximation
        const diffInYears = Math.floor(diffInDays / 365); // Approximation
      
        if (diffInYears > 0) return `${diffInYears} years`;
        if (diffInMonths > 0) return `${diffInMonths} months`;
        if (diffInWeeks > 0) return `${diffInWeeks} weeks`;
        if (diffInDays > 0) return `${diffInDays} days`;
        if (diffInHours > 0) return `${diffInHours} hours`;
        if (diffInMinutes > 0) return `${diffInMinutes} minutes`;
        return `${diffInSeconds} seconds`;
    }

    const formatTo24HourTime = (date:Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      }

    const goToLink = (url:string) => {
        Linking.openURL(url).catch((err) => Alert.alert("Link Broken..."))
    }

    const [interested, setInterested] = useState<string>("")
    useEffect(() => {
        if(eventData[0].usersReacted.includes(user.id))
        {
            setInterested(eventData[0].reactions[eventData[0].usersReacted.indexOf(user.id)])
            console.log(eventData[0].reactions[eventData[0].usersReacted.indexOf(user.id)])
        }
    }, [])

    const isInterested = (value:string) => {
        if(interested == value)
        {
            setInterested("")
        }
        else
        {
            setInterested(value)
        }
    }

    
    const getUserName = (userId:string) => {
        const user = realm.objects<Users>(Users).filtered('userId == $0', userId)[0]

        return user.username;
    }

    const getProfilePicture = (userId:string) => {
        const user:any = realm.objects("Users").filtered('userId == $0', userId)[0]

        //console.log(user)
        

        if(user.profilePicture)
        {
            const path = user.profilePicture ?? ""

            if(path.includes('1'))
            {
                return require('../../assets/1.png')
            }
            else if(path.includes('2'))
            {
                return require('../../assets/2.png')
            }
            else if(path.includes('3'))
            {
                return require('../../assets/3.png')
            }
            else if(path.includes('4'))
            {
                return require('../../assets/4.png')
            }
        }

        else
        {
            return ""
        }
        
        
      }

    const showInterest = (interest:string) => {

        let usersReacted = eventData[0].usersReacted;
        let reactions = eventData[0].reactions;

        if (usersReacted.includes(user.id)) {
            let index = usersReacted.indexOf(user.id);

            realm.write(() => {
                if (reactions[index] === interest) {
                reactions[index] = "null";
                } else {
                reactions[index] = interest;
                }
                eventData[0].reactions = reactions;
            });
        }
        else
        {
    
            realm.write(() => {
                eventData[0].usersReacted.push(user.id),
                eventData[0].reactions.push(interest)
              });
        }

        eventData = realm.objects(GroupEvents).filtered("eventId == $0", event)
        setEventUseState(realm.objects(GroupEvents).filtered("eventId == $0", event)) 
    }

    const getNumInterested = () => {
        let amount = 0;

        for(let i = 0; i < eventData[0].reactions.length; i++)
        {
            if(eventData[0].reactions[i] == "interested")
            {
                amount++;
            }
        }

        return amount;
    }

    const getNumDeclined = () => {
        let amount = 0;

        for(let i = 0; i < eventData[0].reactions.length; i++)
        {
            if(eventData[0].reactions[i] == "declined")
            {
                amount++;
            }
        }

        return amount;
    }

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
                realm.objects(Groups)
            )
            mutableSubs.add(
                realm.objects(Users)
            )
        });
        }, [realm, user]);

    return (
        <>
            <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                    <MaterialCommunityIcons name="arrow-left" size={40}/>
                    <Text style={styles.headerTitle}>{truncateText(eventData[0].name ?? "", 15)}</Text>
                </TouchableOpacity>
                <View style={styles.column}>
                    <TouchableOpacity onPress={() => goToEditEvent(eventData[0].eventId)}>
                        <MaterialCommunityIcons name="pencil" size={40}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleConfirmDeletion(eventData[0].eventId)}>
                        <MaterialCommunityIcons name="delete" size={40}/>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.conatinerDates}>
                    <View>
                        <Text style={[styles.dateText, {fontSize: 30, color: colors.blue}]}>{formatTo24HourTime(eventData[0].startDate ?? new Date())}</Text>
                        <Text style={[styles.dateText, {fontSize: 25, color: colors.blue}]}>{getDuration(eventData[0].startDate ?? new Date(), eventData[0].endDate ?? new Date())}</Text>
                        <Text style={styles.dateText}>{formatDate(eventData[0].startDate ?? new Date())}</Text>
                    </View>
                    
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <TouchableOpacity style={[styles.icon, interested == "interested" && {backgroundColor: colors.green}, shadow.shadow]} onPress={() => {isInterested("interested"); showInterest("interested")}}>
                            <MaterialCommunityIcons name="check" size={40}/>
                        </TouchableOpacity>
                        <TouchableOpacity  style={[styles.icon, interested == "declined" && {backgroundColor: colors.red}, shadow.shadow]} onPress={() => {isInterested("declined"); showInterest("declined")}}>
                            <MaterialCommunityIcons name="close" size={40}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.border}></View>

                {
                    eventData[0].linkTitles.length > 1 &&
                    <View>
                        <Text style={{fontWeight: '800', fontSize: 20, marginRight: 10, textAlign: 'center', marginBottom: 5}}>Event Links</Text>
                        {
                            eventData[0].linkTitles.map((item, index) => (
                                ( item != "") ? (
                                    <TouchableOpacity key={new BSON.ObjectID().toString()} onPress={() => goToLink(eventData[0].links[index])} style={styles.link}>
                                        <Text style={styles.linkText}>{item}</Text>
                                    </TouchableOpacity>
                                ) : null
                                
                            ))
                        }
                        <View style={styles.border}></View>
                    </View>
                }
               

                {

                }
               <View style={styles.containerUsers}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15,}}>
                    <Text style={{fontWeight: '800', fontSize: 20, marginRight: 10}}>Interested</Text>
                    <Text style={styles.usersAmount}>{getNumInterested()}</Text>
                </View>
                
                {
                    eventData[0].usersReacted.map((item, index) => (
                        (item != "" && eventData[0].reactions[index] == "interested") ? (
                            <View key={new BSON.ObjectID().toString()} style={styles.profile}>
                                <Image source={getProfilePicture(item)} style={styles.image}/>
                                <Text style={styles.username}>{getUserName(item)}</Text>
                            </View>
                        ) : null
                        
                    ))
                }

                <View style={[styles.border, {marginTop: 10,}]}></View>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15,}}>
                    <Text style={{fontWeight: '800', fontSize: 20, marginRight: 10}}>Declined</Text>
                    <Text style={[styles.usersAmount, {backgroundColor: colors.red}]}>{getNumDeclined()}</Text>
                </View>
                {
                    eventData[0].usersReacted.map((item, index) => (
                        (item != "" && eventData[0].reactions[index] == "declined") ? (
                            
                            <View key={new BSON.ObjectID().toString()} style={styles.profile}>
                                <Image source={getProfilePicture(item)} style={styles.image}/>
                                <Text style={styles.username}>{getUserName(item)}</Text>
                            </View>
                        ) : null
                        
                    ))
                }
               </View>
            </ScrollView>

           
        </>
        
    )
}