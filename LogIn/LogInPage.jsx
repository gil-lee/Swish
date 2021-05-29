import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Image, Alert } from 'react-native'
import { TabActions } from '@react-navigation/native';

//var tempUser = '';
export default class LogInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    }
  }

  btnSignUp = () => { //מעבר לעמוד הרשמה
    this.props.navigation.navigate('Sign Up')
  }

  btnLogIn = () => { //פונקציית כפתור ההתחברות, בדיקה האם המשתמש קיים וכניסה למערכת

    const url = "http://proj.ruppin.ac.il/bgroup17/prod/api/UserNew/logIn";

    fetch(url + '/' + this.state.email + '/' + this.state.password, {
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
      .then(tempUser => {
        //console.log('user: ', tempUser)
        if (tempUser.length == 0) {
          Alert.alert("אופס...", "קיימת שגיאה בכתובת האימייל או בסיסמה") //כאשר אחד מהפרטים שהוזנו שגוי
       
        }
        else {
             //במידה והפרטים נכונים עוברים לעמוד הבית
          //כאן אנחנו מעבירות את המשתמש לעמודים אחרים
          this.props.navigation.navigate('Navigator', { screen: 'UploadDetails', params: { user: tempUser[0] }, initial: false })
          this.props.navigation.navigate('Navigator', { screen: 'Profile Page', params: { user: tempUser[0] }, initial: false })
          this.props.navigation.navigate('Navigator', { screen: 'Favorite', params: { user: tempUser[0] }, initial: false })
          this.props.navigation.navigate('Navigator', { screen: 'Main Chat Page', params: { user: tempUser[0] }, initial: false })
          this.props.navigation.navigate('Navigator', { screen: 'FeedPage', params: { user: tempUser[0] } }) //מעביר עמוד ומידע ביחד

        }
      },
        (error) => {
          console.log('Error', error);
        })
  }

  render() {
    return (
      <ImageBackground source={require('../assets/bgImage.png')} style={styles.image}>

        <View style={styles.container}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text></Text>
          <View style={styles.inputView} >

            <TextInput
              style={styles.inputText}
              placeholder="אימייל"
              placeholderTextColor="#A7A7A7"
              textAlign={'center'}
              autoCapitalize= "none"
              onChangeText={text => this.setState({ email: text })} />
          </View>
          <View style={styles.inputView} >
            <TextInput
              secureTextEntry
              style={styles.inputText}
              placeholder="סיסמה"
              placeholderTextColor="#A7A7A7"
              textAlign={'center'}
              onChangeText={text => this.setState({ password: text })} />
          </View>

          <TouchableOpacity>
            <Text style={styles.forgot}>שכחת סיסמה?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn} onPress={this.btnLogIn}>
            <Text style={styles.loginText}>התחברות</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.regBtn} onPress={this.btnSignUp}>
            <Text style={styles.regText}>הרשמה</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputView: {
    width: "80%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#A7A7A7",
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "#101010"
  },
  loginText: {
    color: "white",
    fontSize: 18
  },
  regText: {
    color: "white",
    fontSize: 14
  },
  forgot: {
    color: "#101010",
    fontSize: 14
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#7DA476",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
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
  logo: {
    width: 300,
    height: 150
  }
})