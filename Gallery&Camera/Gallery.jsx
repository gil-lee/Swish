import React, { Component } from 'react'
import { Text, View, Image, Button, Icon } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import SignUpPage from '../SignUp/SignUpPage';

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null
    }
  }

  componentDidMount() {
    this.btnOpenGallery()
  }

  btnOpenGallery = async () => {
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
    this.setState({ image: result.uri },
      () => { console.log(this.state.image); });
  }

  render() {
    //let {image}= this.state;
    return (
      <View>
        {/* <SignUpPage imageUri= {this.state.image}/> */}
        <Button title='אישור' style={{ backgroundColor: '#ff5e5b', margin: 'auto', padding: 10 }}
          onPress={() => { this.props.navigation.navigate('UploadDetails', { uri: this.state.image }) }}>
        </Button>
        {this.state.image &&
          <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200, margin: 'auto' }} />}

      </View>
    )
  }
}
