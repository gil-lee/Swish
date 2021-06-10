import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ImageBackground, ScrollView, Alert } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-material-dropdown-v2';
import CardItemFeed from './CardItemFeed';
import currentLocation from '../Location/currentLocation';
import * as Location from 'expo-location';
import { TextInput } from 'react-native';
import UploadDetails from '../UploadItem/UploadDetails';
import { UIImagePickerControllerQualityType } from 'expo-image-picker/build/ImagePicker.types';

const urlGetItems = "http://proj.ruppin.ac.il/bgroup17/prod/api/UserNew/UsersListGet"
const urlGetItemsDist = "http://proj.ruppin.ac.il/bgroup17/prod/api/UserNew/GetUserItemsListDistance"
const urlItemSize = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemSize";
const urlItemStyle = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemStyle";
const urlItemPrice = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemPrice ";
const urlConditionPrice = "http://proj.ruppin.ac.il/bgroup17/prod/api/ConditionPrices";

const urlFilter = "http://proj.ruppin.ac.il/bgroup17/prod/api/UserNew/GetItemFilter";

const users = [];
const items = [];

const typeTemp = [];
const sizeTemp = [];
const conditionTemp = [];
const styleTemp = [];

const types = [];
const conditions = [];
const sizes = [];
const styless = [];

