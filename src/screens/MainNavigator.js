import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Text,TextInput,StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import auth from '@react-native-firebase/auth';
import {DisplayName }from '../components/DisplayName.js'
import ChatScreen from './ChatScreen.js'
 import PhotoUpload from 'react-native-photo-upload'
 import ImagePicker from 'react-native-image-crop-picker';
 import PP from '../components/ProfilePic.js'
 import {GetUserInfo} from '../components/UserInfo.js'
 import MapPage from './MapScreen.js';
 import ProfilePage from './ProfileScreen';
 import TabBar from "@mindinventory/react-native-tab-bar-interaction";
 import storage from '@react-native-firebase/storage';
 import firestore from '@react-native-firebase/firestore';
 import firebase from '@react-native-firebase/app';
 import firebaseSDK from '../config/FirebaseSDK';
 import {
  TextField,
  FilledTextField,
  OutlinedTextField2,
} from 'react-native-material-textfield';


const Tab = createMaterialTopTabNavigator();
function MainNavigator({route, navigation}) {
  const {user}=route.params;
  // Set an initializing state whilst Firebase connects
  const [myPosts,setMyPosts]=useState([])
  const [claimedCoupons,setClaimedCoupons]=useState([])
  const [displayName,setDisplayName]=useState('darryl');
  const [profilePic,setProfilePic]=useState('https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg');
  const [profilePicWidth,setProfilePicWidth]=useState(150);
  const [profilePicHeight,setProfilePicHeight]=useState(150);
  const [userInfo,setUserInfo]=useState({})
  let postUnsub;
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

    const getUserPosts=()=>
    {
      postUnsub= firestore()
      .collection('Users')
      .doc(user.uid).onSnapshot(documentSnapshot => {
        try{
          var userPosts=documentSnapshot.data().myPosts.map((post, index)=>{
            return post._documentPath._parts[1]
          })
          setMyPosts(userPosts)
        }
        catch{}
        try{
          var userClaimedCoupons=documentSnapshot.data().claimedCoupons.map((post, index)=>{
            return(post._documentPath._parts[1])
            console.log(post,'TESTY')
          })
          console.log(userClaimedCoupons,'TESTING')
          setClaimedCoupons(userClaimedCoupons)
        }
        catch{
          console.log('didntwork')
        }

      });
    }
const onChangeText=(value)=>{
  setDisplayName(value)
}

const initializeUserInfo=()=>
{
firebaseSDK.getCurrentUserInfo().then((user)=>{setDisplayName(user.displayName);

  setUserInfo(user);
  if(user.PPPathDb!='')
    {
      console.log(user.PPPathDb)
    setProfilePic(user.PPPathDb)
  }
});
}
  useEffect(() => {
    getUserPosts()
    initializeUserInfo()
        return () => {
         if(postUnsub!=undefined)
          {
            postUnsub()
            postUnsub=null;
          }
        }
  }, [])
const signOut=()=>
{
  auth()
  .signOut()
  .then(() => console.log('User signed out!'));
}
  return (
<Tab.Navigator swipeEnabled={false}>
    <Tab.Screen
    name="Map"
       children={()=><MapPage claimedCoupons={claimedCoupons} myPosts={myPosts} uid={user.uid} />}/>
    <Tab.Screen
    name="ProfilePage"
    children={()=><ProfilePage  claimedCoupons={claimedCoupons} myPosts={myPosts} uid={user.uid}/>}/>
    </Tab.Navigator>
  );
}

export default MainNavigator;
