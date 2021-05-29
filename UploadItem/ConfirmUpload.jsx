import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import CardItemUpload from '../Home/CardItemUpload';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImageBackground } from 'react-native';

const urlItemSize = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemSize";
const urlItemStyle = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemStyle";
const urlItemPrice = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemPrice ";
const urlConditionPrice = "http://proj.ruppin.ac.il/bgroup17/prod/api/ConditionPrices";
const urlUserItem = "http://proj.ruppin.ac.il/bgroup17/prod/api/UserItems";
const urlAvatarLevel = "http://proj.ruppin.ac.il/bgroup17/prod/api/UserNew/AvatarPut";
const urlUser = "http://proj.ruppin.ac.il/bgroup17/prod/api/UserNew";
const urlItem = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemNew/Post";

export default class ConfirmUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finalItem: this.props.route.params.confirmItem,
      sizeId: '',
      typeId: 10,
      stylId: '',
      conditionId: '',
      user: this.props.route.params.user,
      userAfterPut: '',
      //longitudeSt: 0,
      //latitudeSt: 0,
    }
  }
  componentDidMount() { //פאטצים להבאת idלכל קטגוריה 
    this.callFetchFunc()
  }

  callFetchFunc = () => {
    this.fetchCheck(urlItemSize);
    this.fetchCheck(urlItemStyle);
    this.fetchCheck(urlItemPrice);
    this.fetchCheck(urlConditionPrice);
    //this.getCurrentLocation();
  }
  
  fetchCheck = (url) => { //הבאת id לכל קטגוריה 

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res.ok=', res.ok);
        return res.json()
      })
      .then(dropDownArr => {
        if (url == urlItemPrice) { //הבאת סוגID
          for (let i = 0; i < dropDownArr.length; i++) {
            if (dropDownArr[i].name == this.state.finalItem.type) {
              this.setState({ typeId: dropDownArr[i].id }, console.log("type id: ", this.state.typeId))
            }
          }
        }
        if (url == urlItemSize) {//הבאת מחירID
          for (let i = 0; i < dropDownArr.length; i++) {
            if (dropDownArr[i].size == this.state.finalItem.size) {
              this.setState({ sizeId: dropDownArr[i].id }, console.log("size id: ", this.state.sizeId))
            }
          }
        }
        if (url == urlConditionPrice) { //הבאת מצבID
          for (let i = 0; i < dropDownArr.length; i++) {
            if (dropDownArr[i].condition == this.state.finalItem.condition) {
              this.setState({ conditionId: dropDownArr[i].id })
            }
          }
        }
        if (url == urlItemStyle) { //הבאת סגנוןID
          for (let i = 0; i < dropDownArr.length; i++) {
            if (dropDownArr[i].style == this.state.finalItem.style) {
              this.setState({ styleId: dropDownArr[i].id })
            }
          }
        }
      },
        (error) => {
          console.log('Error', error);
        })
  }

  fetchItem = () => {

    let item = { //יצירת פריט חדש
      name: this.state.finalItem.name,
      description: this.state.finalItem.description,
      image1: this.state.finalItem.image1,
      image2: this.state.finalItem.image2,
      image3: this.state.finalItem.image3,
      image4: this.state.finalItem.image4,
      sizeId: this.state.sizeId,
      typeId: this.state.typeId,
      styleId: this.state.styleId,
      conditionId: this.state.conditionId,
      longitude: this.state.finalItem.longitude,
      latitude: this.state.finalItem.latitude
    }
    console.log('item: ', item)

     fetch(urlItem + "/" + this.state.user.email + "/", { //העלאת פריט לטבלת itemNew
      method: 'POST',
      body: JSON.stringify(item),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res: ', res)
        console.log('res.ok postItem=', res.ok);
        return res.json()
      })
      .then(i => {
        console.log('פריט נוסף בהצלחה ל userItem ')
        this.avatarLevelUp()
      },
        (error) => {
          console.log('Error', error);
        })
  }

  avatarLevelUp = () => {
    let newUser = '';
    fetch(urlUser, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res.ok get user=', res.ok);
        return res.json()
      })
      .then(users => {
        for (let i = 0; i < users.length; i++) {
          if (users[i].email == this.state.user.email) {
            if (users[i].avatarlevel == 1) {
              Alert.alert("יש!!", "קיבלת 30 נקודות נוספות למימוש")
            }
            this.setState({ userAfterPut: users[i] })
            newUser = this.state.userAfterPut
            console.log('user after put:   ', newUser)
          }
        }
        this.props.navigation.push('Navigator', { screen: 'Profile Page', params: { user: newUser } })
        this.props.navigation.navigate('Navigator', { screen: 'FeedPage', params: { user: newUser } })
      },
        (error) => {
          console.log('Error', error);
        })
  }

  btnBack = () => {
    this.props.navigation.navigate('UploadDetails')
  }


  render() {
    return (
      <ImageBackground source={require('../assets/bgImage1.png')} style={styles.image}>
        <View>
          <TouchableOpacity onPress={this.btnBack} style={styles.backBtn}>
            <Icon name="chevron-left" size={20} color="#101010" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>העלאת פריט</Text>
          </View>
          <CardItemUpload data={this.state.finalItem} navigation={this.props.navigation} />

          <View style={styles.line} />
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
            <View style={{ flexDirection: 'row-reverse', marginTop: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                ערך הפריט הוא {this.state.finalItem.numberOfPoints}
              </Text>
              <MaterialCommunityIcons name="cash" color={"#7DA476"} size={24} />
            </View>
            <TouchableOpacity style={styles.regBtn} onPress={this.fetchItem}>
              <Text style={styles.regText}>העלאת פריט</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    )
  }
}


const styles = StyleSheet.create({
  regBtn: {
    width: 80,
    backgroundColor: "#9d76a5",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  backBtn: {
    paddingTop: 50,
    paddingLeft: 25,
    alignItems: 'flex-start'
  },
  regBtn: {
    width: 100,
    backgroundColor: "#9d76a5",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  regText: {
    color: "white",
    fontSize: 14
  },
  line: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: -20,
    borderBottomColor: '#a7a7a7',
    borderBottomWidth: 1
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  }
})