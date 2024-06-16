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

type GroupScreenProps = {
    onPress:any;
    group:string;
}

export const GroupScreen = (props:GroupScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    let selectedGroup = useQuery(Groups).filtered("name == $0", props.group)
    const groupJoinRequests = useQuery(JoinGroupRequests).filtered('groupName == $0', props.group)

    const stringIds = selectedGroup[0].members.map(member => member)

    //console.log(groupJoinRequests)

    const [viewingWorkout, setViewingWorkout] = useState<boolean>(false)

    const handleHeaderState = () => {
        setViewingWorkout(true)
    }

    const [workoutData, setWorkoutData] = useState<any>();
    const [workoutDataType, setWorkoutDataType] = useState<string>();
    const loadData = (workoutId:any, dataType:string) => {

        let data:any = {}
        if(dataType == "Cardio")
        {
            data = realm.objects(CardioWorkout).filtered("_id == $0", workoutId)
        }
        else if(dataType == "Resistance")
        {
            data = realm.objects(ResistanceWorkout).filtered("_id == $0", workoutId)
        }
        //console.log(data)
        setWorkoutData(data)
        setWorkoutDataType(dataType)
    }

    const History = () => (
        <HistoryScreen group={props.group} onPress={() => handleHeaderState()} loadData={loadData}/>
    )

    const Leaderboard = () => (
        <LeaderboardScreen group={props.group}/>
    )

    const [modalPendingRequestsVisible, setModalPendingRequestsVisible] = useState<boolean>(false)

    const closePendingRequestsModal = () => {
        setModalPendingRequestsVisible(false)
    }

    const [modalUsersVisible, setModalUsersVisible] = useState<boolean>(false)
    const closeUsersModal = () => {
        setModalUsersVisible(false)
    }

    const getUserName = (userId:string) => {
        const user = realm.objects<Users>(Users).filtered('userId == $0', userId)[0]

        return user.username;
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

    const [selectedUser, setSelectedUser] = useState<string>("");
    const [viewingProfile, setViewingProfile] = useState<boolean>(false)

    const closeProfile = () => {
        setViewingProfile(false)
    }
       
    const [selectedPage, setSelectedPage] = useState(0)
    const pagerRef = React.useRef<PagerView>(null)

    const handlePageChange = (pageNumber:any) => {
        pagerRef.current?.setPage(pageNumber);
        setSelectedPage(pageNumber)
    }

    const stopViewingWorkout = () => {
        setViewingWorkout(false)
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
    
    return (
        
        <>

        {
            (!viewingWorkout && !viewingProfile) &&
            <View style={{width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => props.onPress("view")} style={styles.closeButton}>
                    <MaterialCommunityIcons name="close" size={40}/>
                </TouchableOpacity>
                
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
        }
        
        { 
            (!viewingWorkout && !viewingProfile) &&
            <>
                <View style={styles.pageVisualiser}>
                    <TouchableOpacity onPress={() => handlePageChange(0)} style={[styles.bar, selectedPage == 0 && {backgroundColor: colors.blue}]}><Text style={selectedPage == 0 && {color: 'white', fontWeight: '800'}}>History</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePageChange(1)} style={[styles.bar, selectedPage == 1 && {backgroundColor: colors.blue}]}><Text style={selectedPage == 1 && {color: 'white', fontWeight: '800'}}>Leaderboard</Text></TouchableOpacity>
                </View>
                <PagerView style={styles.pagerView} initialPage={selectedPage} onPageSelected={(event) => {setSelectedPage(event.nativeEvent.position)}} scrollEnabled={true} ref={pagerRef}>
                    <History key="1"/>
                    <Leaderboard key="2"/>
                </PagerView>
            </>
        }

        {
            (viewingWorkout && !viewingProfile) &&
            <WorkoutDisplayScreen data={workoutData} dataType={workoutDataType} onPress={stopViewingWorkout}/>
        }

        {
            viewingProfile &&
            <Text>Viewing Profile</Text>
        }

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
                                    <Image source={getProfilePicture(item)} style={styles.image}/>
                                    <View>
                                        <Text style={styles.username}>{getUserName(item)}</Text>
                                        <Text style={styles.role}>{getUserRole(item)}</Text>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={() => {setModalUsersVisible(false); setSelectedUser(item); setViewingProfile(true)}}><Text style={styles.buttonText}>View Profile</Text></TouchableOpacity>
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

