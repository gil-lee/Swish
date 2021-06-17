import React from 'react'
import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Modal } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { firebase } from "../firebase"
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import PushNotifications from '../PushNotifications/PushNotifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const urlPostChat = "http://proj.ruppin.ac.il/bgroup17/prod/api/Chat/PostChat";

const urlItemSize = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemSize";
const urlItemStyle = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemStyle";
const urlItemPrice = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemPrice ";
const urlConditionPrice = "http://proj.ruppin.ac.il/bgroup17/prod/api/ConditionPrices";

const itemType = '';
const itemSize = '';
const itemStyle = '';
const itemCond = '';


export default function CardItem(props) {

  const navigation = useNavigation();
  const [index, setIndex] = useState(0)
  const [images, setImages] = useState([
    { url: props.data.image1 },
    { url: props.data.image2 },
    { url: props.data.image3 },
    { url: props.data.image4 },
  ])

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();


  function createUsersArr() {
    var sendMessUser = props.logInUser
    var userUploadItem = props.user
    var itemRequestId = props.data.itemId + "-" + props.user.id + "-" + props.logInUser.id
    var UsersList = [];
    UsersList.push(sendMessUser, userUploadItem)
    var item = props.data
    var userChat = [{ UsersList, itemRequestId, item }]
    requestItem(userChat)
  }

  function requestItem(userChat) {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var fullDate = year + "-" + month + "-" + date
    console.log('date: ', fullDate)

    let chatRow = {
      requestUser: userChat[0].UsersList[0].id,
      uploadUser: userChat[0].UsersList[1].id,
      itemId: userChat[0].item.itemId,
      lastMessageDate: fullDate
    }
    console.log('chatRow: ', chatRow)
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
    sendDfaultMessage(userChat)

    props.navigation.navigate('Main Chat Page', { userChat: userChat, initial: false })
    navigation.navigate('NewChat', { userChat: userChat, item: props.data })
    //navigation.navigate('PushNotifications')
  }

  function sendDfaultMessage(userChat) {
    let Dmessage = `${userChat[0].UsersList[0].firstName} רוצה לקבל ממך את הפריט: ${'\n' + userChat[0].item.name}`;
    //setMessages(Dmessage);

    //console.log('message hook:', Dmessage)
    const messageId = userChat[0].itemRequestId;
    //console.log('how message looks: ', messages)
    if (Dmessage.length > 0) {
      let msgId = firebase.database().ref('messages').child(userChat[0].itemRequestId).push().key;

      let updates = {};
      let message = {
        message: Dmessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: userChat[0].UsersList[0]
      }
      //console.log('messages: ', messageId)
      updates['messages/' + messageId + '/' + msgId] = message;
      //console.log('update: ', updates)
      firebase.database().ref().update(updates)
    }
   
  }

  function goToOtherProfile() {
    var user = props.user
    var logInUser = props.logInUser
    var users = { user, logInUser }
    console.log("users from feed: ", users)
    navigation.navigate('OtherUserProfile', { users: users })
    //navigation.navigate('OtherUserProfile', { user: props.user, LGUser: props.logInUser })
  }

  function openGallery() {
    let i = [{ url: props.data.image1 },
    { url: props.data.image2 },
    { url: props.data.image3 },
    { url: props.data.image4 }];
    setImages(i)
    navigation.navigate('ZoomImages', i)
  }

  return (
    <ScrollView>
      <View style={styles.layout}>
        <View style={styles.header}>
          <Text style={{ fontWeight: "bold" }}>{props.data.name}</Text>

          <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.requestBtn} onPress={createUsersArr}>
              <Text style={styles.btnText}>בקשת פריט</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.header2}>
          <Text>{props.data.priceList[0].name}  |</Text>
          <Text>{props.data.numberOfPoints}  </Text>
          <MaterialCommunityIcons name="cash" color={"#7DA476"} size={20} />
        </View>


        {props.data.description ?
          <Text style={{ marginRight: 10, marginLeft: 10 }}>{props.data.description}</Text> : null}
      </View>
      <TouchableOpacity onPress={openGallery}>
        <View style={{ height: 270, flexDirection: 'row', justifyContent: 'center', marginTop: 15 }} >
          {props.data.image1 &&
            <Image source={{ uri: props.data.image1 }} style={{ height: 270, width: 200, borderColor: '#fff', borderWidth: 2 }}></Image>}

          <View>
            {props.data.image2 ?
              <Image source={{ uri: props.data.image2 }} style={{ height: 90, width: 100, borderColor: '#fff', borderWidth: 2 }}></Image> : null}

            {props.data.image3 ?
              <Image source={{ uri: props.data.image3 }} style={{ height: 90, width: 100, borderColor: '#fff', borderWidth: 2 }}></Image> : null}

            {props.data.image4 ?
              <Image source={{ uri: props.data.image4 }} style={{ height: 90, width: 100, borderColor: '#fff', borderWidth: 2 }}></Image> : null}
          </View>
        </View>
      </TouchableOpacity>


      <View style={styles.footer}>
        <View>
          <Text style={{ fontWeight: "bold" }}>{props.data.conditionList[0].condition}  |  {props.data.sizeList[0].size}</Text>
        </View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <TouchableOpacity onPress={goToOtherProfile}>
            <Image source={{ uri: props.user.profilePicture }} style={styles.userImage}></Image>
          </TouchableOpacity>

          <View style={{ alignItems: 'center' }}>
            <Text>{props.user.firstName} {props.user.lastName}  </Text>
            <Text style={{ textDecorationLine: 'underline' }}>{JSON.stringify(props.data.distance).substring(0, 4)} בק"מ </Text>
          </View>
        </View>
      </View>
      <View style={styles.line} />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row-reverse',
    marginTop: 20,
    margin: 5,
  },
  header2: {
    flexDirection: 'row-reverse',
    marginTop: -25,
    margin: 5,
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 10
  },
  requestBtn: {
    width: 90,
    backgroundColor: "#9d76a5",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "white",
    fontSize: 14,
    fontWeight: '500'
  },
  footer: {
    flexDirection: 'row-reverse',
    marginLeft: 32,
    marginTop: 15
  },
  layout: {
    marginRight: 20,
    marginLeft: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  line: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    borderBottomColor: '#a7a7a7',
    borderBottomWidth: 1
  }
})
