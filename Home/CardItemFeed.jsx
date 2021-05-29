import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AwesomeAlert from 'react-native-awesome-alerts';
import Chat from '../Chat/Chat'
import { useNavigation } from '@react-navigation/native';

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

  function requestItem(userChat) {
    props.navigation.navigate('Main Chat Page', { userChat: userChat, initial: false })
    navigation.navigate('Chat', { userChat: userChat, item: props.data })
    //navigation.navigate('Main Chat Page', {userChat: userChat, item:props.data})
  }

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
  function goToOtherProfile() {
    var user = props.user
    var logInUser = props.logInUser
    var users = { user, logInUser }
    console.log("users from feed: ", users)
    navigation.navigate('OtherUserProfile', { users: users })
    //navigation.navigate('OtherUserProfile', { user: props.user, LGUser: props.logInUser })
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
            <Text style={{ textDecorationLine: 'underline' }}>{JSON.stringify(props.data.distance).substring(0,4)} בק"מ </Text>
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
