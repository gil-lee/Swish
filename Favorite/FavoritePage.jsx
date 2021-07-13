import React, { Component } from 'react'
import { Text, View, ImageBackground, ScrollView, StyleSheet ,TouchableOpacity, Image} from 'react-native'
import FavoriteListCard from './FavoriteListCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const urlDeleteFavorite = "http://proj.ruppin.ac.il/bgroup17/prod/api/FavoriteUsers/DeleteFav"
const urlGetFavorite = "http://proj.ruppin.ac.il/bgroup17/prod/api/FavoriteUsers/GetFavoriteList"
const urlGetUser = "http://proj.ruppin.ac.il/bgroup17/prod/api/FavoriteUsers/FavoriteUsersGet"

export default class FavoritePage extends Component {
  constructor(props) {
    super(props),
      this.state = {
        favList: [],
        user: this.props.route.params.user,
        userItemsList: [],
        favUsersList: [],
        favoriteUser: true
      }
    //this.fetchFavList()
  }
  componentDidMount() {
    this.fetchFavList()
  }
  componentWillReceiveProps() {
    this.fetchFavList()
    console.log('in will recive props! - favorite page ')
  }

  componentWillUnmount() {
    this.setState({ user: this.props.route.params.user })
    this.fetchFavList()
  }
  //  goToOtherProfile= ()=> {
  //    let logInUser= this.state.user;
  //    let user= this.state.favUsersList[0];
  //    console.log('fav list: to see where user is', this.state.favUsersList)
  //   var users = { user, logInUser }
  //   this.props.navigation.navigate('OtherUserProfile', { users: users })
  // }
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
        this.setState({ favList: tempArr }
          ,()=> console.log('fav list to see the user: ', this.state.favList)
          )
        this.fetchUsersFromList(tempArr)
      },
        (error) => {
          console.log('Error', error);
        })
  }

  fetchUsersFromList = (tempArr) => {
    let temp = []
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
          
          //,()=> console.log('users: ', this.state.favUsersList)  
          )
        },
          (error) => {
            console.log('Error', error);
          })
    )
  }
  //  removeFavorite=(favUser)=> {
  //    let isFav= this.state.favoriteUser
  //    this.setState({favoriteUser: !isFav})
  //   let favRow = {
  //     emailLGUser: this.state.user.email,
  //     emailFavUser: favUser.email
  //   }
  //   fetch(urlDeleteFavorite, {
  //     method: 'DELETE',
  //     body: JSON.stringify(favRow),
  //     headers: new Headers({
  //       'Content-Type': 'application/json; charset=UTF-8',
  //       'Accept': 'application/json; charset=UTF-8',
  //     })
  //   })
  //     .then(res => {
  //       console.log('res.ok DELETEFavUsers= ', res.ok);
  //       return res.json()
  //     })
  //     .then(favUsers => {
        
  //       this.props.navigation.navigate('Navigator', { screen: 'Profile Page', params: { user: logInUser }, initial: false })
  //       this.props.navigation.navigate('Navigator', { screen: 'UploadDetails', params: { user: logInUser }, initial: false })
  //       this.props.navigation.navigate('Navigator', { screen: 'Main Chat Page', params: { user: logInUser }, initial: false })
  //       this.props.navigation.navigate('Navigator', { screen: 'FeedPage', params: { user: logInUser }, initial: false })
  //       this.props.navigation.navigate('Navigator', { screen: 'Favorite', params: { user: logInUser } })

  //       //console.log("favorite users: ", favUsers)
  //     },
  //       (error) => {
  //         console.log('Error', error);
  //       })
  // }

  // printFavUsersList=(user)=>{
  //   let favUser= user;
  //   return <View>
  //     <View key={user.id} style={styles.layout}>
  //       <TouchableOpacity onPress={this.goToOtherProfile}>
  //         <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', }}>
  //           <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
  //             <Text style={styles.TextFav}>{user.firstName} {user.lastName}</Text>
  //             <Image source={{ uri: user.profilePicture }} style={styles.userImage} />
  //             <View style={{ justifyContent: 'flex-start' }}>
  //             </View>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //       <View style={{ justifyContent: 'flex-end' }}>
  //         {console.log('favorite user state: ', this.state.favoriteUser)}
  //         {this.state.favoriteUser ?
  //           <TouchableOpacity onPress={()=>this.removeFavorite(favUser)} style={styles.heartBtn}>
  //             <MaterialCommunityIcons name="heart" color={"#9d76a5"} size={25} />
  //           </TouchableOpacity> :
  //           null}

  //       </View>
  //     </View>
  //     <View style={styles.line} />
  //   </View>
  // }

  render() {
    return (
      <ImageBackground source={require('../assets/bgImage1.png')} style={styles.image}>
        <View style={styles.container}>
          <Text style={styles.Text}> משתמשים שאהבתי </Text>
        </View>
        <ScrollView>
          {this.state.favUsersList ?
            this.state.favUsersList.map((user) =>
              <FavoriteListCard user={user} logInUser={this.state.user} navigation={this.props.navigation} />
            ) : null}
            {/* {this.state.favUsersList?
            this.state.favUsersList.map((user)=> this.printFavUsersList(user))
            : null} */}
          <Text style={{ paddingBottom: 190 }}></Text>
        </ScrollView>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  Text: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20
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
  TextFav: {
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
  },
  userImage: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  heartBtn: {
    paddingBottom: 20,
    paddingLeft: 25,
    marginRight: 20
  },
})
