import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

export default function CurrentLocFun() {

  const [location, setLocation] = useState(null);
  const [latitudeSt, setLatitudeSt] = useState(null);
  const [longitudeSt, setLongitudeSt] = useState(null);
  const [newAddress, setNewAddress] = useState();

  useEffect(() => {
    async function getCurrentLocation() {
      let premission = await Location.getPermissionsAsync();
      console.log('prem..: ', premission)
      if (premission.status !== 'granted') {
        alert('error premission fail')
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log('location..: ', location)
      let lati = location.coords.latitude
      let longi = location.coords.longitude
      let locationForRevers = [lati, longi]

      setLocation(locationForRevers)
      setLatitudeSt(location.coords.latitude)
      setLongitudeSt(location.coords.longitude)
      // address: JSON.stringify(locationForRevers),
      setNewAddress(JSON.stringify(locationForRevers).substring(1, 22)) //goes to SQL
      console.log("im here!!!! ", newAddress)
      // , async ()=>{
      //   let reverseLoc= await Location.reverseGeocodeAsync(this.state.location)
      //   console.log('my addres: ',reverseLoc)
      // }
      return newAddress;
    }
  })

  return (
    <View>
      <Text></Text>
    </View>
  )
}
