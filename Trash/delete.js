import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Text,TextInput,StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import {DisplayName }from '../components/DisplayName.js'
import ChatScreen from './ChatScreen.js'
 import PhotoUpload from 'react-native-photo-upload'
 import ImagePicker from 'react-native-image-crop-picker';
 import ProfilePage from './ProfileScreen'
 import PP from '../components/ProfilePic.js'
 import {GetUserInfo} from '../components/UserInfo.js'
 import MapPage from './MapScreen.js';
 import TabBar from "@mindinventory/react-native-tab-bar-interaction";
 import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
 import storage from '@react-native-firebase/storage';
 import firestore from '@react-native-firebase/firestore';
 import firebase from '@react-native-firebase/app';
 import firebaseSDK from '../config/FirebaseSDK';
 import {
  TextField,
  FilledTextField,
  OutlinedTextField2,
} from 'react-native-material-textfield';
import Geolocation from '@react-native-community/geolocation';
const Tab=createMaterialTopTabNavigator();
Geolocation.getCurrentPosition(info => console.log(info));
function MainNavigator({navigation}) {
  // Set an initializing state whilst Firebase connects
  const [displayName,setDisplayName]=useState('darryl');
  const [profilePic,setProfilePic]=useState('https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg');
  const [profilePicWidth,setProfilePicWidth]=useState(150);
  const [profilePicHeight,setProfilePicHeight]=useState(150);
  const [userInfo,setUserInfo]=useState({})
  const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};
  const onPPPress = (width,height,path) => {
  setProfilePicWidth(width);
  setProfilePicHeight(height);
  const reference=storage().ref('profilePics/'+displayName)
    reference.putFile(path).then((path)=>{console.log(path)
 storage()
  .ref('profilePics/'+displayName)
  .getDownloadURL().then((url)=>{setProfilePic(url)
  firestore().collection('Users')
  .doc(auth().currentUser.uid)
  .update({
    PPPathDb:url,
  })
  .then(() => {
    console.log('User updated!');
  }).catch((err)=>
{
  console.log(err)
});}
);
    })
  }

const onChangeText=(value)=>{
  setDisplayName(value)
}

const initializeUserInfo=()=>
{
firebaseSDK.getCurrentUserInfo().then((user)=>{setDisplayName(user.DisplayName);

  setUserInfo(user);
    console.log('aaaaaaaaaaa',user)
  if(user.PPPathDb!='')
    {
      console.log(user.PPPathDb)
    setProfilePic(user.PPPathDb)
  }
});
}
  useEffect(() => {
    initializeUserInfo()
  }, [])
const signOut=()=>
{
  auth()
  .signOut()
  .then(() => console.log('User signed out!'));
}
  return (
 <Tab.Navigator>
      <Tab.Screen name="Map" component={MapPage} />
    </Tab.Navigator>
  );
}

export default MainNavigator;
const styles=StyleSheet.create({
  container: {
   ...StyleSheet.absoluteFillObject,
   height: 400,
   width: 400,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
  bottomBorder:
  {
    flexDirection:'row',flex:2,
    borderBottomColor:'black',
    borderBottomWidth:1  }
})
/*const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});*/
