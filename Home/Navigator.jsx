import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedPage from './FeedPage';
import SignUpPage from '../SignUp/SignUpPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Images from '../Gallery&Camera/Images';
import Gallery from '../Gallery&Camera/Gallery';
import LogInPage from '../LogIn/LogInPage';
import UploadDetails from '../UploadItem/UploadDetails';
import FavoritePage from '../Favorite/FavoritePage';
import MainChatPage from '../Chat/MainChatPage';
import ProfilePage from '../Profile/ProfilePage';

const Tab = createBottomTabNavigator();

export default class Navigator extends Component {

  //תפריט הניווט בתחתית העמודים
  render() {
    return (
      <Tab.Navigator initialRouteName="FeedPage" tabBarOptions={{
        activeTintColor: '#9d76a5', showLabel: false, inactiveTintColor: '#414042'
      }}>
        <Tab.Screen name="FeedPage" component={FeedPage} options={{
          tabBarLabel: 'Home', tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />),
        }} />
        <Tab.Screen name="Favorite" component={FavoritePage} options={{
          tabBarLabel: 'Favorite', tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart" color={color} size={26} />),
        }} />
        <Tab.Screen name="UploadDetails" component={UploadDetails} options={{
          tabBarLabel: 'Upload', tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="upload" color={color} size={26} />),
        }} />
        <Tab.Screen name="Main Chat Page" component={MainChatPage} options={{
          tabBarLabel: 'Chat', tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat" color={color} size={26} />),
        }} />
        <Tab.Screen name="Profile Page" component={ProfilePage} options={{
          tabBarLabel: 'Profile', tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />),
        }} />
      </Tab.Navigator>
    )
  }
}