export default class FeedPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userTemplate: this.props.route.params.user,
      itemTemplate: '',
      itemsList: [],
      itemListDB: [],
      usersList: [],
      avatarLevelUser: 1,
      itemType: [],
      size: [],
      condition: [],
      itemStyle: [],
      selectedType: '',
      selectedSize: '',
      selectedCondition: '',
      selectedStyle: '',
      filterName: '',

      search: '',
      latitudeSt: 0,
      longitudeSt: 0,
      locationPre: false,
    }
    this.sizeDD = null;
    this.styleDD = null;
    this.typeDD = null;
    this.conDD = null;
  }

  componentDidMount() {
    this.callFetchFunc()
    // console.log('user in feed: ', this.state.userTemplate)
  }
  componentWillUnmount() {
    this.setState({ userTemplate: this.props.route.params.user })
    this.getLocation(true)
    // , () => {
    // console.log('user in feed will: ', this.state.userTemplate)}

  }
  callFetchFunc = () => {
    this.fetchDropDown(urlItemSize);
    this.fetchDropDown(urlItemStyle);
    this.fetchDropDown(urlItemPrice);
    this.fetchDropDown(urlConditionPrice);
    this.getCurrentLocation()
    this.getAvatarForUser(this.props.route.params.user)
  }

  getCurrentLocation = async () => {

    let premission = await Location.hasServicesEnabledAsync();
    if (premission === false) {
      Alert.alert('אופס..', 'לתשומת לבך לא ניתן לראות פריטים זמינים ללא הפעלת שירות מיקום נוכחי',
        [
          { text: "התעלם", onPress: () => this.setState({ locationPre: false }) },
          {
            text: "הפעל שירותי מיקום",
            onPress: this.getPremission
          }
        ])
    }
    //console.log('prem..: ', premission)
    if (premission === true) {
      this.getPremission()
    }
  }

  getPremission = async () => {
    this.setState({ locationPre: true });
    let prem = await Location.requestPermissionsAsync();
    //console.log('prem2: ', prem.granted)
    this.getLocation(prem)
  }
  getLocation = async (prem) => {
    if (prem.granted == true) {
      let location = await Location.getCurrentPositionAsync();
      console.log('location: ', location)
      this.setState(
        {
          latitudeSt: location.coords.latitude,
          longitudeSt: location.coords.longitude,
          locationPre: true
        }
      )
      this.fetchUserItemsByEmail(this.state.longitudeSt, this.state.latitudeSt)
      this.props.navigation.navigate('Navigator', { screen: 'UploadDetails',initial: false, params: { longitude: this.state.longitudeSt, latitude: this.state.latitudeSt } })
      this.props.navigation.navigate('Navigator', { screen: 'FeedPage' })
    }
  }

  fetchUserItemsByEmail = async (longi, lati) => {
    console.log('longi lati: ', longi, lati)
    await fetch(urlGetItemsDist + "/" + this.state.userTemplate.email + "/" + longi + "/" + lati + "/", {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res.ok getAllItems= ', res.ok);
        return res.json()
      })
      .then(items => {
        this.setState({ itemsList: items, itemListDB: items }
          //, () => console.log('items: ', items)
        )
      },
        (error) => {
          console.log('Error', error);
        })
  }

  getAvatarForUser = (user) => { //הבאת האווטאר למשתמש מסוים
    let level = user.avatarlevel
    // console.log('level: ', level)
    let imageUri = "http://proj.ruppin.ac.il/bgroup17/prod/AvatarImages/avatarLevel" + level + ".png"

    this.setState({ avatarLevelUser: imageUri }
      // , () => console.log('avatar in feed uri: ', this.state.avatarLevelUser)
    )
  }

  fetchDropDown = (url) => { //פונקציית הפאץ להבאת הרשימות הנפתחות

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        //console.log('res.ok=', res.ok);
        return res.json()
      })
      .then(dropDownArr => { //הבאת כל סוגי הפריטים
        if (url == urlItemPrice) {
          for (let i = 0; i < dropDownArr.length; i++) {
            typeTemp[i] = dropDownArr[i].name
            types[i] = dropDownArr[i]
          }
          this.setState({ itemType: typeTemp })
        }
        if (url == urlItemSize) { // הבאת המידות
          for (let i = 0; i < dropDownArr.length; i++) {
            sizeTemp[i] = dropDownArr[i].size
            sizes[i] = dropDownArr[i]
          }
          this.setState({ size: sizeTemp })
        }
        if (url == urlConditionPrice) { // הבאת מצבי פריטים
          for (let i = 0; i < dropDownArr.length; i++) {
            conditionTemp[i] = dropDownArr[i].condition
            conditions[i] = dropDownArr[i]

          }
          this.setState({ condition: conditionTemp })
        }
        if (url == urlItemStyle) { //הבאת סגנונות
          for (let i = 0; i < dropDownArr.length; i++) {
            styleTemp[i] = dropDownArr[i].style
            styless[i] = dropDownArr[i]
          }
          this.setState({ itemStyle: styleTemp })
        }
      },
        (error) => {
          console.log('Error', error);
        })
  }

  clearDropDown = () => {
    this.setState({
      selectedCondition: '',
      selectedSize: '',
      selectedStyle: '',
      selectedType: ''
    })
    this.resetMyDropdown()
    this.callFetchFunc()
  }

  resetMyDropdown() {
    if (this.sizeDD) {
      this.sizeDD.setState({ value: '' });
    }
    if (this.styleDD) {
      this.styleDD.setState({ value: '' });
    }
    if (this.typeDD) {
      this.typeDD.setState({ value: '' });
    }
    if (this.conDD) {
      this.conDD.setState({ value: '' });
    }
  }

  filterItems(text, inputType){
    console.log('text: ', inputType)
    //console.log('items:',  item.itemsListDTO[0])
    let newItemsList;
    switch (inputType) {
      case "type":
         newItemsList = this.state.itemsList.filter(item =>
          item.itemsListDTO[0].priceList[0].name == text)
          
        break;
      case "size":
         newItemsList = this.state.itemsList.filter(item =>
          item.itemsListDTO[0].sizeList[0].size == text)
        break;
      case "style":
         newItemsList = this.state.itemsList.filter(item =>
          item.itemsListDTO[0].styleList[0].style == text)
        break;
      case "condition":
         newItemsList = this.state.itemsList.filter(item =>
          item.itemsListDTO[0].conditionList[0].condition == text)
        break;
    }
    // let newItemsList = this.state.itemListDB.filter(item =>
    //   item.itemsListDTO[0].sizeList[0].size == text)
    this.setState({ itemsList: newItemsList });
  }

  render() {
    return (
      <ImageBackground source={require('../assets/bgImage1.png')} style={styles.image}>
        <View>
          <View style={styles.container}>
            <View style={styles.searchSection}>
              <MaterialCommunityIcons name="magnify" color={"#a7a7a7"} size={20} />
              <TextInput style={styles.sendBtn}
                placeholder='חפש'
                onChangeText={text => {
                  //console.log(text);
                  //console.log(this.state.itemListDB[0].itemsListDTO[0].name);
                  let newItemsList = this.state.itemListDB.filter(item =>
                    item.itemsListDTO[0].name.includes(text) ||
                    item.itemsListDTO[0].description.includes(text));
                  this.setState({ itemsList: newItemsList });
                }} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: this.state.userTemplate.profilePicture }} style={styles.userImage}></Image>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.userHeader}>{this.state.userTemplate.firstName} {this.state.userTemplate.lastName}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <MaterialCommunityIcons name="cash" color={"#7DA476"} size={20} />
                  <Text style={styles.userHeader}>{this.state.userTemplate.numOfPoints}</Text>
                </View>
              </View>
            </View>
            <Image source={{ uri: `${this.state.avatarLevelUser}` }} style={styles.avatar} ></Image>
          </View>
          <View style={styles.line} />
          <Text></Text>
          <View style={{ flexDirection: 'row-reverse', justifyContent: "center", alignContent: "center" }}>

            <Dropdown
              label='מידה'
              data={this.state.size.map((size, s) => ({ key: s, value: size }))}
              style={styles.dropDwSmall}
              onChangeText={(text)=> this.filterItems(text, 'size')}
              underlineColor={'transparent'}
              ref={c => (this.sizeDD = c)}
            />
            <Dropdown
              label='סוג'
              data={this.state.itemType.map((type, t) => ({ key: t, value: type }))}
              style={styles.dropDw}
              onChangeText={(text)=> this.filterItems(text, 'type')}
              underlineColor={'transparent'}
              ref={c => (this.typeDD = c)}
            />
            <Dropdown
              label='סגנון'
              data={this.state.itemStyle.map((itemStyle, i) => ({ key: i, value: itemStyle }))}
              style={styles.dropDwSmall}
              onChangeText={(text)=> this.filterItems(text, 'style')}
              underlineColor={'transparent'}
              ref={c => (this.styleDD = c)}
            />
            <Dropdown
              label='מצב'
              data={this.state.condition.map((condition, c) => ({ key: c, value: condition }))}
              style={styles.dropDwSmall}
              onChangeText={(text)=> this.filterItems(text, 'condition')}
              underlineColor={'transparent'}
              ref={c => (this.conDD = c)}
            />
            <TouchableOpacity style={{ margin: 5 }} onPress={this.clearDropDown}>
              <MaterialCommunityIcons name="close" color={"#a7a7a7"} size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.line} />
          <ScrollView>
            {this.state.locationPre == false &&
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Text>אין פריטים זמינים לצפייה...</Text>
                <Text>לצפייה בפריטים הפעל/י את שירותי המיקום</Text>
              </View>}


            {this.state.itemsList ?
              this.state.itemsList.map((item) =>
                <CardItemFeed key={item.itemsListDTO[0].id} data={item.itemsListDTO[0]} user={item.userListDTO[0]} navigation={this.props.navigation} logInUser={this.state.userTemplate} />) : null}

            <Text style={{ paddingBottom: 180 }}></Text>
          </ScrollView>
        </View>
      </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  Text: {
    fontSize: 25,
    fontWeight: '500'
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  sendBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#a7a7a7',
    height: 43,
    width: 65,
  },
  container: {
    alignItems: 'center',
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  requestBtn: {
    width: 40,
    backgroundColor: "#9d76a5",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    alignSelf: 'flex-start'
  },
  btnText: {
    color: "white",
    fontSize: 14,
    fontWeight: '500'
  },
  avatar: {
    height: 60,
    width: 40,
  },
  line: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 8,
    borderBottomColor: '#a7a7a7',
    borderBottomWidth: 1
  },
  userHeader: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold'
  },
  userImage: {
    height: 60,
    width: 60,
    borderRadius: 50
  },
  dropDw: {
    width: 110,
    height: 40,
    marginTop: -1,
    marginBottom: 5,
    marginLeft: 2.5,
    marginRight: 2.5,
    color: '#414042',
    backgroundColor: 'transparent',
    borderRadius: 6,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: "#A7A7A7",
    fontSize: 10,
    direction: 'rtl',
  },
  dropDwSmall: {
    width: 60,
    height: 40,
    marginTop: -1,
    marginBottom: 5,
    marginLeft: 2.5,
    marginRight: 2.5,
    color: '#414042',
    backgroundColor: 'transparent',
    borderRadius: 6,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: "#A7A7A7",
    fontSize: 10,
    direction: 'rtl',
  },
  btnClean: {
    borderWidth: 1,
    borderColor: "#9d76a5",
    borderRadius: 6,
    width: 60,
    height: 40,
  },
  image: {
    flex: 1,
    resizeMode: 'cover'
  },
})
