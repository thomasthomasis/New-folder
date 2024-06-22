import { useCallback, useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { colors } from "../../sharedStyling/Colors";
import { useQuery, useRealm, useUser } from "@realm/react";
import { Groups } from "../../schemas/GroupsSchema";
import { BSON } from "realm";
import PagerView from "react-native-pager-view";
import { HistoryScreen } from "../HistoryScreen/HistoryScreen";
import { LeaderboardScreen } from "../LeaderboardScreen/LeaderboardScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from 'react-native-modal';
import { JoinGroupRequests } from "../../schemas/JoinGroupRequestsSchema";
import { Users } from "../../schemas/UsersSchema";
import React from "react";
import { WorkoutDisplayScreen } from "../WorkoutDisplayScreen/WorkoutDisplayScreen";
import { CardioWorkout } from "../../schemas/CardioWorkoutSchema";
import { ResistanceWorkout } from "../../schemas/ResistanceWorkoutSchema";
import { ProfileScreen } from "../ProfileScreen/ProfileScreen";
import styles from "./GroupScreen.style";

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navgiation/NavigationTypes'; // Replace with your navigation types file
import { RouteProp, useNavigation } from '@react-navigation/native'

type GroupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Group'>; // Adjust according to your navigation stack
  route: RouteProp<RootStackParamList, 'Group'>;
};

