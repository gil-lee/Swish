import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Badge } from 'react-native-elements'
import { firebase } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function MainChatPage(props) {
  const navigation = useNavigation();
  const urlGetAllChat = "http://proj.ruppin.ac.il/bgroup17/prod/api/Chat/GetAllChats/"
  //const { userChat } = props;
  const { user } = props.route.params
  //const { state: { myTeams } } = useContext(TeamContext);
  //const { state: { players } } = useContext(PlayerContext);
  const [allChats, setAllChats] = useState([]);
  const [usersCards, setUsersCards] = useState(null);

  useEffect(() => {
    GetAllChats()
  }, [])

  const GetAllChats = () => {
    let tempArr = []
    console.log(user.id)
    fetch(urlGetAllChat + user.id, {
      method: 'GET',
      //body: JSON.stringify(chatRow),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res.ok getChats=', res.ok);
        return res.json()
      })
      .then(chats => {
        for (var i = 0; i < chats.length; i++) {
          tempArr.push(chats[i])
        }
        setAllChats(tempArr)
        //console.log('state chats: ', chats)
      },
        (error) => {
          console.log('Error', error);
        })
  }

  const getMessagesFirebase = (itemId, uploadUser, otherUser, item) => {
    //console.log('item: ', item)
    if (uploadUser == user.id) {
      var itemRequestId = itemId + "-" + uploadUser + "-" + otherUser.id
    }
    else {
      var itemRequestId = itemId + "-" + uploadUser + "-" + user.id
    }

    //console.log('item request id: ', itemRequestId)
    var sendMessUser = user
    var userUploadItem = otherUser
    var UsersList = [];
    UsersList.push(sendMessUser, userUploadItem)

    var userChat = [{ UsersList, itemRequestId, item }]

    //console.log('user chat: ', userChat)
    //navigation.navigate('Chat', {userChat: userChat, item: itemId})
    navigation.navigate('NewChat', { userChat: userChat, item: itemId })
  }

  const returnAllChats =
    allChats.map(user => {
      return <ScrollView>
        <View key={user.id} style={styles.layout}>
          <TouchableOpacity onPress={() => getMessagesFirebase(user.itemId, user.uploadUser, user.userDTO[0], user.userDTO[0].UserItemsListDTO[0].itemsListDTO[0])}>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', }}>
              <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                <Text style={styles.Text}>{user.userDTO[0].firstName} {user.userDTO[0].lastName}</Text>
                <Image source={{ uri: user.userDTO[0].profilePicture }} style={styles.userImage} />
                {/* <View style={{ justifyContent: 'flex-start' }}>

                </View> */}
              </View>
            </View>
          </TouchableOpacity>
          {/* <View style={{ justifyContent: 'flex-end' }}> </View> */}
        </View>
      </ScrollView>
    })

  return (
    <ScrollView>
      <View>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={{ uri: user.profilePicture }} style={styles.userImage}></Image>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.userHeader}>{user.firstName} {user.lastName}</Text>
              <View style={{ flexDirection: 'row' }}>
                <MaterialCommunityIcons name="cash" color={"#7DA476"} size={20} />
                <Text style={styles.userHeader}>{user.numOfPoints}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        {returnAllChats}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
  },
  userHeader: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  line: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 8,
    borderBottomColor: '#a7a7a7',
    borderBottomWidth: 1
  },
  Text: {
    fontSize: 17,
    color: "#000",
    paddingTop: 19,
    paddingRight: 19,
    paddingLeft: 19
  },
  container: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 20,
    marginTop: 60,
    marginBottom: 10,
  },
  layout: {
    marginTop:10,
    marginRight: 20,
    marginLeft: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end'
  },
  userImage: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  ball_img: {
    marginBottom: 90,
    height: 110,
    width: 100,
    alignSelf: 'center',
    top: 100
  },
  footer: {
    justifyContent: 'flex-end',
  },
  plusStyle: {
    margin: 5,
    height: 30,
    width: 30,
  },
  createNewTeam_btn: {
    flexDirection: "row-reverse",
    alignItems: 'center',
  },
  teamCard: {
    backgroundColor: '#D9D9D9',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    width: '90%',
    height: 80,
    margin: 20,
    padding: 5,
  },
  contextSide: {
    flex: 1,
    padding: 10
  },
  headerCard_View: {
    alignSelf: 'center'
  },
  descripitionCard: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  side_img: {},
});
