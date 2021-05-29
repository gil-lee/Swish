import React from 'react'
import { useState, useEffect, useCallback, useContext } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { firebase } from "../firebase"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



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
  

  const navigation = useNavigation();
  const { userChat } = props.route.params;
  //const { users }  = userChat[0].UsersList; 
  const [messages, setMessages] = useState([]);
  const [usersChat, setUsersChat] = useState([])
  const [checkMessages, setCheckMessages] = useState(false)
  const [blockChat, setBlockChat] = useState(false)

  useEffect(() => {
    postUserToChatDB()

    let tempArr = [];

    let user = userChat[0].UsersList[1]
    tempArr.push(user);

    //console.log("temp arrrrr: ", tempArr)
    setUsersChat(tempArr)
    fetchMessages().catch(e => console.log(e))

    if (checkMessages == false) {
      setMessages([
        {
          _id: 1,
          text: `${userChat[0].UsersList[0].firstName} ` + 'רוצה לקבל את פריט זה, מה תגובתך?',
          createdAt: new Date(),
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
          // "quickReplies":[
          //   {
          //     "contentType":"text",
          //     "title":"yes"
          //   },
          //   {
          //     "contentType":"text",
          //     "title":"no"
          //   }
          // ],
          user: {
            _id: userChat[0].UsersList[0].id,
            name: userChat[0].UsersList[0].firstName,
            avatar: userChat[0].UsersList[0].profilePicture,
          },
        },
      ])
    }
  }, [])


  useEffect(() => {
    if (!messages || messages.length === 0) return
    updateMessages()
  }, [messages])

  const postUserToChatDB = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var fullDate = year + "-" + month + "-" + date
    //fullDate = JSON.stringify(fullDate)
    console.log('date: ', fullDate)

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
      //console.log("data: ", data)
      if (data.exists()) {
        data = data.exportVal()
        data = convertToArray(data)
        setMessages(data)
        setCheckMessages(true)
        return data;
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
      //await AsyncStorage.setItem(`@messages_${userChat[0].itemRequestId}`, `${messagesToSave.length}`)
      //console.log("Updating messages")
    } catch (e) {
      console.log(e)
      return Promise.reject(e + " Failed fetching data")
    }
  }

  const onSend = useCallback((message = []) => {
    //console.log("On send")
    updateMessages()
    setMessages((prev) => {
      let newMessages = [...prev, ...message]
      GiftedChat.append(prev, message)
      return newMessages
    })
  }, [])

  function btnBack() {
    navigation.goBack();
  }

  function onQuickReply(quickReply) {

    console.log(quickReply)
    if(quickReply.title === "yes") {
          // send text message
          console.log('yes : ', quick.title)
     } else if (quickReply.title === "no") {
         // send location
         console.log('no : ', quick.title)
     }
 }

return (
  <View style={styles.containerChatMain}>
    <TouchableOpacity onPress={btnBack} style={styles.backBtn}>
      <Icon name="chevron-left" size={20} color="#101010" />
    </TouchableOpacity>
    <View style={styles.userAndItemInfo}>
      <View style={styles.userInfo}>
        <Text style={styles.text}> {userChat[0].UsersList[1].firstName + ' ' + userChat[0].UsersList[1].lastName}</Text>

        <View style={styles.userImage}>
          <Image source={{ uri: userChat[0].UsersList[1].profilePicture }} style={{ width: 40, height: 40 }} />
        </View>
      </View>
      <View style={{ flexDirection: 'row-reverse' }}>
        <View style={styles.layout}>
          <Text style={{ fontWeight: "bold" }}>{userChat[0].item.name}</Text>
          <View style={styles.header}>

            <Text>{userChat[0].item.numberOfPoints}  </Text>
            <MaterialCommunityIcons name="cash" color={"#7DA476"} size={20} />
          </View>
        </View>
        <View>
          <View style={{ height: 270, flexDirection: 'row', justifyContent: 'center', marginTop: 15 }} >
            {userChat[0].item.image1 &&
              <Image source={{ uri: userChat[0].item.image1 }} style={{ height: 150, width: 80, borderColor: '#fff', borderWidth: 2 }}></Image>}

            <View>
              {userChat[0].item.image2 ?
                <Image source={{ uri: userChat[0].item.image2 }} style={{ height: 50, width: 60, borderColor: '#fff', borderWidth: 2 }}></Image> : null}

              {userChat[0].item.image3 ?
                <Image source={{ uri: userChat[0].item.image3 }} style={{ height: 50, width: 60, borderColor: '#fff', borderWidth: 2 }}></Image> : null}

              {userChat[0].item.image4 ?
                <Image source={{ uri: userChat[0].item.image4 }} style={{ height: 50, width: 60, borderColor: '#fff', borderWidth: 2 }}></Image> : null}
            </View>
          </View>
        </View>
      </View>
    </View>

    <View style={styles.chatMessages}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}

        //onQuickReply={quickReply => onQuickReply(quickReply)}

        forceGetKeyboardHeight={true}
        user={{
          _id: userChat[0].UsersList[0].id,
          avatar: userChat[0].UsersList[0].profilePicture,
          name: userChat[0].UsersList[0].firstName + " " + userChat[0].UsersList[0].lastName
        }}
        alignTop={true}
        inverted={false}
        showUserAvatar= {true}
      />
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  chatMessages: {
    flex: 1,
    paddingBottom: 10,
    paddingTop: 50,
    width: '95%',
    height: '65%',
  },
  backBtn: {
    paddingTop: 50,
    paddingLeft: 25,
    alignItems: 'flex-start'
  },
  container: {
    paddingTop: 10,
    alignItems: "center"
  },
  containerChatMain: {
    paddingTop: 10,
    alignItems: 'center',
    flex: 1,
  },
  userAndItemInfo: {
    backgroundColor: '#D9D9D9',
    padding: 15,
    width: '80%',
    height: '30%',
    borderRadius: 30,
  },
  userInfo: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 10,
  },
  text: {
    alignSelf: 'center',
    paddingBottom: 5,
    fontWeight: "bold",
  },
  header: {
    flexDirection: 'row-reverse',
    marginTop: 10,
    marginBottom: 10,
    // marginRight: 10,
    // marginLeft: 10
  },
  layout: {
    // marginRight: 20,
    // marginLeft: 20,
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end'
  },
})
