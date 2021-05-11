import React, { Component } from 'react'
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

export default class currentLocation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: null,
      latitudeSt: 0,
      longitudeSt: 0,
      address: ''
    }
  }
  componentDidMount() {
    this.getCurrentLocation()
  }

  getCurrentLocation = async () => {
    let premission = await Location.getPermissionsAsync();
    console.log('prem..: ',premission)
    if (premission.status !== 'granted') {
      alert('error premission fail')
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    console.log('location..: ',location)
    let lati= location.coords.latitude
    let longi= location.coords.longitude
    let locationForRevers= [lati,longi]
    this.setState(
      { 
        location: locationForRevers, 
        latitudeSt: location.coords.latitude, 
        longitudeSt: location.coords.longitude,
        address: JSON.stringify(locationForRevers),
        newAddress: JSON.stringify(locationForRevers).substring(1,22) //goes to SQL
      }, ()=>console.log('adrress: ', this.state.address.substring(1,22))
      // , async ()=>{
      //   let reverseLoc= await Location.reverseGeocodeAsync(this.state.location)
      //   console.log('my addres: ',reverseLoc)
      // }
      )
  }


  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.findCoordinates}>
          <Text style={styles.welcome}>Find My Coords?</Text>
          {/* <Text>Location: {this.state.location}</Text> */}
          {/* <Text>Location: {this.state.address}</Text> */}
          <Text>latitude: {this.state.latitudeSt}</Text>
          <Text>longitude: {this.state.longitudeSt}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})
