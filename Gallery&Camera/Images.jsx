import React from 'react'
import { View, Text } from 'react-native'

export default function Images() {
    signUpBtn = () => {
        this.confirmEmail();
        this.confirmPassword();
        const urlSignUp = "http://proj.ruppin.ac.il/bgroup17/prod/api/User";
    
       const imgDB={};
    
        fetch(urlSignUp, {
          method: 'POST',
          body: JSON.stringify(imgDB),
          headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
          })
        })
          .then(res => {
            console.log('res: ', res)
            console.log('res.ok=', res.ok);
            return res.json()
          })
          .then(i => {
            alert("user added")
          },
            (error) => {
              console.log('Error', error);
            })
      }
    return (
        <View>
            <Text></Text>
        </View>
    )
}
