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
 import CouponPage from './CouponScreen';
 import TabBar from "@mindinventory/react-native-tab-bar-interaction";
 import storage from '@react-native-firebase/storage';
 import firestore from '@react-native-firebase/firestore';
 import firebase from '@react-native-firebase/app';
 import firebaseSDK from '../config/FirebaseSDK';
import RNDeviceHeading from 'react-native-device-heading'
import Geolocation from '@react-native-community/geolocation';
import * as geofirestore from 'geofirestore';
const GeoFirestore=geofirestore.initializeApp(firestore());
 import {
  TextField,
  FilledTextField,
  OutlinedTextField2,
} from 'react-native-material-textfield';
const Tab = createMaterialTopTabNavigator();
function MainNavigator({route, navigation}) {
  const {user}=route.params;
  // Set an initializing state whilst Firebase connects
  const [displayName,setDisplayName]=useState('darryl');
  const [profilePic,setProfilePic]=useState('https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg');
  const [profilePicWidth,setProfilePicWidth]=useState(150);
  const [profilePicHeight,setProfilePicHeight]=useState(150);
  const [userInfo,setUserInfo]=useState({})
  const [claimedCoupons,setClaimedCoupons]=useState([])
  const [coordinates,setCoordinates]=useState({latitude:5,longitude:5})
  const [myPosts,setMyPosts]=useState([])
  const [circleCenters,setCircleCenters]=useState([])
  const [nearbyPosts,setNearbyPosts]=useState([])
  const [deviceHeading,setDeviceHeading]=useState(1);
  let postUnsub;
  let watchId;
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

    function getUserPosts()
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
          })
          setClaimedCoupons(userClaimedCoupons)
        }
        catch{
          console.log('didntwork')
        }

      });
    }

  const updateSelfLocation=()=>
  {
    RNDeviceHeading.start(20, degree => {
      setDeviceHeading(degree)
      //   console.log(degree,"degrees rotated")
    });
    watchId=Geolocation.watchPosition((position)=>
    {
      firestore().collection('Users').doc(user.uid).update({coordinates:new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
      firestore().collection('Users').doc(user.uid).update({'g.geopoint':new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
      setCoordinates({latitude:position.coords.latitude,longitude:position.coords.longitude})
      mapObjectGrabber({latitude:position.coords.latitude,longitude:position.coords.longitude})
    },(err)=>{console.log(err)},{distanceFilter:5, enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })
  }

    const mapObjectGrabber=(coordinates)=>
    {
      const postgeocollection = GeoFirestore.collection('Posts');
      const postquery = postgeocollection.near({ center: new firebase.firestore.GeoPoint(coordinates.latitude,coordinates.longitude), radius: 1000000 });
      postUnsub=postquery.onSnapshot((dog)=>{
        var jsxPostsMarkers=[]
        var jsxPostMarkersTemp=dog.docs.map((markerInfo,index)=>{
          return {coordinates:{latitude:markerInfo.data().coordinates.latitude,longitude:markerInfo.data().coordinates.longitude},iconUrl:markerInfo.data().iconUrl}})
        var centerPoints=dog.docs.map((markerInfo,index)=>{
          return {latitude:markerInfo.data().coordinates.latitude,longitude:markerInfo.data().coordinates.longitude, id:markerInfo.id,}
        })
        setCircleCenters(centerPoints)
        jsxPostsMarkers=jsxPostMarkersTemp
        setNearbyPosts(jsxPostsMarkers)
        if(dog.docs.length==0)
        {
          setCircleCenters([])
          setNearbyPosts([])
        }
      })
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
    setProfilePic(user.PPPathDb)
  }
});
}
useEffect(()=>
{
},[myPosts])
  useEffect(() => {
    //updateSelfLocation()
    getUserPosts()
    initializeUserInfo()
        return () => {
          console.log('yaypoo')
          RNDeviceHeading.stop();
          Geolocation.clearWatch(watchId);
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
       children={()=><MapPage circleCenters={circleCenters} claimedCoupons={claimedCoupons} myPosts={myPosts} uid={user.uid} />}/>
    <Tab.Screen
    name="ProfilePage"
    children={()=><ProfilePage  claimedCoupons={claimedCoupons} myPosts={myPosts} uid={user.uid}/>}/>
    {/*<Tab.Screen
    name="Coupon Screen"
    children={()=><CouponPage claimedCoupons={claimedCoupons} myPosts={myPosts} uid={user.uid}/>}/>*/}
    </Tab.Navigator>
  );
}

export default MainNavigator;
