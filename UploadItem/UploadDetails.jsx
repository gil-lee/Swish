import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Image, Alert } from 'react-native'
import { Picker } from '@react-native-community/picker'
import Textarea from 'react-native-textarea';
import { Dropdown } from 'react-native-material-dropdown-v2';
import Modal from 'react-native-modal';
import { Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const urlItemSize = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemSize";
const urlItemStyle = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemStyle";
const urlItemPrice = "http://proj.ruppin.ac.il/bgroup17/prod/api/ItemPrice ";
const urlConditionPrice = "http://proj.ruppin.ac.il/bgroup17/prod/api/ConditionPrices";

const typeTemp = [];
const sizeTemp = [];
const conditionTemp = [];
const styleTemp = [];

const types = [];
const conditions = [];

export default class UploadDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: '',
      description: '',
      itemType: [],
      size: [],
      condition: [],
      itemStyle: [],
      selectedType: 'חצאית',
      //לאייפון
      selectedSize: '',
      selectedCondition: '',
      selectedStyle: '',
      isModalVisable: false,
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      numberOfPoints: '',
      uplodedPicUri:'',
      
      itemType2:[],
      selectedType2:'',
    }
  }


  componentDidMount() { //פאטצים להביא את הנתונים של הרשימות הנפתחות: סוג, מידה, סגנון ומצב
    this.callFetchFunc()

  }
  callFetchFunc = () => {
    this.fetchDropDown(urlItemSize);
    this.fetchDropDown(urlItemStyle);
    this.fetchDropDown(urlItemPrice);
    this.fetchDropDown(urlConditionPrice);
  }
  onChangeText = (key, val) => { //פונקצייה שמשנה את הסטייטים
    this.setState({ [key]: val })
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
          }
          this.setState({ itemStyle: styleTemp })
        }
      },
        (error) => {
          console.log('Error', error);
        })
  }

  btnOpenGallery = async (num) => { //פתיחת הגלרייה לבחירת תמונות לפריט

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
    if (num == 1) {
      this.setState({ image1: result.uri });
      this.btnUpload(result.uri,num)
    }
    if (num == 2) {
      this.setState({ image2: result.uri });
      this.btnUpload(result.uri,num)
    }
    if (num == 3) {
      this.setState({ image3: result.uri });
      this.btnUpload(result.uri,num)
    }
    if (num == 4) {
      this.setState({ image4: result.uri });
      this.btnUpload(result.uri,num)
    }
  }

  btnUpload = (urim,num) => { //חלק 1 העלאת תמונה לשרת (לא גמור להמשיך)
    let img = urim;
    let numOfItems= this.props.route.params.user.numOfItems+1
    let imgName = this.props.route.params.user.email + '--IdItem' +numOfItems + '--Image' + num + '--' + '.jpg';
    console.log('imgName in func: ', imgName)
    //let imgName = 'userImg.jpg';
    this.imageUpload(img, imgName, num);
  };

  imageUpload = (imgUri, picName, num) => { //חלק 2 העלאת תמונה לשרת (לא גמור להמשיך)

    let uplodedPicPath = 'http://proj.ruppin.ac.il/bgroup17/prod/uploadItemUser/';
    let urlAPI = "http://proj.ruppin.ac.il/bgroup17/prod/uploadItems/";
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
          console.log('imageNameWithGUID: ', imageNameWithGUID)
          let uriNewImage= uplodedPicPath + imageNameWithGUID;
          console.log('uriNewImage', uriNewImage)
          if(num == 1){
            this.setState({image1: uriNewImage})
          }
          if(num == 2){
            this.setState({image2: uriNewImage})
          }
          if(num == 3){
            this.setState({image3: uriNewImage})
          }
          if(num == 4){
            this.setState({image4: uriNewImage})
          }
           //console.log('img uploaded successfully!', this.state.uplodedPicUri)
          
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

  confirmUpload = () => { //וידוא העלאת תמונה לשרת על ידי המשתמש

    let finalPrice;
    let price;
    let reduction;
    for (let i = 0; i < types.length; i++) {
      if (types[i].name == this.state.selectedType) {
        price = types[i].price
      }
    }
    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i].condition == this.state.selectedCondition) {
        reduction = conditions[i].reduction
      }
    }
    finalPrice = price - reduction //חישוב תמחור הפריט בנקודות לפי מצב וסוג פריט

    let item = { //יצירת פריט חדש
      name: this.state.itemName,
      size: this.state.selectedSize,
      style: this.state.selectedStyle,
      type: this.state.selectedType,
      condition: this.state.selectedCondition,
      description: this.state.description,
      image1: this.state.image1,
      image2: this.state.image2,
      image3: this.state.image3,
      image4: this.state.image4,
      numberOfPoints: finalPrice
    }
    
     if (item.name != '' && item.size != '' && item.style != '' && item.type != '' && item.condition != '' && this.state.image1 != '') {
      this.props.navigation.push('ConfirmUpload', { confirmItem: item , user: this.props.route.params.user}) //מעבר לעמוד הבא להעלאת הפריט
     }
    else {
      Alert.alert("אופס...",'חסרים פרטים על הפריט, ייתכן שהשארת שדות חובה ריקים')
    }

  }

  makePriceForItem = () => { //להוריד מלמעלה להעלאת פריט: פונקציית תמחור פריט
    let finalPrice;
    let price;
    let reduction;
    for (let i = 0; i < types.length; i++) {
      if (types[i].name == this.state.selectedType) {
        price = types[i].price
      }
    }
    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i].condition == this.state.selectedCondition) {
        reduction = conditions[i].reduction
      }
    }
    finalPrice = price - reduction
    this.setState({ numberOfPoints: finalPrice }, () => console.log('points: ', this.state.numberOfPoints), this.confirmUpload())
  }

  render() {

    return (
      <ImageBackground source={require('../assets/bgImage1.png')} style={styles.image}>
        <ScrollView>

          {/* {console.log('user from Lg in: ', this.props.route.params.user)} */}
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>העלאת פריט</Text>
          </View>
          <View style={{ height: 330, flexDirection: 'row', justifyContent: 'center' }} >

            <TouchableOpacity onPress={() => this.btnOpenGallery(1)}>
              {this.state.image1 ?
                <Image source={{ uri: this.state.image1 }} style={{ height: 330, width: 220, borderColor: '#fff', borderWidth: 2 }}></Image> :
                <Image source={require('../assets/defaultImage_.png')} style={{ height: 330, width: 220, borderColor: '#A7A7A7', borderWidth: 0.5 }}></Image>}
            </TouchableOpacity>

            <View>
              <TouchableOpacity onPress={() => this.btnOpenGallery(2)}>
                {this.state.image2 ?
                  <Image source={{ uri: this.state.image2 }} style={{ height: 110, width: 100, borderColor: '#fff', borderWidth: 2 }}></Image> :
                  <Image source={require('../assets/defaultImage_.png')} style={{ height: 110, width: 100, borderColor: '#A7A7A7', borderWidth: 0.5 }}></Image>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.btnOpenGallery(3)}>
                {this.state.image3 ?
                  <Image source={{ uri: this.state.image3 }} style={{ height: 110, width: 100, borderColor: '#fff', borderWidth: 2 }}></Image> :
                  <Image source={require('../assets/defaultImage_.png')} style={{ height: 110, width: 100, borderColor: '#A7A7A7', borderWidth: 0.5 }}></Image>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.btnOpenGallery(4)}>
                {this.state.image4 ?
                  <Image source={{ uri: this.state.image4 }} style={{ height: 110, width: 100, borderColor: '#fff', borderWidth: 2 }}></Image> :
                  <Image source={require('../assets/defaultImage_.png')} style={{ height: 110, width: 100, borderColor: '#A7A7A7', borderWidth: 0.5 }}></Image>}
              </TouchableOpacity>
            </View>

          </View>

          <View style={styles.container}>
            <Text> </Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder="* שם פריט"
              onChangeText={val => this.onChangeText('itemName', val)}
              placeholderTextColor="#414042"
            />

            <View style={{ flexDirection: 'row-reverse' }}>

              <Dropdown
                label='סוג'
                data={this.state.itemType.map((itemtype) => ({ value: itemtype }))}
                style={styles.dropDw}
                onChangeText={(value) => this.setState({ selectedType: value})}
                underlineColor={'transparent'}
              />
              <Dropdown
                label='מידה'
                data={this.state.size.map((size) => ({ value: size }))}
                style={styles.dropDw}
                onChangeText={(value) => this.setState({ selectedSize: value})}
                underlineColor={'transparent'}
              />
            </View>
            <View style={{ flexDirection: 'row-reverse' }}>
              <Dropdown
                label='סגנון'
                data={this.state.itemStyle.map((itemStyle) => ({ value: itemStyle }))}
                style={styles.dropDw}
                onChangeText={(value) => this.setState({ selectedStyle: value })}
                underlineColor={'transparent'}
              />
              <Dropdown
                label='מצב'
                data={this.state.condition.map((condition) => ({ value: condition }))}
                style={styles.dropDw}
                onChangeText={(value) => this.setState({ selectedCondition: value })}
                underlineColor={'transparent'}
              />

            </View>
            <Textarea
              containerStyle={styles.textAR}
              style={styles.textarea}
              onChangeText={val => this.onChangeText('description', val)}
              defaultValue={this.state.text}
              maxLength={120}
              placeholder={'תיאור הפריט'}
              placeholderTextColor={"#414042"}
              underlineColorAndroid={'transparent'}
            />
            <TouchableOpacity style={styles.regBtn} onPress={this.confirmUpload}>
              <Text style={styles.regText}>המשך</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  input: {
    width: 314,
    height: 50,
    backgroundColor: 'transparent',
    margin: 3,
    padding: 8,
    color: '#000',
    borderRadius: 14,
    fontSize: 14,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: "#A7A7A7",
  },
  textAR: {
    width: 314,
    height: 110,
    backgroundColor: 'transparent',
    margin: 3,
    padding: 8,
    color: '#414042',
    borderRadius: 14,
    fontSize: 14,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: "#A7A7A7",
  },
  textarea: {
    textAlignVertical: 'top',  // hack android
    height: 170,
    fontSize: 14,
    textAlign: 'right'
  },
  container: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
    //flexDirection: 'column'
  },
  Text: {
    fontSize: 14,
    fontWeight: '500'
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  dropDw: {
    width: 150,
    height: 50,
    margin: 7,
    color: '#414042',
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
    borderWidth: 1,
    borderColor: "#A7A7A7",
    fontSize: 14,
    direction: 'rtl'
  },
  backBtn: {
    paddingTop: 50,
    paddingLeft: 25,
    alignItems: 'flex-start'
  },
  regBtn: {
    width: 80,
    backgroundColor: "#9d76a5",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10
  },
  regText: {
    color: "white",
    fontSize: 14
  },
})