export const GroupScreen = ({ navigation, route }:GroupScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const { group } = route.params
    let groupName = group;

    const goBack = () => {
        navigation.goBack()
    }

    const goToProfileScreen = (userId:string, restrictedView:boolean) => {
        navigation.navigate("ProfileScreen", { userId: userId, restrictedView: restrictedView})
    }

    let selectedGroup = useQuery(Groups).filtered("name == $0", group)
    const groupJoinRequests = useQuery(JoinGroupRequests).filtered('groupName == $0', group)

    const stringIds = selectedGroup[0].members.map(member => member)

    //console.log(groupJoinRequests)

    const History = () => (
        <HistoryScreen navigation={navigation as StackNavigationProp<RootStackParamList, 'History'>} route={{ key: 'History', name: 'History', params: { group: group } }} />
    )

    const Leaderboard = () => (
        <LeaderboardScreen group={group}/>
    )

    const [modalPendingRequestsVisible, setModalPendingRequestsVisible] = useState<boolean>(false)

    const closePendingRequestsModal = () => {
        setModalPendingRequestsVisible(false)
    }

    const [modalUsersVisible, setModalUsersVisible] = useState<boolean>(false)
    const closeUsersModal = () => {
        setModalUsersVisible(false)
    }

    const isOwner = (groupName:string, user:string) => {
        const group = realm.objects(Groups).filtered("name == $0", groupName)

        if(user == group[0].owner)
            {
                return true
            }

        return false
    }

    const getUserName = (userId:string) => {
        const user = realm.objects<Users>(Users).filtered('userId == $0', userId)[0]

        return user.username;
    }

    const getUserStatus = (userId:string) => {
        const user = realm.objects<Users>(Users).filtered('userId == $0', userId)[0]

        return user.status;
    }

    const getUserRole = (userId:string) => {

        const index = stringIds.indexOf(userId)

        const role = selectedGroup[0].memberRoles[index];

        return role;
    }

    const getProfilePicture = (userId:string) => {

        const user:any = realm.objects("Users").filtered('userId == $0', userId)[0]

        console.log(user)
        

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

    const acceptUser = (userId:string) => {
        if(selectedGroup != null)
        {
            realm.write(() => {
                selectedGroup[0].members.push(userId),
                selectedGroup[0].memberRoles.push("player")
                selectedGroup[0].membersDateJoined.push(new Date())
            })
        }

        const groupJoinRequest = realm.objects<JoinGroupRequests>(JoinGroupRequests).filtered('userId == $0', userId)

        if(groupJoinRequest != null)
        {
            realm.write(() => {
                realm.delete(groupJoinRequest);
            });
        }
    }

    const rejectUser = (userId:string) => {
        const groupJoinRequest = realm.objects<JoinGroupRequests>(JoinGroupRequests).filtered('userId == $0', userId)

        if(groupJoinRequest != null)
        {
            realm.write(() => {
                realm.delete(groupJoinRequest);
            });
        }
    }
       
    const [selectedPage, setSelectedPage] = useState(0)
    const pagerRef = React.useRef<PagerView>(null)

    const handlePageChange = (pageNumber:any) => {
        pagerRef.current?.setPage(pageNumber);
        setSelectedPage(pageNumber)
    }

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
                realm.objects(Groups)
            )
            mutableSubs.add(
                realm.objects(JoinGroupRequests)
            )
            mutableSubs.add(
                realm.objects(Users)
            )

            mutableSubs.add(
                realm.objects(CardioWorkout)
            )
    
            mutableSubs.add(
                realm.objects(ResistanceWorkout)
            )
        });
        }, [realm, user]);

        const truncateText = (text:string, limit:number) => {
            if (text.length > limit) {
                return text.substring(0, limit) + '...';
              }
              return text;
        }
    
    return (
        
        <> 
            <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                    <MaterialCommunityIcons name="close" size={40}/>
                    <Text style={styles.headerTitle}>{truncateText(selectedGroup[0].name, 15)}</Text>
                </TouchableOpacity>
                
                {
                    user.id != selectedGroup[0].owner &&
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <TouchableOpacity style={{marginRight: 10,}} onPress={() => setModalUsersVisible(true)}>
                            <MaterialCommunityIcons name="account-group" size={40}/>
                        </TouchableOpacity>
                    </View>
                }
                {
                    user.id == selectedGroup[0].owner &&
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <TouchableOpacity style={{marginRight: 10,}} onPress={() => setModalUsersVisible(true)}>
                            <MaterialCommunityIcons name="account-group" size={40}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginRight: 10,}} onPress={() => setModalPendingRequestsVisible(true)}>
                            <MaterialCommunityIcons name="bell" size={40} style={[groupJoinRequests.length > 0 && {color: colors.orange}, groupJoinRequests.length == 0 && {color: 'lightgray'}]}/>
                        </TouchableOpacity>
                        
                    </View>
                }
            </View>

        <>
            <View style={styles.pageVisualiser}>
                <TouchableOpacity onPress={() => handlePageChange(0)} style={[styles.bar, selectedPage == 0 && {backgroundColor: colors.blue}, (selectedGroup[0].color != null && selectedPage == 0) && {backgroundColor: selectedGroup[0].color}]}><Text style={selectedPage == 0 && {color: 'white', fontWeight: '800'}}>History</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handlePageChange(1)} style={[styles.bar, selectedPage == 1 && {backgroundColor: colors.blue}, (selectedGroup[0].color != null && selectedPage == 1) && {backgroundColor: selectedGroup[0].color}]}><Text style={selectedPage == 1 && {color: 'white', fontWeight: '800'}}>Leaderboard</Text></TouchableOpacity>
            </View>
            <PagerView style={styles.pagerView} initialPage={selectedPage} onPageSelected={(event) => {setSelectedPage(event.nativeEvent.position)}} scrollEnabled={true} ref={pagerRef}>
                <History key="1"/>
                <Leaderboard key="2"/>
            </PagerView>
        </>

        <Modal
                isVisible={modalPendingRequestsVisible}
                swipeDirection={['down']}
                onSwipeComplete={closePendingRequestsModal}
                onBackdropPress={closePendingRequestsModal}
                style={styles.modalView}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{groupJoinRequests.length} pending request(s)</Text>
                    <View style={[styles.smallBorder, {width: 250, marginBottom: 20}]}></View>
                    {
                        groupJoinRequests.map((group:any, index:any) => {
                            return (
                                <View key={(new BSON.ObjectID()).toString()} style={{display: 'flex', flexDirection: 'row'}}>
                                    <View key={index} style={styles.group}>
                                    <Text style={{fontSize: 20, color: 'white', fontWeight: '800',}}>{getUserName(group.userId)}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => acceptUser(group.userId)}>
                                        <MaterialCommunityIcons key={(new BSON.ObjectID()).toString()} name="check" size={40} style={{color: colors.green, marginLeft: 10, marginRight: 10}}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => rejectUser(group.userId)}>
                                        <MaterialCommunityIcons key={(new BSON.ObjectID()).toString()} name="close" size={40} style={{color: colors.red, marginLeft: 10, marginRight: 10}}/>
                                    </TouchableOpacity>
                                    
                                </View>
                                
                            )
                        })
                    }
                </View>
            </Modal>

            <Modal
                isVisible={modalUsersVisible}
                swipeDirection={['down']}
                onSwipeComplete={closeUsersModal}
                onBackdropPress={closeUsersModal}
                style={styles.modalView}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{selectedGroup[0].members.length} Users</Text>
                    <View style={[styles.smallBorder, {width: 250, marginBottom: 20}]}></View>
                    <FlatList 
                        data = {selectedGroup[0].members}
                        renderItem={({item, index}) => (
                            <>
                            <View key={(new BSON.ObjectID()).toString()} style={styles.userInfoContainer}>
                                <View style={styles.userData}>
                                    <View>
                                        <Image source={getProfilePicture(item)} style={styles.image}/>
                                        {
                                            getUserStatus(item) == "Injured" &&
                                            <MaterialCommunityIcons name="circle" size={25} color={colors.red} style={{position: 'absolute', bottom: 0, right: 10,}}/>
                                        }
                                        {
                                            getUserStatus(item) == "Away" &&
                                            <MaterialCommunityIcons name="circle" size={25} color={colors.orange} style={{position: 'absolute', bottom: 0, right: 10,}}/>
                                        }
                                    </View>
                                    
                                    <View>
                                        <Text style={styles.username}>{getUserName(item)}</Text>
                                        <Text style={styles.role}>{getUserRole(item)}</Text>
                                        {
                                            isOwner(groupName, item) &&
                                            <Text style={styles.role}>owner</Text>
                                        }
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={() => {setModalUsersVisible(false); goToProfileScreen(item, true)}}><Text style={styles.buttonText}>View Profile</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.border}>
                            </View>
                            </>

                        )}
                        keyExtractor={(item) => item}
                    />
                </View>
            </Modal>
      </>
    )
}

