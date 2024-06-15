import { useQuery, useRealm, useUser } from "@realm/react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Groups } from "../../schemas/GroupsSchema";
import { useEffect, useState } from "react";
import { UserStatistics } from "../../schemas/UserStatisticsSchema";
import SelectDropdown from "react-native-select-dropdown";
import { colors } from "../../sharedStyling/Colors";
import { Users } from "../../schemas/UsersSchema";
import React from "react";
import styles from "./LeaderboardScreen.style";


type LeaderboardScreenProps = {
    group:string,
}

export const LeaderboardScreen = (props:LeaderboardScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const group = useQuery(Groups).filtered('name == $0', props.group);
    const stringIds = group[0].members.map(member => member)
    let userStatistics = useQuery(UserStatistics).filtered("userId IN $0", stringIds).sorted("numWorkouts", true)
    const userData = useQuery(Users).filtered("userId IN $0", stringIds)

    const [userStats, setUserStats] = useState<Realm.Results<UserStatistics>>(userStatistics)

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
            realm.objects(Groups)
            )
        });
    }, [realm, user]);

    const filters = ["Workouts", "Cardio Workouts", "Resistance Workouts"]
    const [selectedFilter, setSelectedFilter] = useState('Workouts')
    

    const chooseFilter = (filter:string) => {

        setSelectedFilter(filter)

        if(filter == "Workouts")
        {
            userStatistics = userStatistics.sorted('numWorkouts', true)
            setUserStats(userStatistics)
        }
        else if(filter == "Cardio Workouts")
        {
            userStatistics = userStatistics.sorted('numCardioWorkouts', true)
            setUserStats(userStatistics)
        }
        else if(filter == "Resistance Workouts")
        {
            userStatistics = userStatistics.sorted('numResistanceWorkouts', true)
            setUserStats(userStatistics)
        }
    }

    const getProfilePicture = (path:string) => {
        
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


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <SelectDropdown
                data={filters}
                onSelect={(selectedItem) => {
                chooseFilter(selectedItem)
                }}
                buttonStyle={styles.dropdownButton}
                buttonTextStyle={styles.buttonText}
                defaultButtonText='Select Filter'
                defaultValue={'Workouts'}
            />
            <View style={styles.containerLeaderBoard}>

            <View style={styles.containerColumn}>
            {userStats.slice(0, 3).map((statistic:any, index:any) => {

                

                const user = userData.find(data => data.userId === statistic.userId);

                const profilePicture: string | undefined = user?.profilePicture;

                let path;
                if(profilePicture)
                {
                    path = getProfilePicture(profilePicture)
                }

                if(user) {
                    return (
                        
                    <View key={index} style={styles.column}>
                        <Text style={[styles.rowText, {fontSize: 30, color: colors.green, fontWeight: '900'}]}>{index + 1}</Text>
                        {
                            profilePicture && 
                            <Image source={path} style={[styles.imageColumn, {height: (190 - (index * 30))}]}/>
                        }
                        <Text style={[styles.rowText, {color: colors.green}]}>{user.username}</Text>
                    </View>
                       
                    )
                }
            })

            }
            </View>
            <View style={{width: '90%', height: 3, backgroundColor: 'lightgray', marginBottom: 20,}}></View>
                
            {userStats.map((statistic, index) => {

                const user = userData.find(data => data.userId === statistic.userId)

                const profilePicture: string | undefined = user?.profilePicture;

                let path;
                if(profilePicture)
                {
                    path = getProfilePicture(profilePicture)
                }


                if(user) {
                    return (
                        <View key={statistic._id.toString()} style={styles.row}>
                            <Text style={[styles.rowText, {marginRight: 10}]}>{index + 1}</Text>
                            <Image source={path} style={styles.image}/>
                            
                            <View style={{width: 170}}>
                                <Text style={styles.rowText}>{user.username}</Text>
                            </View>
                            {
                                selectedFilter == "Workouts" &&
                                <Text style={styles.rowText}>{statistic.numWorkouts}</Text>
                            }
                            {
                                selectedFilter == "Cardio Workouts" &&
                                <Text style={styles.rowText}>{statistic.numCardioWorkouts}</Text>
        
                            }
                            {
                                selectedFilter == "Resistance Workouts" &&
                                <Text style={styles.rowText}>{statistic.numResistanceWorkouts}</Text>
        
                            }
                        </View>
                    )
                }
               
            }
            
            )}
            </View>
            
        </ScrollView>
    )
}

