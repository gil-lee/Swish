import React, { Component } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, ImageBackground, Alert, SafeAreaView } from "react-native";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CitiesList from './CitiesList';


const urlSignUp = "http://proj.ruppin.ac.il/bgroup17/prod/api/UserNew";
export default class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      firstName: '',
      lastName: '',
      bdate: '',
      phone_number: '',
      email: '',
      email_confirm: '',
      password: '',
      password_confirm: '',
      profilePicture: '',
      enableSecure: true,
      value_radio: 0,
      radius: 3,
      valueSlider: '',
      itemViewingMethod: 'R',
      cities: '',
      //כל הסטייטים למעלה קשורים להכנסת משתמש חדש לDB

      uri: '',
      image: null,
      uplodedPicUri: '',
      //סטייטים של הכנסת תמונה לשרת

      checkEmail: true
    }
  }

  radio_props = [ //בחירת תצוגת הפריטים למשתמש (נשתמש בהמשך)
    { label: "מיקום נוכחי ורדיוס", value: 0 },
    { label: "עיר ורדיוס", value: 1 }
  ];


  onChangeText = (key, val) => { //פונקציה דרכה משנות את הסטייטים של הוספת משתמש חדש
    this.setState({ [key]: val })

  }

  confirmEmail = () => { //אימות כתובות אימייל שהוזנו

    if (this.state.email != '' && this.state.email_confirm != '') {
      let emailAddress = this.state.email;
      let emailAddConfirm = this.state.email_confirm;
      let sign = '@';
      let dot = '.';
      let Tsign = emailAddress.includes(sign); //בדיקה שקיים הסימן @
      let Tdot = emailAddress.includes(dot); //בדיקה שקיים הסימן .

      if (Tsign && Tdot) {
        if (emailAddress != emailAddConfirm) {
          Alert.alert('אופס...', 'אימות כתובת האימייל לא צלח, נסה שנית')
        }
        else {
          this.confirmPassword()
        }
      }
      else {
        Alert.alert('אופס...', 'כתובת האימייל לא תקינה')
      }
    }
    else {
      Alert.alert('אופס...', 'כתובת האימייל לא תקינה')
    }
  }

  confirmPassword = () => { //אימות הסיסמאות שהוזנו

    if (this.state.password != '' && this.state.password_confirm != '') {
      let password = this.state.password;
      let passwordConfirm = this.state.password_confirm
      let check = this.checkAlphaNum(password); //בדיקה האם הוזנו מספרים בסיסמה (חובה להזין מספרים)
      console.log('check: ', check)
      if (check.containsNumber) {
        if (password != passwordConfirm) {
          Alert.alert('אופס...', 'אימות הסיסמה לא צלח, נסה שנית');
          return;
        }
        if(password.length < 4){
          Alert.alert("אופס..","הסיסמה צריכה להכיל לפחות 4 תוים ומספרים");
          return;
        }
        else {
          this.signUpBtn()
        }
      }
      else {
        Alert.alert('אופס...', 'הסיסמה לא תקינה, נדרשת להכיל מספרים')
      }
    }
    else {
      Alert.alert('אופס...', 'נדרש למלא את כל השדות')
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

  radioBtnValueRL = (value) => { //קביעת ערכים לצורת התצוגה של הפריטים עבור המשתמש (נשתמש בהמשך)
    this.setState({ value_radio: value })
    if (value == 0) {
      this.setState({ itemViewingMethod: 'R' })
    }
    else {
      this.setState({ itemViewingMethod: 'L' })
    }
  }

  signUpBtn = () => { //פונקציית ההרשמה, הכנסת משתמש חדש לDB   

    if (this.state.phone_number.length < 10) {
      Alert.alert("אופס..","חסרים מפרים במספר טלפון");
      return;
    }
    if(this.state.phone_number.length > 10){
      Alert.alert("אופס..","יש יותר מידי מספרים במספר הטלפון");
      return;
    }
    
    else {
      let newUser = { //יצירת משתמש חדש
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phoneNumber: this.state.phone_number,
        email: this.state.email,
        password: this.state.password,
        profilePicture: this.state.uplodedPicUri,
        residence: this.state.cities,
        radius: this.state.radius,
        birthDate: this.state.bdate,
        itemViewingMethod: this.state.itemViewingMethod,
        avatarlevel: 1,
        daliySentencld: 1
      }


      if (newUser.firstName != '' && newUser.lastName != '' && newUser.phoneNumber != '' && newUser.email != '' && newUser.password != '' && newUser.residence != '') {
        //בדיקה שכל השדות מולאו
        let checkE = '';
        fetch(urlSignUp, {
          method: 'POST',
          body: JSON.stringify(newUser),
          headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
          })
        })
          .then(res => {
            console.log('res: ', res)
            console.log('res.ok postUsers=', res.ok);
            checkE = res.ok;
            return res.json()
          })
          .then(i => {
            if (!checkE) {
              Alert.alert("אופס...", "כתובת האימייל קיימת במערכת ")
            }
            else {
              console.log("משתמש: ", newUser)
              Alert.alert("יש!", "מזל טוב על הצטרפותך ל- swish. קיבלת מאיתנו 50 נקודות מתנה למימוש :)")

              //כאן אנחנו מעבירות את המשתמש לעמודים אחרים
              this.props.navigation.navigate('Navigator', { screen: 'UploadDetails', params: { user: newUser }, initial: false })
              this.props.navigation.navigate('Navigator', { screen: 'Profile Page', params: { user: newUser }, initial: false })
              //this.props.navigation.navigate('Navigator', { screen: 'Main Chat Page', params: { user: newUser }, initial: false }) //פה זה לא מעביר עמוד רק את המידע
              this.props.navigation.navigate('Navigator', { screen: 'FeedPage', params: { user: newUser } })//מעביר עמוד ומידע ביחד
            }
          },
            (error) => {
              console.log('Error', error);
            })
      }
      else {
        Alert.alert("אופס!", 'יש למלא את כל השדות')
      }
    }
  }

  btnBack = () => { //חזרה לעמוד התחברות
    this.props.navigation.navigate('LogIn')
  }

  btnOpenGallery = async () => { //פתיחת גלריית התמונות
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
    let imgName = this.state.email + '.jpg'; //כתובת האימייל של המשתמש תהיה בכתובת התמונה
    this.imageUpload(img, imgName);
  };

  imageUpload = (imgUri, picName) => { //חלק 2 העלאת תמונה לשרת

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
          //console.log('imageNameWithGUID: ', imageNameWithGUID)
          let uriNewImage = uplodedPicPath + imageNameWithGUID;
          //console.log('uriNewImage', uriNewImage)
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
  goToCities = (city) => { //מעבר לקומפוננטת ערים
    this.setState({ cities: city })
  }
  dateStringify = (d) => {
    let date = '';
    let timest = d.nativeEvent;
    date = timest.timestamp;
    date = JSON.stringify(date)
    date = date.substring(1, 11)
    this.setState({ stringDate: date })
    this.setState({ bdate: timest.timestamp })
  }


  render() {

    return (
      <ImageBackground source={require('../assets/bgImage.png')} style={styles.image}>
        <ScrollView>

          <TouchableOpacity onPress={this.btnBack} style={styles.backBtn}>
            <Icon name="chevron-left" size={20} color="#101010" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 30 }}>הרשמה</Text>
          </View>

          <View style={styles.container}>

            <View style={{ flexDirection: 'row-reverse' }}>
              <View style={styles.text}>
                <Text >שם פרטי</Text>
                <TextInput
                  style={styles.input1}
                  autoCapitalize="none"
                  onChangeText={val => this.onChangeText('firstName', val)}
                />
              </View>
              <View style={styles.text}>
                <Text>שם משפחה</Text>
                <TextInput
                  style={styles.input1}
                  autoCapitalize="none"
                  onChangeText={val => this.onChangeText('lastName', val)}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row-reverse' }}>
              <View style={styles.text}>
                <Text>תאריך לידה</Text>
                <TouchableOpacity style={styles.input1} onPress={() => this.setState({ showDates: true })}>


                  {this.state.bdate ? null : <Text style={styles.btnText2}>בחירת תאריך</Text>}
                  {this.state.showDates &&
                    <DateTimePicker
                      testID="dateTimePicker"
                      date={this.state.bdate}
                      value={new Date()}
                      mode='date'
                      format="DD-MM-YYYY"
                      minimumDate={new Date(1950, 0, 1)}
                      maximumDate={new Date(2006, 10, 20)}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      placeholder="בחירת תאריך"
                      // icons={
                      //   <MaterialCommunityIcons
                      //     size={30}
                      //     color='#696969'
                      //     name='calendar'
                      //   />}
                      onChange={(date) => { this.dateStringify(date) }}
                      //onChange={(date) => { this.onChangeText('bdate', date.nativeEvent), console.log('native:   ', date.nativeEvent) }}
                      onChangeText={this.setState({ showDates: false })}
                    />}

                  {this.state.stringDate ?
                    <Text style={styles.btnText2}>{this.state.stringDate}</Text> : null}
                </TouchableOpacity>

              </View>
              <View style={styles.text}>
                <Text>מספר טלפון</Text>
                <TextInput
                  style={styles.input1}
                  autoCapitalize="none"
                  onChangeText={val => this.onChangeText('phone_number', val)}
                />
              </View>
            </View>
            <View style={styles.text}>
              <Text>אימייל</Text>
              <TextInput
                style={styles.input}
                placeholder='example@email.com'
                autoCapitalize="none"
                placeholderTextColor='#A7A7A7'
                onChangeText={val => this.onChangeText('email', val)}
              />

              <Text>אימות אימייל</Text>
              <TextInput
                style={styles.input}
                placeholder='example@email.com'
                autoCapitalize="none"
                placeholderTextColor='#A7A7A7'
                onChangeText={val => this.onChangeText('email_confirm', val)}
              />
            </View>
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

            <View style={styles.radioBtn}>
              <Text style={styles.text, { marginTop: 5 }}>תצוגת פריטים לפי:</Text>

              <RadioForm formHorizontal={true} animation={true} >
                {this.radio_props.map((label, value) => (
                  <View key={value} style={{ marginLeft: 30, marginRight: 30 }}>
                    <RadioButton labelHorizontal={false} key={value} >
                      <RadioButtonLabel
                        obj={label}
                        index={value}
                        labelStyle={{ fontSize: 14, color: '#101010' }}
                      />
                      <RadioButtonInput
                        obj={label}
                        index={value}
                        isSelected={this.state.value_radio === value}
                        onPress={(value) => { this.radioBtnValueRL(value) }}
                        borderWidth={1}
                        buttonColor={'#696969'}
                        buttonSize={12}
                        buttonWrapStyle={{ margin: 5 }}
                        key={value}
                      />
                    </RadioButton></View>))}
              </RadioForm>
            </View>

            <View style={{ flexDirection: 'row-reverse' }}>
              <View style={styles.text}>
                {/* //מעבר לתצוגת הערים כרשימה נפתחת */}
                <TouchableOpacity style={styles.cityUpBtn} onPress={() => this.props.navigation.push('CitiesList', { goToCities: this.goToCities })}>
                  <Text style={styles.btnText}>מקום מגורים</Text>
                </TouchableOpacity>
                {this.state.cities ?
                  <Text>
                    מקום מגורים: {this.state.cities}
                  </Text> : null}
              </View>

              <View><Text></Text><Text></Text></View>
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

            {this.state.image &&
              <Image source={{ uri: this.state.image }} style={styles.profileImage} />}

            <View style={{ flexDirection: 'row-reverse' }}>
              <TouchableOpacity style={styles.galleryBtn} onPress={this.btnOpenGallery}>
                <Text style={styles.btnText}>העלאת תמונות פרופיל</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signUpBtn} onPress={this.confirmEmail}>
                <Text style={styles.btnText}>הרשמה</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView >
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 306,
    height: 50,
    backgroundColor: 'transparent',
    margin: 3,
    padding: 8,
    color: '#414042',
    borderRadius: 14,
    fontSize: 14,
    borderRadius: 14,
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
    borderWidth: 1,
    borderColor: "#A7A7A7"
  },
  input1: {
    width: 150,
    height: 50,
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
  btnText: {
    color: "white",
    fontSize: 14,
    fontWeight: '500'
  },
  btnText2: {
    color: "#A7A7A7",
    fontSize: 14,
    fontWeight: '500',

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
  radioBtn: {
    flex: 1,
    alignItems: 'center'
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  backBtn: {
    paddingTop: 50,
    paddingLeft: 25,
    alignItems: 'flex-start'
  },
  profileImage: {
    width: 70, height: 70, marginTop: 20,
  },
  dropDw: {
    width: 150,
    height: 50,
    margin: 5,
    color: '#414042',
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
    borderWidth: 1,
    borderColor: "#A7A7A7",
    fontSize: 14,
    direction: 'rtl',
    writingDirection: 'rtl'
  },
  sliderbtn: {
    alignItems: 'stretch',
    justifyContent: 'center',
    width: 150,
    margin: 5
  },
  datap: {
    width: 150,
    height: 50,
    backgroundColor: 'transparent',
    margin: 3,
    padding: 5,
    color: '#414042',
    borderRadius: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#A7A7A7",
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
  }
})