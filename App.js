import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignUpPage from './SignUp/SignUpPage';
import Gallery from './Gallery&Camera/Gallery';
import LogInPage from './LogIn/LogInPage';
import FeedPage from './Home/FeedPage';
import Images from './Gallery&Camera/Images';
import Navigator from './Home/Navigator';
import UploadDetails from './UploadItem/UploadDetails';
import ConfirmUpload from './UploadItem/ConfirmUpload';
import CitiesList from './SignUp/CitiesList';
import DeleteItem from './Home/DeleteItem';
import ProfilePage from './Profile/ProfilePage';
import SettingsPage from './Profile/SettingsPage';
import Chat from './Chat/Chat'
import MainChatPage from './Chat/MainChatPage'
import OtherUserProfile from './Profile/OtherUserProfile'
import currentLocation from './Location/currentLocation';
import CurrentLocFun from './Location/CurrentLocFun';
import AutoComplete from './Home/AutoComplete';
import NewChat from './Chat/NewChat';
import ZoomImages from './Gallery&Camera/ZoomImages';

const Stack = createStackNavigator();
//const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
            {/* <Stack.Navigator initialRouteName="LogIn" screenOptions={{headerShown: false}}> לכור לשנות לזה!!!!*/}

      <Stack.Navigator initialRouteName="LogIn" screenOptions={{headerShown: false}}>
        <Stack.Screen name="LogIn" component={LogInPage} />
        <Stack.Screen name="Sign Up" component={SignUpPage} />
        <Stack.Screen name="Gallery" component={Gallery} />
        <Stack.Screen name="FeedPage" component={FeedPage} />
        <Stack.Screen name="Navigator" component={Navigator} /> 
        <Stack.Screen name="ConfirmUpload" component={ConfirmUpload} />     
        <Stack.Screen name="CitiesList" component={CitiesList}/>  
        <Stack.Screen name="DeleteItem" component={DeleteItem}/> 
        <Stack.Screen name="Profile Page" component={ProfilePage}/> 
        <Stack.Screen name="SettingsPage" component={SettingsPage}/>  
        <Stack.Screen name="AutoComplete" component={AutoComplete}/> 
        <Stack.Screen name="currentLocation" component={currentLocation}/>
        <Stack.Screen name="NewChat" component={NewChat}/>
        <Stack.Screen name="ZoomImages" component={ZoomImages}/>  
        <Stack.Screen name="Main Chat Page" component={MainChatPage}/>
        <Stack.Screen name="CurrentLocFun" component={CurrentLocFun}/>
        <Stack.Screen name="Chat" component={Chat}/>  
        <Stack.Screen name="OtherUserProfile" component={OtherUserProfile}/>  
      </Stack.Navigator>
    </NavigationContainer>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
});
