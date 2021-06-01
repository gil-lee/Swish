import React from 'react'
import { Text, FlatList, View, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native'
import { firebase } from "../firebase"


export default class extends React.Component {

  constructor(props) {
    super(props),
      this.state = {
        textMessage: "",
        userChat: this.props.route.params.userChat,
        messagesList: [],
        user1: this.props.route.params.userChat[0].UsersList[0],
        user2Upload: this.props.route.params.userChat[0].UsersList[1]
      }

  }
  componentDidMount() {
    firebase.database().ref('messages').child(this.state.userChat[0].itemRequestId).on('child_added', (value) => {
      this.setState((prevState) => {
        return {
          messagesList: [...prevState.messagesList, value.val()]
        }
      })
    })
  }

  handleChange = (key) => val => {
    this.setState({ [key]: val })
  }

  sendMessage = async () => {

    const messageId = this.props.route.params.userChat[0].itemRequestId;
    if (this.state.textMessage.length > 0) {
      let msgId = firebase.database().ref('messages').child(this.state.userChat[0].itemRequestId).push().key;
      //console.log('msgId:', msgId)
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: this.state.userChat[0].UsersList[0]
      }
      //console.log('messages: ', messageId)
      updates['messages/' + messageId + '/' + msgId] = message;
      //console.log('update: ', updates)
      firebase.database().ref().update(updates)
      this.setState({ textMessage: '' })
    }
  }
  renderRow = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '60%',
          alignSelf: item.from.id === this.state.userChat[0].UsersList[0].id ? 'flex-end' : 'flex-start',
          backgroundColor: item.from.id === this.state.userChat[0].UsersList[0].id ? '#c2d4bf' : '#c3acc8',
          borderRadius: 8,
          marginBottom: 10
        }}
      >
        <Text style={{ color: '#000', padding: 7, fontSize: 16 }}>
          {item.message}
        </Text>
        <Text style={{ color: '#000', padding: 3, fontSize: 12 }}>
          {this.convertTime(item.time)}</Text>
      </View>
    )
  }

  convertTime = (time) => {
    let d = new Date(time);
    let c= new Date();
    let result= (d.getHours() < 10 ? '0' : '') + d.getHours()+ ':'
    result += (d.getMinutes()< 10 ? '0': '') + d.getMinutes();
    if(c.getDay() !== d.getDay()){
      result= d.getDay() + ' ' + d.getMonth() + ' ' + result;
    }
    return result;
  }

  render() {
    //let { heigth, width } = Dimensions.get('window');
    return (
      <SafeAreaView >
        <FlatList
          style={{ padding: 10, marginTop: 50 }}
          data={this.state.messagesList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 590 }}>

          <TextInput
            style={styles.input}
            value={this.state.textMessage}
            placeholder="Type..."
            onChangeText={this.handleChange('textMessage')}
          />
          <TouchableOpacity onPress={this.sendMessage}>
            <Text style={styles.btnText}>send</Text>
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
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    marginBottom: 10,
    marginTop: 40,

    //borderRaduis: 5
  },
  btnText: {
    color: 'darkblue',
    fontSize: 20
  }
})