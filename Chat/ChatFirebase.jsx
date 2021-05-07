import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { firebase } from '../../api/FireBase'; //להחליף לעמוד פייר שלנו
import { Avatar } from 'react-native-paper';
import { Context as TeamContext } from '../../Contexts/TeamContext' //עמודים של דניאל
import AppCss from '../../CSS/AppCss';
import { Context as PlayerContext } from '../../Contexts/PlayerContext' //עמודים של דניאל
const appCss = AppCss;
const styles = StyleSheet.create({
    container_extra: {
        paddingTop: 70,
        alignItems: 'center'
    },
    TeamInformation: {
        backgroundColor: '#D9D9D9',
        padding: 15,
        width: '90%',
        borderRadius: 30,
    },
    TeamInformation_Up: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
    },
    TeamInformation_players: {},
    TeamInformation_Up_imgView: {
        width: 10,
        height: 100
    },
    teamImg: {
        borderRadius: 30
    },
    TeamInformation_Up_Title: {
        justifyContent: 'flex-start',
        width: 250
    },
    txtTeam: {
        alignSelf: 'center',
        paddingBottom: 5,
        fontWeight: "bold",
    },
    teamName_txt: {
        alignSelf: 'center',
        fontSize: 32,
        fontWeight: "bold",
    },
    btnTouch_extra: {
        marginTop: 15,
        width: '90%'
    },
    chatContainer: {
        flex: 1,
        width: '90%',
        //height: '61%',
        paddingBottom: 10
    },
})

const convertToArray = (data) => {
    let res = []
    Object.keys(data).map((key) => {
        let val = data[key]
        res.push({ ...val, createdAt: new Date(val.createdAt) })
    })
    return res
}

export default function TeamPage(props) {
    const { team } = props.route.params;
    //const { GetPlayers4Team } = useContext(TeamContext)
    const { state: { players } } = useContext(PlayerContext);
    const [messages, setMessages] = useState([]);
    const [teamPlayers, setTeamPlayers] = useState([])

    useEffect(() => {
        let tempArr = [];
        team.PlayersList.forEach(p => {
            let player = players.find(x => x.Email === p.EmailPlayer)
            if (player !== null)
                tempArr.push(player);
        });
        setTeamPlayers(tempArr);
        fetchMessages().catch(e => console.log(e))
        // console.log("this is the player list = " + team.PlayersList)
        // console.log(team)
        //GetPlayers4Team(team.PlayersList) -- to check


        // setMessages([
        //     {
        //         _id: 1,
        //         text: 'Hello Daniel! I am CR7 and I would like to welcome you to my app!',
        //         createdAt: new Date(),
        //         user: {
        //             _id: 2,
        //             name: 'CR7',
        //             avatar: 'https://site-cdn.givemesport.com/images/21/02/05/354cc6f5366bb99d3eca6bc92f8d2165/1201.jpg',
        //         },
        //     },
        // ])
    }, [])

    const fetchMessages = async () => {
        try {
            let data = await firebase.database().ref(`${team.TeamSerialNum}`).get()
            if (data.exists()) {
                data = data.exportVal()
                data = convertToArray(data)
                setMessages(data)
            }
        } catch (e) {
            console.log(e)
            return Promise.reject("Failed fetching data")
        }
    }

    useEffect(() => {
        if (!messages || messages.length === 0) return
        updateMessages()
    }, [messages])


    const updateMessages = async () => {
        try {
            let messagesToSave = messages.map((val) => {
                return {
                    ...val,
                    createdAt: val.createdAt.getTime()
                }
            })
            await firebase.database().ref(`${team.TeamSerialNum}`).set(messagesToSave)
            //console.log("Updating messages")
        } catch (e) {
            console.log(e)
            return Promise.reject(e + " Failed fetching data")
        }
    }

    const onSend = useCallback((message = []) => {
        console.log("On send")
        setMessages((prev) => {
            let newMessages = [...prev, ...message]
            GiftedChat.append(prev, message)
            return newMessages
        })
    }, [])

    const PrintNameOfPlayers = () => {
        let names = '';
        let counter = 0;
        teamPlayers.forEach(p => {
            if (counter < 5)
                names += p.FirstName + ", "
            else if (counter === 5)
                names += p.FirstName + "... "
            counter++;
        });
        return names;
    }
    const TeamInformation = () => {
    }

    const ViewGames = () => {
    }

    return (
        <View style={[appCss.container, styles.container_extra]}>
            <TouchableOpacity style={styles.TeamInformation}
                onPress={() => props.navigation.navigate('TeamDetailsPage', { team })}>
                <View style={styles.TeamInformation_Up}>
                    <View style={styles.TeamInformation_Up_Title}>
                        <Text style={styles.txtTeam}> Team</Text>
                        <Text style={styles.teamName_txt}>{team.TeamName}</Text>
                    </View>
                    <View style={styles.TeamInformation_Up_imgView}>
                        <Avatar.Image size={100} source={{ uri: team.TeamPicture }} />
                    </View>
                </View>
                <View style={styles.TeamInformation_players}>
                    <Text>Players: {PrintNameOfPlayers()}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate('CreateNewGame')}
                style={[appCss.btnTouch, styles.btnTouch_extra]}>
                <Text style={appCss.txtBtnTouch}>Create New Game</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate('GameList')}
                style={[appCss.btnTouch, styles.btnTouch_extra]}>
                <Text style={appCss.txtBtnTouch}>View Games</Text>
            </TouchableOpacity>

            <View style={styles.chatContainer}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: 1,
                        avatar: 'https://site-cdn.givemesport.com/images/21/02/05/354cc6f5366bb99d3eca6bc92f8d2165/1201.jpg'
                    }}
                    inverted={false}
                />
            </View>
        </View>
    );
}