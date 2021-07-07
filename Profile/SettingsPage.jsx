import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, ImageBackground, Image, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Slider } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

const urlSettings = "http://proj.ruppin.ac.il/bgroup17/prod/api/UserNew/PutUserSettings"

export default class SettingsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: this.props.route.params.user,
      firstName: '',
      lastName: '',
      cities: this.props.route.params.user.residence,
      radius: this.props.route.params.user.radius,
      valueSlider: '',
      enableSecure: true,
      password: this.props.route.params.user.password,
      password_confirm: '',

      uri: '',
      image: null,
      uplodedPicUri: '',

       isEnabled1: '',
       
      favorite: '', 
      smartFinder: '',
      showItemsFeed:"", 
    }
  }
  componentDidMount(){
    if(this.state.user.showItemsFeed=="F"){
      this.setState({ isEnabled1: false})
    }
    if(this.state.user.showItemsFeed=="S"){
      this.setState({ isEnabled1:true})
    }
  }
  onChangeText = (key, val) => { //פונקציה דרכה משנות את הסטייטים של הוספת משתמש חדש
    this.setState({ [key]: val })

  }
  notificationChange = (num) => {

    if (num == "S") {
      let change = this.state.isEnabled1
      this.setState({ isEnabled1:!change, showItemsFeed:'S'})
    }
    if (num == "F") {
      let change = this.state.isEnabled2
      this.setState({  isEnabled1:change, showItemsFeed:'F'})
    }

  }
  btnBack = () => {
    this.props.navigation.goBack();
  }

  goToCities = (city) => { //מעבר לקומפוננטת ערים
    this.setState({ cities: city })
  }
  btnOpenGallery = async () => { //לעדכן
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    console.log("RESULT: ", permission);
    if (permission.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, allowsEditing: true })

    console.log(result);
    console.log('result uri!:', result.uri)
    if (result.cancelled === true) {
      return;
    }
    this.setState({ image: result.uri });
    this.btnUpload(result.uri) //העברת כתובת התמונה להעלאה לשרת
  }

  btnUpload = (urim) => { //חלק 1 העלאת תמונה לשרת
    let img = urim;
    let imgName = this.state.user.email + '.jpg'; //כתובת האימייל של המשתמש תהיה בכתובת התמונה
    this.imageUpload(img, imgName);
  };

  imageUpload = (imgUri, picName) => { //לעדכן

    let uplodedPicPath = 'http://proj.ruppin.ac.il/bgroup17/prod/uploadImages/';
    let urlAPI = "http://proj.ruppin.ac.il/bgroup17/prod/uploadpicture/";
    let dataI = new FormData();
    dataI.append('picture', {
      uri: imgUri,
      name: picName,
      type: 'image/jpg'
    });
    const config = {
      method: 'POST',
      body: dataI,
    };

    fetch(urlAPI, config)
      .then((res) => {
        console.log('res.status=', res.status);
        if (res.status == 201) {
          return res.json();
        }
        else {
          console.log('image name:   ', picName)
          console.log('error uploding ...');
          return "err";
        }
      })
      .then((responseData) => {
        console.log(responseData);
        if (responseData != "err") {
          let picNameWOExt = picName.substring(0, picName.indexOf("."));
          let imageNameWithGUID = responseData.substring(responseData.indexOf(picNameWOExt), responseData.indexOf(".jpg") + 4);
          let uriNewImage = uplodedPicPath + imageNameWithGUID;
          this.setState({ uplodedPicUri: uriNewImage }, () => console.log('img uploaded successfully!', this.state.uplodedPicUri)) //יישום בסטייט בכדי להציג לאחר מכן ללא פאטץ נוסף

        }
        else {
          console.log('error uploding');
          alert('error uploding');
        }
      })
      .catch(err => {
        alert('err upload= ' + err);
      });
  }
  confirmPassword = () => { //אימות הסיסמאות שהוזנו

    if (this.state.password_confirm != '') {
      let password = this.state.password;
      let passwordConfirm = this.state.password_confirm
      let check = this.checkAlphaNum(password); //בדיקה האם הוזנו מספרים בסיסמה (חובה להזין מספרים)
      console.log('check: ', check)
      if (check.containsNumber) {
        if (password != passwordConfirm) {
          Alert.alert('אופס...', 'אימות הסיסמה לא צלח, נסה שנית')
        }
        else {
          this.updateUser()
        }
      }
      else {
        Alert.alert('אופס...', 'הסיסמה לא תקינה, נדרשת להכיל מספרים')
      }
    }
    else if (this.state.password_confirm == '') {
      this.updateUser()
    }
  }
  checkAlphaNum = (password) => { //פונקציה שבודקת האם הוזנו מספרים לסיסמה
    let exp = {
      containsNumber: /\d+/
    };
    let expMatch = {};
    expMatch.containsNumber = exp.containsNumber.test(password);
    console.log('exp- numbers: ', expMatch)
    return expMatch;
  }

  updateUser = () => {
    let newUser = '';
    let user = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      showItemsFeed: this.state.showItemsFeed,
      radius: this.state.radius,
      residence: this.state.cities,
      password: this.state.password,
      profilePicture: this.state.uplodedPicUri
    }

    fetch(urlSettings + "/" + this.state.user.email + "/", {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res.ok putUserSet= ', res.ok);
        return res.json()
      })
      .then(user => {
        this.setState({ userAfterPut: user[0] }, () => console.log(this.state.userAfterPut))
        newUser = this.state.userAfterPut
        Alert.alert("יש..", "משתמש עודכן בהצלחה!")
        this.props.navigation.push('Navigator', { screen: 'Profile Page', params: { user: newUser } })
        this.props.navigation.navigate('Navigator', { screen: 'FeedPage', params: { user: newUser } })
      },
        (error) => {
          console.log('Error', error);
        })

  }
  logOut = () => {
    this.props.navigation.navigate('LogIn')
  }

  render() {
    return (
      <ImageBackground source={require('../assets/bgImage.png')} style={styles.image}>

        <ScrollView>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={this.btnBack} style={styles.backBtn}>
                <Icon name="chevron-left" size={20} color="#101010" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logOutBtn} onPress={this.logOut}>
              <Text style={styles.btnText}>התנתקות</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>הגדרות</Text>
          </View>


          <View style={styles.container}>

            <View style={{ flexDirection: 'row-reverse' }}>
              <View style={styles.text}>
                <Text >שם פרטי</Text>
                <TextInput
                  style={styles.input1}
                  autoCapitalize="none"
                  placeholder={this.state.user.firstName}
                  onChangeText={val => this.onChangeText('firstName', val)}
                />
              </View>
              <View style={styles.text}>
                <Text>שם משפחה</Text>
                <TextInput
                  style={styles.input1}
                  autoCapitalize="none"
                  placeholder={this.state.user.lastName}
                  onChangeText={val => this.onChangeText('lastName', val)}
                />
              </View>
            </View>
           
            <Text style={styles.text, { marginTop: 10 }}>עדכון תצוגת פריטים:</Text>

            <View style={{ flexDirection: 'row-reverse' }}>
              <View style={styles.text}>
                <TouchableOpacity style={styles.cityUpBtn} onPress={() => this.props.navigation.push('CitiesList', { goToCities: this.goToCities })}>
                  <Text style={styles.btnText}>מקום מגורים</Text>
                </TouchableOpacity>
                {this.state.cities ?
                  <Text>
                    מקום מגורים: {this.state.cities}
                  </Text> : null}
              </View>

              <View style={styles.text}>
                <Slider
                  onValueChange={(v) => this.setState({ radius: v })}
                  maximumValue={40}
                  minimumValue={0}
                  step={1}
                  trackStyle={{ height: 6, backgroundColor: 'transparent' }}
                  animateTransitions={true}
                  thumbStyle={{ height: 25, width: 25, backgroundColor: '#696969' }}
                  style={styles.sliderbtn}
                />
                <Text>
                  רדיוס: {this.state.radius} ק"מ ממני
                </Text>
              </View>
            </View>

            <Text></Text><Text></Text>
            <Text>תצוגת פרטים לפי:</Text>
            <View style={{ flexDirection: "row-reverse" }}>
              
              <View style={styles.switch}>
                <Text>סינון חכם</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#7DA476" }}
                  thumbColor={this.state.isEnabled1 ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={val => this.notificationChange("S")}
                  value={this.state.isEnabled1}
                />
              </View>

              <View style={styles.switch}>
                <Text>משתמשים שאהבתי</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#7DA476" }}
                  thumbColor={this.state.isEnabled2 ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={val => this.notificationChange("F")}
                  value={!this.state.isEnabled1}
                />
              </View>

            </View>
            <Text></Text>

            <View style={{ flexDirection: 'row-reverse' }}>
              <View style={styles.text}>
                <Text >סיסמה</Text>
                <TextInput
                  style={styles.input1}
                  secureTextEntry={this.state.enableSecure}
                  placeholderTextColor='#A7A7A7'
                  onChangeText={val => this.onChangeText('password', val)}
                />
              </View>
              <View style={styles.text}>
                <Text>אימות סיסמה</Text>
                <TextInput
                  style={styles.input1}
                  secureTextEntry={this.state.enableSecure}
                  placeholderTextColor='#A7A7A7'
                  onChangeText={val => this.onChangeText('password_confirm', val)}
                />
              </View>
            </View>

            {this.state.image &&
              <Image source={{ uri: this.state.image }} style={styles.profileImage} />}

            <View style={{ flexDirection: 'row-reverse' }}>
              <TouchableOpacity style={styles.galleryBtn} onPress={this.btnOpenGallery}>
                <Text style={styles.btnText}>החלפת תמונות פרופיל</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signUpBtn} onPress={this.confirmPassword}>
                <Text style={styles.btnText}>עדכון</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </ImageBackground>

    )
  }
}

