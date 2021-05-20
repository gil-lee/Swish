import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Image as ImageBall, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Badge } from 'react-native-elements'
import { firebase } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';



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
        console.log('state chats: ', allChats)
      },
        (error) => {
          console.log('Error', error);
        })
  }


  // const convertToArray = (data) => {
  //   let res = []
  //   Object.keys(data).map((key) => {
  //     let val = data[key]
  //     res.push({ ...val, createdAt: new Date(val.createdAt) })
  //   })
  //   return res
  // }
  // const calcBadge = async () => {
  //   //console.log("last count befor async: ", userChat[0].itemRequestId)
  //   let lastCount = parseInt(await AsyncStorage.getItem(`@messages_${userChat[0].itemRequestId}`));
  //   console.log(`lastCount=${lastCount}`)
  //   let totalInDb = await firebase.database().ref(`${userChat[0].itemRequestId}`).get();
  //   if (totalInDb.exists()) {
  //     totalInDb = totalInDb.exportVal()
  //     totalInDb = convertToArray(totalInDb).length
  //   } else {
  //     return 0
  //   }
  //   if (!lastCount) {
  //     lastCount = 0;
  //   }
  //   return totalInDb - lastCount;
  // }

  // const calcUsersCards = async () => {
  //   console.log("userChat:   ", userChat)
  //   const LGUserCard = userChat;
  //   console.log(LGUserCard)

  //   const usersCards = await Promise.all(userChat[0].UsersList.map(async (user, key) => { //את זה לעשות אחרי fetch של המשתמשים שיש לי צאט איתם!
  //     //let manager = players.find(x => x.Email === team.EmailManager);
  //     // fetchMessages(team)
  //     const badge = await calcBadge();
  //     //console.log(badge)
  //     return <TouchableOpacity style={styles.teamCard} key={key}
  //       onPress={() => props.navigation.navigate('Chat', { userChat: userChat })}>
  //       <View style={styles.contextSide}>
  //         <View style={styles.headerCard_View}>
  //           <Text style={{ fontSize: 25, color: 'black' }}>{user.firstName}</Text>
  //         </View>
  //         <View style={styles.descripitionCard}>
  //           <View style={{ flexDirection: 'row' }}>
  //             <Text> {user.firstName + " " + user.lastName} </Text>
  //             {/* <Text style={{ fontWeight: 'bold' }}> user: </Text> */}
  //           </View>
  //         </View>
  //       </View>
  //       <View style={styles.side_img}>
  //         <Image size={64} source={{ uri: user.profilePicture }} />
  //       </View>
  //       {badge === 0 ? null :
  //         <Badge
  //           containerStyle={{ position: 'absolute', top: 0, left: 0 }}
  //           value={badge} //Need to count length of messages from DB
  //           status="error" />
  //       }
  //     </TouchableOpacity>
  //   }))
  //   setUsersCards(usersCards);
  // }


  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     //calcUsersCards();
  //     console.log('user in main chat: ', userChat)
  //   });
  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return () => unsubscribe();
  // }, [props.navigation]);

  // //   useEffect(() => {
  // //   //var admin = require("swish-s");

  // //   // Get a database reference to our posts
  // //   var db = firebase.database();
  // //   var ref = db.ref("swish-s");

  // //   // Attach an asynchronous callback to read the data at our posts reference
  // //   ref.on("value", function (snapshot) {
  // //     console.log("snapshottttttt",snapshot.val());
  // //   }, function (errorObject) {
  // //     console.log("The read failed: " + errorObject.code);
  // //   });
  // // },[]);
  const getMessagesFirebase=(item, uploadUser, otherUser)=>{
    if(uploadUser == user.id){
      var itemRequestId = item + "-" + uploadUser + "-" + otherUser.id
    }
    else{
      var itemRequestId = item + "-" + uploadUser + "-" + user.id
    }
    
    console.log('item request id: ', itemRequestId)
    var sendMessUser = user
    var userUploadItem = otherUser
    var UsersList = [];
    UsersList.push(sendMessUser, userUploadItem)

    var userChat = [{ UsersList, itemRequestId }]
    console.log('user chat: ', userChat)
    navigation.navigate('Chat', {userChat: userChat, item: item})
  }

  const returnAllChats =
    allChats.map(user => {
      return <View key={user.id} style={styles.layout}>
          <TouchableOpacity onPress={()=>getMessagesFirebase(user.itemId, user.uploadUser, user.userDTO[0])}>
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
      
    })

  return (
    // <ScrollView>
    <View>
      <Text style={{ marginTop: 50 }}>הצ'אטים שלי</Text>
      <View>
        {returnAllChats}
      </View>
    </View>
        //  {console.log('alllllll chats: ', allChats)}
        // {allChats ?
        //   allChats.map(user => {
        //     <View><Text style={styles.Text}>{user.userDTO[0].firstName}</Text></View>
        //     {console.log('user chats: ', user.userDTO[0].firstName)}

  // <View key={user.id} style={styles.layout}>
  //                  <TouchableOpacity>
  //                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', }}>
  //                     <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
  //                        <Text style={styles.Text}>{user.userDTO[0].firstName} {user.userDTO[0].lastName}</Text>
  //                       <Image source={{ uri: user.userDTO[0].profilePicture }} style={styles.userImage} />
  //                        <View style={{ justifyContent: 'flex-start' }}>

  //                        </View>
  //                      </View>
  //                    </View>
  //                  </TouchableOpacity>
  //                  <View style={{ justifyContent: 'flex-end' }}> </View>
  //                </View> 
  //  }) : null} 

    // {/* </ScrollView> */}
  
)}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
  },
  Text: {
    fontSize: 17,
    color: "#000",
    paddingTop: 19,
    paddingRight: 19,
    paddingLeft: 19
  },
  layout: {
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
