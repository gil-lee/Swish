import React from 'react'
import { useState, useEffect, useCallback, useContext } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { firebase } from "../firebase"
import AsyncStorage from '@react-native-async-storage/async-storage';

const convertToArray = (data) => {
  let res = []
  Object.keys(data).map((key) => {
    let val = data[key]
    res.push({ ...val, createdAt: new Date(val.createdAt) })
  })
  return res
}

const urlPostChat = "http://proj.ruppin.ac.il/bgroup17/prod/api/Chat/PostChat"
export default function Chat(props) {

  const { userChat } = props.route.params;
  //const { users }  = userChat[0].UsersList; 
  const [messages, setMessages] = useState([]);
  const [usersChat, setUsersChat] = useState([])

  useEffect(() => {
    postUserToChatDB()

    let tempArr = [];

    let user = userChat[0].UsersList[1]
      tempArr.push(user);
    
    console.log("temp arrrrr: ", tempArr)
    setUsersChat(tempArr)
    fetchMessages().catch(e => console.log(e))

    setMessages([
      {
        _id: 1,
        text: `${userChat[0].UsersList[0].firstName} ` + 'רוצה לקבל את פריט זה, מה תגובתך?',
        createdAt: new Date(),
        user: {
          _id: userChat[0].UsersList[0].id,
          name: userChat[0].UsersList[0].firstName,
          avatar: userChat[0].UsersList[0].profilePicture,
        },
        //image: userChat[1].image1,

        // quickReplies: {
        //   type: 'radio',
        //   keepIt: true,
        //   values: [
        //     {
        //       title: 'כן',
        //       value: 'yes',
        //     },
        //     {
        //       title: 'לא',
        //       value: 'no',
        //     },
        //   ],
        // },
        //sent: true,
        //received: true,
      },
    ])
  }, [])

  useEffect(() => {
    if (!messages || messages.length === 0) return
    updateMessages()
  }, [messages])

  // useEffect(()=>{
  //   firebase.refOn(message => 
  //     setMessages(previousState => ({
  //       messages: GiftedChat.append(previousState.messages, message),
  //       })
  //     )
  //   );
  // })
  const postUserToChatDB = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var fullDate = date + "-" + month + "-" + year
    fullDate = JSON.stringify(fullDate)
    console.log('item id: ', fullDate)

    let chatRow = {
      requestUser: userChat[0].UsersList[0].id,
      uploadUser: userChat[0].UsersList[1].id,
      itemId: props.route.params.item.itemId,
      lastMessageDate: fullDate
    }

    fetch(urlPostChat, {
      method: 'POST',
      body: JSON.stringify(chatRow),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res.ok postChat=', res.ok);
        return res.json()
      })
      .then(i => {
        console.log(i)
      },
        (error) => {
          console.log('Error', error);
        })
  }

  const fetchMessages = async () => {

    try {
      let data = await firebase.database().ref(`${userChat[0].itemRequestId}`).get()
      console.log("data: ", data)
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
  const updateMessages = async () => {
    try {
      let messagesToSave = messages.map((val) => {
        return {
          ...val,
          createdAt: val.createdAt.getTime()
        }
      })
      await firebase.database().ref(`${userChat[0].itemRequestId}`).set(messagesToSave)
      await AsyncStorage.setItem(`@messages_${userChat[0].itemRequestId}`, `${messagesToSave.length}`)
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


  // const PrintNameOfUser = () => {
  //   let names = '';
  //   usersChat.forEach(u => {
  //     names += u.firstName + ", "
  //     console.log(names)
  //   })
  //   return names;
  // }


  return (
    <View style={styles.container_extra}>
      <View style={styles.TeamInformation}>
        <Image source={{ uri: userChat[0].UsersList[1].profilePicture }} style={{ width: 40, height: 40 }} />
        <View style={styles.TeamInformation_Up}>
          <View style={styles.TeamInformation_Up_Title}>
            <Text style={styles.txtTeam}> {userChat[0].UsersList[1].firstName + ' ' + userChat[0].UsersList[1].lastName}</Text>
            {console.log('usersChat in  chat', usersChat)}
          </View>
          <View style={styles.TeamInformation_Up_imgView}>

          </View>
        </View>
      </View>

      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          //onSend={firebase.send}
          onSend={messages => onSend(messages)}
          //quickReply={messages.quickReplies}
          //onQuickReply={quickReply => onQuickReply(quickReply)}
          //forceGetKeyboardHeight={true}
          user={{
            _id: userChat[0].UsersList[0].id,
            avatar: userChat[0].UsersList[0].profilePicture,
            name: userChat[0].UsersList[0].firstName + " " + userChat[0].UsersList[0].lastName
          }}
        //inverted={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    paddingBottom: 10,
    paddingTop: 50,
    width: '95%',
    height: '65%',
  },
  container: {
    paddingTop: 10,
    alignItems: "center"
  },
  container_extra: {
    paddingTop: 70,
    alignItems: 'center',
    flex: 1,
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
  TeamInformation_players: { flexDirection: 'row-reverse' },
  TeamInformation_Up_imgView: {
    width: 10,
    height: 100
  },
  teamImg: {
    borderRadius: 30
  },
  TeamInformation_Up_Title: {
    //justifyContent: 'flex-start',
    width: '100%'
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
})