const styles = StyleSheet.create({
  switch: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10

  },
  input1: {
    width: 150,
    height: 40,
    backgroundColor: 'transparent',
    margin: 3,
    padding: 5,
    color: '#414042',
    borderRadius: 14,
    fontSize: 14,
    borderRadius: 14,
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
    borderWidth: 1,
    borderColor: "#A7A7A7",
    direction: 'rtl',
    writingDirection: 'rtl',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signUpBtn: {
    width: 150,
    backgroundColor: "#9d76a5",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    marginBottom: 40,
    marginTop: 20,
  },
  logOutBtn: {
    width: 90,
    backgroundColor: "#9d76a5",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20
  },
  btnText: {
    color: "white",
    fontSize: 14,
    fontWeight: '500'
  },
  input1: {
    width: 150,
    height: 40,
    backgroundColor: 'transparent',
    margin: 3,
    padding: 5,
    color: '#414042',
    borderRadius: 14,
    fontSize: 14,
    borderRadius: 14,
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
    borderWidth: 1,
    borderColor: "#A7A7A7",
    direction: 'rtl',
    writingDirection: 'rtl',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sliderbtn: {
    alignItems: 'stretch',
    justifyContent: 'center',
    width: 150,
    margin: 5,
  },
  galleryBtn: {
    width: 150,
    backgroundColor: '#7DA476',
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    marginBottom: 40,
    marginTop: 20,
  },
  profileImage: {
    width: 70, height: 70, marginTop: 20,
  },
  btnText: {
    color: "white",
    fontSize: 14,
    fontWeight: '500'
  },
  cityUpBtn: {
    width: 150,
    backgroundColor: "#A7A7A7",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    marginBottom: 10,
    marginTop: 5,
  },
  radioBtn: {
    //flex: 1,
    alignItems: 'center'
  },
  backBtn: {
    paddingTop: 50,
    paddingLeft: 25,
    alignItems: 'flex-start'
  },
  text: {
    alignItems: 'flex-end',
    marginTop: 10
  },
  container: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 10
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },

})
