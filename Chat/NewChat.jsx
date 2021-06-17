import React from 'react'
import { Text, FlatList, View, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, ScrollView, Image } from 'react-native'
import { firebase } from "../firebase"
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';

const urlGetChatStatus = "http://proj.ruppin.ac.il/bgroup17/prod/api/Chat/GetChatDetails";
const urlPutChatStatus = "http://proj.ruppin.ac.il/bgroup17/prod/api/Chat/PutChatStatus"
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      textMessage: "",
      userChat: this.props.route.params.userChat,
      messagesList: [],
      user1: this.props.route.params.userChat[0].UsersList[0], //loginUser
      user2Upload: this.props.route.params.userChat[0].UsersList[1], //otherUser
      item: this.props.route.params.userChat[0].item,
      itemIDFirbase: this.props.route.params.userChat[0].itemRequestId,

      dimensions: {
        window,
        screen
      },
      disableInput: false,
      chatStatus: '',
    }

  }

  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  };

  componentDidMount() {

    this.getChatStatusDB();
    Dimensions.addEventListener("change", this.onChange);
    firebase.database().ref('messages').child(this.state.userChat[0].itemRequestId).on('child_added', (value) => {
      this.setState((prevState) => {
        return {
          messagesList: [...prevState.messagesList, value.val()]
        }
      })
    })
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.onChange);
    this.getChatStatusDB();
  }

  getChatStatusDB = () => {

    fetch(urlGetChatStatus + '/' + this.state.user1.id + '/' + this.state.item.itemId, {
      method: 'GET',
      //body: JSON.stringify(chatRow),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res.ok GetChat=', res.ok);
        return res.json()
      })
      .then(i => {
        //console.log('i:', i)
        this.setState({ chatStatus: i[0].chatStatus })
        if (i[0].chatStatus == "available") {
          this.setState({ disableInput: true })
        }
      },
        (error) => {
          console.log('Error', error);
        })
  }

  putChatStatus = () => {
    var chat = {
      uploadUser: '',
      requestUser: '',
      itemId: this.state.item.itemId,
      chatStatus: ''
    }

    fetch(urlPutChatStatus, {
      method: 'PUT',
      body: JSON.stringify(chat),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res.ok GetChat=', res.ok);
        return res.json()
      })
      .then(i => {
        //console.log('i:', i)
        this.setState({ chatStatus: i[0].chatStatus })
        if (i[0].chatStatus == "available") {
          this.setState({ disableInput: true })
        }
      },
        (error) => {
          console.log('Error', error);
        })
  }
  handleChange = (key) => val => {
    this.setState({ [key]: val })
  }

  sendMessage = async () => {
    console.log('in send func')
    const messageId = this.props.route.params.userChat[0].itemRequestId;
    console.log('how message looks: ', this.state.textMessage)
    if (this.state.textMessage.length > 0) {
      let msgId = firebase.database().ref('messages').child(this.state.userChat[0].itemRequestId).push().key;

      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: this.state.userChat[0].UsersList[0],
        //chatStatus: this.state.chatStatus
      }
      //console.log('messages: ', messageId)
      updates['messages/' + messageId + '/' + msgId] = message;
      console.log('update: ', updates)
      firebase.database().ref().update(updates)
      //this.btnPushFromClient()
      this.sendPushNotification(this.state.user2Upload.userToken)
      this.setState({ textMessage: '' })
    }
  }
  sendPushNotification = async (expoPushToken) => {
    console.log('user token: ', this.state.user2Upload.userToken)
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { message: this.state.textMessage },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  btnPushFromClient = () => {
    console.log('user token: ', this.state.user2Upload.userToken)
    let per = {
      to: this.state.user2Upload.userToken,
      title: 'title from ' + this.state.user1.firstName,
      body: "body from client side",
      //badge: 3,
      data: { message: this.state.textMessage }
    };
    console.log('per: ', per)
    // POST adds a random id to the object sent
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      body: JSON.stringify(per),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => response.json())
      .then(json => {
        if (json != null) {
          console.log(`
              returned from server\n
              json.data= ${JSON.stringify(json.data)}`);

        } else {
          alert('err json');
        }
      });
  }

  renderMessage = ({ item }) => {
    //console.log('item render:', item)
    return (
      <View style={{
        flexDirection: 'row',
        width: '65%', //זה הרוחב של ההודעות עצמן
        alignSelf: item.from.id === this.state.userChat[0].UsersList[0].id ? 'flex-end' : 'flex-start',
        backgroundColor: item.from.id === this.state.userChat[0].UsersList[0].id ? '#c2d4bf' : '#c3acc8',
        borderRadius: 8,
        marginBottom: 10,
        direction: 'rtl',
        writingDirection: 'rtl',
      }}>
        <Text style={{ color: '#000', padding: 7, fontSize: 16 }}>
          {item.message}
        </Text>
        <Text style={{ color: '#000', padding: 3, fontSize: 12 }}>
          {this.convertTime(item.time)}</Text>
      </View>
    )
  }
  printDefaultMessage = () => {
    let splitId = this.state.itemIDFirbase.split("-")

    //let defaultMessage = '';
    //console.log('default: ', defaultMessage)
    return (
      <View style={{
        flexDirection: 'row',
        width: '65%', //זה הרוחב של ההודעות עצמן
        alignSelf: splitId[1] == this.state.user2Upload.id ? 'flex-end' : 'flex-start',
        backgroundColor: splitId[1] == this.state.user2Upload.id ? '#c2d4bf' : '#c3acc8',
        borderRadius: 8,
        marginBottom: 10,
        direction: 'rtl',
        writingDirection: 'rtl',
      }}>
        {/* <View style={{ alignItems: 'center' }}>
          <View style={{ height: 'auto', flexDirection: 'row', justifyContent: 'center', marginTop: 15, marginBottom: 8 }} >
            {this.state.item.image1 &&
              <Image source={{ uri: this.state.item.image1 }} style={{ height: 120, width: 90, borderColor: '#fff', borderWidth: 2 }}></Image>}

            <View>
              {this.state.item.image2 ?
                <Image source={{ uri: this.state.item.image2 }} style={{ height: 40, width: 30, borderColor: '#fff', borderWidth: 2 }}></Image> : null}

              {this.state.item.image3 ?
                <Image source={{ uri: this.state.item.image3 }} style={{ height: 40, width: 30, borderColor: '#fff', borderWidth: 2 }}></Image> : null}

              {this.state.item.image4 ?
                <Image source={{ uri: this.state.item.image4 }} style={{ height: 40, width: 30, borderColor: '#fff', borderWidth: 2 }}></Image> : null}
            </View>
          </View>
        </View> */}
        {this.state.user1.id == splitId[1] &&
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
            <TouchableOpacity style={styles.yesBtn} onPress={this.yesBtn}>
              <Text>אישור</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.noBtn} onPress={this.noBtn}>
              <Text>דחייה</Text>
            </TouchableOpacity>
          </View>}
      </View>
    )
  }

  yesBtn = () => {
    this.setState({ disableInput: true })
  }
  noBtn = () => {
    //console.log(this.state.userChat[0].UsersList[1])
    let item = {
      message: 'מצטערים, המשתמש דחה את בקשתך',
      time: firebase.database.ServerValue.TIMESTAMP,
      from: this.state.userChat[0].UsersList[0]
      //chatStatus: this.state.chatStatus
    }
    //let mess= 'מצטערים לא ניתן להמשיך את השיחה'
    this.setState({ textMessage: item.message }, () =>
      this.sendMessage)

    console.log(item);
    let temp = []
    temp = this.state.messagesList;
    temp.push(item)
    this.setState({ messagesList: temp })
    this.renderMessage

  }

  convertTime = (time) => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':'
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.getDay() + '/' + d.getMonth() + ' - ' + result;
    }
    return result;
  }

  printUser = () => {
    if (this.state.user1.id == this.state.userChat[0].UsersList[0].id) {
      return (
        <View key={this.state.user2Upload.id} style={styles.layout}>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', }}>
            <View style={{ justifyContent: 'flex-start', flexDirection: 'row-reverse' }}>
              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text style={styles.Text}>{this.state.user2Upload.firstName} {this.state.user2Upload.lastName}</Text>
                <Text>{this.state.item.name}</Text>
              </View>
              <Image source={{ uri: this.state.user2Upload.profilePicture }} style={styles.userImage} />
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View key={this.state.user1.id} style={styles.layout}>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', }}>
            <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text style={styles.Text}>{this.state.user1.firstName} {this.state.user1.lastName}</Text>
                <Text>{this.state.item.name}</Text>
              </View>
              <Image source={{ uri: this.state.user1.profilePicture }} style={styles.userImage} />
            </View>
          </View>
        </View>
      )
    }
  }

  render() {
    const { dimensions } = this.state;
    return (
      <SafeAreaView >
        <View>
          {this.printUser()}
        </View>
        <View style={styles.line} />


        <ScrollView style={{ marginBottom: 185 }}>
          {this.printDefaultMessage()}
          <FlatList
            style={{ padding: 15 }}
            data={this.state.messagesList}
            renderItem={this.renderMessage}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
        <View style={styles.sendInputView}>
          <TextInput
            style={styles.input}
            value={this.state.textMessage}
            placeholder="..."
            onChangeText={this.handleChange('textMessage')}
            editable={this.state.disableInput}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={this.sendMessage}>
            <Icon name="paper-plane" size={20} color="#fff" style={{ margin: 11 }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yesBtn: {
    marginLeft: 5,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderColor: '#7d7d7d',
    height: 35,
    width: 50,
  },
  noBtn: {
    marginLeft: 5,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderColor: '#7d7d7d',
    height: 35,
    width: 50,
  },
  printDefaultView: {
    flexDirection: 'column',
    width: '70%', //זה הרוחב של ההודעות עצמן
    alignSelf: 'flex-end',
    height: 'auto',
    backgroundColor: '#c2d4bf',
    borderRadius: 8,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    direction: 'rtl',
    writingDirection: 'rtl',
  },
  line: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 8,
    borderBottomColor: '#a7a7a7',
    borderBottomWidth: 1,
    marginBottom: 10
  },
  sendInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 590,
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
    marginTop: 50,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    justifyContent: 'center',
    // alignItems: 'flex-end'
  },
  userImage: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '75%',
    marginBottom: 10,
    marginTop: 40,
    marginLeft: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#7d7d7d",
    direction: 'rtl',
    writingDirection: 'rtl',
  },
  btnText: {
    color: 'darkblue',
    fontSize: 20
  },
  sendBtn: {
    marginTop: 35,
    marginRight: 20,
    marginLeft: 5,
    backgroundColor: '#a7a7a7',
    //borderRadius: 60,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: '#7d7d7d',
    height: 43,
    width: 50,
  }
})