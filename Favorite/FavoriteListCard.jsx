import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


export default function FavoriteListCard(props) {

  const urlDeleteFavorite = "http://proj.ruppin.ac.il/bgroup17/prod/api/FavoriteUsers/DeleteFav"
  const urlGetFavorite = "http://proj.ruppin.ac.il/bgroup17/prod/api/FavoriteUsers/GetFavoriteList"
  const urlGetUser = "http://proj.ruppin.ac.il/bgroup17/prod/api/FavoriteUsers/FavoriteUsersGet"


  const navigation = useNavigation();
  const [favoriteUser, setFavoriteUser] = useState(true)
  const [favList, setFavList] = useState()
  const [favUsersList, setFavUsersList] = useState(null)
  var user = props.user
  var LGUser = props.logInUser
  var users = { user, LGUser }


  // useEffect(() => {
  //   if (favList == null) {
  //     fetchFavList()
  //   }
  // }, [favList])

  const fetchFavList= ()=> {
    let tempArr = []

    useEffect(()=>{
    fetch(urlGetFavorite + "/" + props.logInUser.email + "/", {
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
        //console.log('temp arr ', tempArr)
        setFavList(tempArr)
      },
        (error) => {
          console.log('Error', error);
        })

        fetchUsersFromList(tempArr)
      })
  }


  function fetchUsersFromList(tempArr) {
    let temp = []
    tempArr.map((user) => {
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
          //console.log(user[0])
          temp.push(user[0])

          //console.log("favUsers details    ", temp)
        },
          (error) => {
            console.log('Error', error);
          })
      setFavUsersList(temp)
      console.log('temp: ', temp)
      console.log('favList state: ', favUsersList)
    }
    )
  }


  function goToOtherProfile() {
    navigation.navigate('OtherUserProfile', { users: users })
  }

  function removeFavorite() {
    setFavoriteUser(!favoriteUser)
    let favRow = {
      emailLGUser: users.LGUser.email,
      emailFavUser: users.user.email
    }
    fetch(urlDeleteFavorite, {
      method: 'DELETE',
      body: JSON.stringify(favRow),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res.ok DELETEFavUsers= ', res.ok);
        return res.json()
      })
      .then(favUsers => {
        console.log("favorite users: ", favUsers)
      },
        (error) => {
          console.log('Error', error);
        })
  }

  function printUsersFav(user) {
    return <View style={styles.layout}>
      <TouchableOpacity onPress={goToOtherProfile}>
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', }}>
          <View style={{ justifyContent: 'flex-start' }}>
            <Image source={{ uri: user.profilePicture }} style={styles.userImage} />
            <View style={{ justifyContent: 'flex-start' }}>
              <Text style={styles.Text}>{user.firstName} {user.lastName}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={{ justifyContent: 'flex-end' }}>
        {favoriteUser ?
          <TouchableOpacity onPress={removeFavorite} style={styles.heartBtn}>
            <MaterialCommunityIcons name="heart" color={"#9d76a5"} size={25} />
          </TouchableOpacity> :
          null}
      </View>
    </View>
  }
  return (
    <View>
      {fetchFavList}
      {console.log('first time:1: ', favUsersList)}
      {favUsersList ?
        favUsersList.map((user) =>
          //printUsersFav(user)
          <View key={user.id} style={styles.layout}>
            <TouchableOpacity onPress={goToOtherProfile}>
              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', }}>
                <View style={{ justifyContent: 'flex-start' }}>
                  <Image source={{ uri: user.profilePicture }} style={styles.userImage} />
                  <View style={{ justifyContent: 'flex-start' }}>
                    <Text style={styles.Text}>{user.firstName} {user.lastName}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{ justifyContent: 'flex-end' }}>
              {favoriteUser ?
                <TouchableOpacity onPress={removeFavorite} style={styles.heartBtn}>
                  <MaterialCommunityIcons name="heart" color={"#9d76a5"} size={25} />
                </TouchableOpacity> :
                null}

            </View>
          </View>
        )
        : null
      }

      <View style={styles.line} />
    </View>
  )
}

const styles = StyleSheet.create({
  Text: {
    fontSize: 12,
    color: "#000",
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
    borderRadius: 50
  },
  line: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: -20,
    borderBottomColor: '#a7a7a7',
    borderBottomWidth: 1
  },
  heartBtn: {
    paddingTop: 50,
    paddingLeft: 25,
    //alignItems: 'flex-start',
    marginRight: 20
  },
})