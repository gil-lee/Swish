import React, { Component } from 'react'
import { ScrollView } from 'react-native';
import { Text, View, StyleSheet, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CardItem from './CardItem';
import { Dropdown } from 'react-native-material-dropdown-v2';
import CardItemFeed from './CardItemFeed';
import { ImageBackground } from 'react-native';
import { SearchBar } from 'react-native-elements';

const urlGetItems = "http://proj.ruppin.ac.il/bgroup17/prod/api/UserNew/UsersListGet"
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
    this.setState({ userTemplate: this.props.route.params.user }
      // , () => {
      // console.log('user in feed will: ', this.state.userTemplate)}
    )
  }
  callFetchFunc = () => {
    this.fetchDropDown(urlItemSize);
    this.fetchDropDown(urlItemStyle);
    this.fetchDropDown(urlItemPrice);
    this.fetchDropDown(urlConditionPrice);
    this.fetchUserItemsByEmail()

    this.getAvatarForUser(this.props.route.params.user)
  }

  fetchUserItemsByEmail = () => {

    fetch(urlGetItems + "/" + this.state.userTemplate.email + "/", {
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
        this.setState({ itemsList: items }
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
        console.log('res.ok=', res.ok);
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

  fetchFilter = (selectedName, filType) => {
    // console.log(this.state.userTemplate.email)
    // console.log(selectedName)
    // console.log(filType)

    switch (filType) {
      case "type":
        for (let i = 0; i < types.length; i++) {
          if (types[i].name == selectedName) {
            var t = types[i].id
          }
        }
        break;
      case "size":
        for (let i = 0; i < sizes.length; i++) {
          if (sizes[i].size == selectedName) {
            var t = sizes[i].id
          }
        }
        break;
      case "style":
        for (let i = 0; i < styless.length; i++) {
          if (styless[i].style == selectedName) {
            var t = styless[i].id
          }
        }
        break;
      case "condition":
        for (let i = 0; i < conditions.length; i++) {
          if (conditions[i].condition == selectedName) {
            var t = conditions[i].id
          }
        }
        break;
    }

    // console.log(t)
    fetch(urlFilter + "/" + this.state.userTemplate.email + "/" + t + "/" + filType, {
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
      .then(filterItems => {
        this.setState({ itemsList: filterItems }
          //, () => {console.log("user: ", this.state.itemsList)}
        )
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

  updateSearch = () => {
    return <SearchBar
      placeholder="Type Here..."
      onChangeText={this.updateSearch}
      value={search}
    />
  }

  render() {
    const { search } = this.state;
    return (
      <ImageBackground source={require('../assets/bgImage1.png')} style={styles.image}>
        <View>
          <View style={styles.container}>
            <TouchableOpacity onPress={this.updateSearch}>
              <MaterialCommunityIcons name="magnify" color={"#a7a7a7"} size={32} />
              {/* <SearchBar
        placeholder="Type Here..."
        onChangeText={this.updateSearch}
        value={search}
      /> */}
            </TouchableOpacity>
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
              onChangeText={(value) => this.setState({ selectedSize: value }), (value) => this.fetchFilter(value, "size")}
              underlineColor={'transparent'}
              ref={c => (this.sizeDD = c)}
            />
            <Dropdown
              label='סוג'
              data={this.state.itemType.map((type, t) => ({ key: t, value: type }))}
              style={styles.dropDw}
              onChangeText={(value) => this.setState({ selectedType: value }), (value) => this.fetchFilter(value, "type")}
              underlineColor={'transparent'}
              ref={c => (this.typeDD = c)}
            />
            <Dropdown
              label='סגנון'
              data={this.state.itemStyle.map((itemStyle, i) => ({ key: i, value: itemStyle }))}
              style={styles.dropDwSmall}
              onChangeText={(value) => this.setState({ selectedStyle: value }), (value) => this.fetchFilter(value, "style")}
              underlineColor={'transparent'}
              ref={c => (this.styleDD = c)}
            />
            <Dropdown
              label='מצב'
              data={this.state.condition.map((condition, c) => ({ key: c, value: condition }))}
              style={styles.dropDwSmall}
              onChangeText={(value) => this.setState({ selectedCondition: value }), (value) => this.fetchFilter(value, "condition")}
              underlineColor={'transparent'}
              ref={c => (this.conDD = c)}
            />
            <TouchableOpacity style={{ margin: 5 }} onPress={this.clearDropDown}>
              <MaterialCommunityIcons name="close" color={"#a7a7a7"} size={20} />
              {/* <Text style={styles.btnText}>ניקוי</Text> */}
            </TouchableOpacity>
          </View>

          <View style={styles.line} />
          <ScrollView>

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
  container: {
    // justifyContent: 'center',
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
