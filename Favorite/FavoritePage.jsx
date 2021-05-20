import React, { Component } from 'react'
import { Text, View, ImageBackground, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FavoriteListCard from './FavoriteListCard';


const urlGetFavorite = "http://proj.ruppin.ac.il/bgroup17/prod/api/FavoriteUsers/GetFavoriteList"
const urlGetUser = "http://proj.ruppin.ac.il/bgroup17/prod/api/FavoriteUsers/FavoriteUsersGet"

export default class FavoritePage extends Component {
  constructor(props) {
    super(props),
      this.state = {
        favList: [],
        user: this.props.route.params.user,
        userItemsList: [],
        favUsersList: []
      }
  }
  componentDidMount() {
    this.fetchFavList()
  }

  fetchFavList = () => {
    let tempArr = []
    fetch(urlGetFavorite + "/" + this.state.user.email + "/", {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res.ok getUsersList= ', res.ok);
        return res.json()
      })
      .then(favRows => {
        favRows.map(user =>
          tempArr.push(user.emailFavUser))
        //console.log(tempArr)
        this.setState({ favList: tempArr })
        this.fetchUsersFromList(tempArr)
      },
        (error) => {
          console.log('Error', error);
        })
  }

  fetchUsersFromList = (tempArr) => {
    let temp = []
    //console.log(tempArr)
    tempArr.map((user) =>
      fetch(urlGetUser + '/' + user + '/', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        })
      })
        .then(res => {
          console.log('res.ok getUser= ', res.ok);
          return res.json()
        })
        .then(user => {
          temp.push(user[0])
          this.setState({ favUsersList: temp }
            // , () => console.log("favUsers details    ", this.state.favUsersList)
          )
        },
          (error) => {
            console.log('Error', error);
          })
    )
  }

  render() {
    return (
      <ImageBackground source={require('../assets/bgImage1.png')} style={styles.image}>
        <View style={styles.container}>
          <Text style={styles.Text}> משתמשים שאהבתי </Text>
        </View>
        <ScrollView>
          {/* {console.log('fav list to card: ', this.state.favUsersList)} */}
          {this.state.favUsersList ?
            this.state.favUsersList.map((user) =>
              <FavoriteListCard user={user} logInUser={this.state.user} navigation={this.props.navigation} />
            ) : null}
          <Text style={{paddingBottom: 190}}></Text>
        </ScrollView>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  Text: {
    fontSize: 20,
    fontWeight: '500'
  },
  container: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20
    //flexDirection: 'column'
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  line: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
    borderBottomColor: '#a7a7a7',
    borderBottomWidth: 1
  },
})
