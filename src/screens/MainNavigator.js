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
  const [profilePic,setProfilePic]=useState('https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg');
  const [profilePicWidth,setProfilePicWidth]=useState(150);
  const [profilePicHeight,setProfilePicHeight]=useState(150);
  const [userInfo,setUserInfo]=useState({})
  const [claimedCoupons,setClaimedCoupons]=useState([])
  const [coordinates,setCoordinates]=useState({latitude:5,longitude:5})
  const [myPosts,setMyPosts]=useState([])
  const [circleCenters,setCircleCenters]=useState([])
  const [nearbyPosts,setNearbyPosts]=useState([])
  const [activatedCoupons,setActivatedCoupons]=useState([])
  const [deviceHeading,setDeviceHeading]=useState(1);
  const [watchId,setWatchId]=useState(null)
  let postUnsub;
  let postUnsub1;
  const updateSelfLocation=()=>
  {
    RNDeviceHeading.start(10, degree => {
      setDeviceHeading(degree)
    });
    Geolocation.getCurrentPosition((position)=>
    {
    positionHandler(position)
    })
    var watch=Geolocation.watchPosition((position)=>
    {
    positionHandler(position)
    })
    setWatchId(watch)

  }
  const positionHandler=(position)=>
  {
      if(postUnsub1!=undefined)
      {
        postUnsub1()
        postUnsub1=null;
      }
      firestore().collection('Users').doc(user.uid).update({coordinates:new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
      firestore().collection('Users').doc(user.uid).update({'g.geopoint':new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
      setCoordinates({latitude:position.coords.latitude,longitude:position.coords.longitude})
      mapObjectGrabber({latitude:position.coords.latitude,longitude:position.coords.longitude})
  }
    const mapObjectGrabber=(coordinates)=>
    {
      const postgeocollection = GeoFirestore.collection('Posts');
      const postquery = postgeocollection.near({ center: new firebase.firestore.GeoPoint(coordinates.latitude,coordinates.longitude), radius: 1000000 });
      postUnsub1=postquery.onSnapshot((dog)=>{
        var centerPoints=dog.docs.map((markerInfo,index)=>{
          return {latitude:markerInfo.data().coordinates.latitude,longitude:markerInfo.data().coordinates.longitude, id:markerInfo.id,iconUrl:markerInfo.data().iconUrl}
        })
        setCircleCenters(centerPoints)
        if(dog.docs.length==0)
        {
          setCircleCenters([])
        }
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

        try{
          var userActivatedCoupons=documentSnapshot.data().activatedCoupons.map((post, index)=>{
          return {postId:post.couponId,timeStamp:post.timeStamp}
          })
          setActivatedCoupons(userActivatedCoupons)
        }
        catch{
          console.log('didntwork')
        }

      });
    }
const initializeUserInfo=()=>
{
firebaseSDK.getCurrentUserInfo().then((user)=>{setUserInfo(user);
  if(user.PPPathDb!='')
    {
    setProfilePic(user.PPPathDb)
  }
});
}
  useEffect(() => {
    updateSelfLocation()
    getUserPosts()
    initializeUserInfo()
        return () => {
          RNDeviceHeading.stop();
          Geolocation.clearWatch(watchId);
          if(postUnsub!=undefined)
          {
            postUnsub()
            postUnsub=null;
          }

          if(postUnsub1!=undefined)
          {
            postUnsub1()
            postUnsub1=null;
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
       children={()=><MapPage deviceHeading={deviceHeading} coordinates={coordinates} activatedCoupons={activatedCoupons} circleCenters={circleCenters} claimedCoupons={claimedCoupons} myPosts={myPosts} uid={user.uid} />}/>
    <Tab.Screen
    name="ProfilePage"
    children={()=><ProfilePage  claimedCoupons={claimedCoupons} myPosts={myPosts} uid={user.uid}/>}/>
    <Tab.Screen
    name="Coupon Screen"
    children={()=><CouponPage  activatedCoupons={activatedCoupons} claimedCoupons={claimedCoupons} myPosts={myPosts} uid={user.uid}/>}/>
    </Tab.Navigator>
  );
}

export default MainNavigator;
