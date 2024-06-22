import React, {useState, useEffect} from 'react';
import {Pressable, Text, View, Dimensions} from 'react-native';
import styles from './SpecificCardioStatsComponent.style';

import moment from 'moment'

type CardioStatsProps = {
    data:any,
    timeline:string,
    onPress:any,
}

export const SpecificCardioStatsComponent = (props: CardioStatsProps) => {

    const calculateDateEnding = (day:any) => {

        let lastChar = day.charAt(day.length - 1);
        
        if(lastChar == '1')
        {
            return 'st'
        }
        else if(lastChar == '2')
        {
            return 'nd'
        }
        else if(lastChar == '3')
        {
            return 'rd'
        }
        else if(lastChar == '4' || lastChar == '5' || lastChar == '6' || lastChar == '7' || lastChar == '8' || lastChar == '9' || lastChar == '0')
        {
            return 'th'
        }
    }


        const [remainingHeight, setRemainingHeight] = useState(0);

        useEffect(() => {
            // Get the screen height
            const screenHeight = Dimensions.get('window').height;

            // Calculate the heights of the header and footer
            const headerHeight = 120; // Example: replace with the actual height of your header
            const footerHeight = 50; // Example: replace with the actual height of your footer
            const calendarHeight = 160;

            // Calculate the remaining height
            const calculatedRemainingHeight = screenHeight - headerHeight - footerHeight - calendarHeight;

            // Update the state with the remaining height
            setRemainingHeight(calculatedRemainingHeight);
        }, []);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {
                    props.timeline == "week" &&
                    <Text style={styles.title}>Cardio Stats for the Week</Text>
                }
                {
                    props.timeline.includes("day") &&
                    <Text style={styles.title}>Cardio Stats for the {props.timeline.split(" ")[1]}{calculateDateEnding(props.timeline.split(" ")[1])}</Text>
                }
                
                <Pressable style={styles.closeButton} onPress={props.onPress}>
                    <Text style={{color: 'white', fontSize: 16}}>X</Text>    
                </Pressable>
            </View>
            
                    {
                        props.data.map((item:any) => {
                            return (
                                <StatsLayout key={item._id} dateCreated={item.dateCreated} exercise={item.exercise} time={item.time} distance={item.distance} extraNotes={item.extraNotes} timeline={props.timeline} id={item._id.toString()}/>
                            )
                            
                            
                        })
                    }
            
        </View>
    )
}

type StatsLayoutProps = {
    dateCreated:Date,
    exercise:string,
    time:string,
    distance:string,
    extraNotes:string,
    timeline:string,
    id:string,
}

const StatsLayout = (props: StatsLayoutProps) => {
    let dataArray = []

    

    for(let i = 0; i < props.exercise.length; i++)
    {
        let timeAndDistanceArray = []
        for(let j = 0; j < JSON.parse(props.time[i]).length; j++)
        {
            timeAndDistanceArray.push(JSON.parse(props.time[i])[j].value)
            timeAndDistanceArray.push(JSON.parse(props.distance[i])[j].value)
        }
        dataArray.push(JSON.parse(props.exercise[i]).value)
        dataArray.push(timeAndDistanceArray)
        dataArray.push(JSON.parse(props.extraNotes[i]))
    }


    const calculateDate = (date:Date) => {

        const formattedDate = moment(date).format('D MMM')
        return formattedDate;
    }

    const makeJSONNice = (data:string) => {
        
        let output = '';

        if(typeof(JSON.parse(data)) == typeof("string"))
        {
            output = data.slice(1, -1);
            return (
                <View style={styles.containerData}>
                    <Text style={styles.subTitle}>Exercise</Text>
                    <View style={styles.tinyBorder}></View>
                    <Text style={[styles.text, {textAlign: 'center'}]}>{output}</Text>
                </View>
                
            )
        }

        
        else if(JSON.parse(data).value != null)
        {
            output = JSON.parse(data).value
            return (
                <View>
                    <View style={styles.containerData}>
                        <Text style={styles.subTitle}>Extra Notes</Text>
                        <View style={styles.tinyBorder}></View>
                        <Text style={[styles.text, {textAlign: 'center'}]}>{output}</Text>
                    </View>

                    <View style={[styles.border, {backgroundColor: 'white'}]}></View>
                </View>
                
                
            )
        }
            
        else
        {   
            
            let subcomponentContainer:any = []
            
            for(let i = 0; i < JSON.parse(data).length; i+=2)
            {   
                let subcomponent = []
                let value = JSON.parse(data)[i]

                subcomponent.push(
                    <Text key={generateRandomId()} style={styles.text}>{value}</Text>   
                )

                
                value = JSON.parse(data)[i + 1]

                
                subcomponent.push(
                    <Text key={generateRandomId()} style={styles.text}>{value}Km</Text>
                )


                subcomponentContainer.push(
                    <View key={generateRandomId()} style={styles.timeAndDistance}>
                        {subcomponent}
                    </View>
                )
                

            }

            let component = [];

            component.push(
                <View key={generateRandomId()} style={styles.containerData}>
                    <Text style={styles.subTitle}>Intervals</Text>
                    <View style={styles.tinyBorder}></View>
                    <View key={generateRandomId()} style={{width: '100%'}}>
                        {subcomponentContainer}
                    </View>
                    
                </View>
                
            )

            return component;
            
        }
        
    }

    const generateRandomId = () => {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    return (

        <View key={generateRandomId()}>
            {
                props.timeline == "week" &&
                <View>
                    <Text style={[styles.subTitle, {textAlign: 'center', fontSize: 18, }]}>{calculateDate(props.dateCreated)}</Text>
                    <View style={styles.smallBorder}></View>
                </View>
                
            }
           
            {
                dataArray.map((item) => {
                    return (
                        <View key={generateRandomId()}>
                           {makeJSONNice(JSON.stringify(item))}
                        </View>
                        
                    )
                })
            }
        </View>
    )
}

