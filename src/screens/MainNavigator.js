import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Text,TextInput,StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import auth from '@react-native-firebase/auth';
 import MapPage from './MapScreen.js';
 import ProfilePage from './ProfileScreen';
 import CouponPage from './CouponScreen';
 import firestore from '@react-native-firebase/firestore';
 import firebase from '@react-native-firebase/app';
 import firebaseSDK from '../config/FirebaseSDK';
import RNDeviceHeading from 'react-native-device-heading'
import StoreEditorPage from './StoreEditorScreen'
import CouponManager from './CouponManagerScreen'
import Geolocation from '@react-native-community/geolocation';
import MessengerPage from './MessengerScreen';
import * as geofirestore from 'geofirestore';
const GeoFirestore=geofirestore.initializeApp(firestore());
const Tab = createMaterialTopTabNavigator();
function MainNavigator({route, navigation}) {
  const {user}=route.params;
  const [userInfo,setUserInfo]=useState({})
  const [claimedCoupons,setClaimedCoupons]=useState([])
  const [myCreatedCoupons,setMyCreatedCoupons]=useState([])
  const [coordinates,setCoordinates]=useState({latitude:5,longitude:5})
  const [myPosts,setMyPosts]=useState([])
  const [circleCenters,setCircleCenters]=useState([])
  const [activatedCoupons,setActivatedCoupons]=useState([])
  const [deviceHeading,setDeviceHeading]=useState(1)
  const [watchId,setWatchId]=useState(null)
  const [myStore,setMyStore]=useState(null)
  const [myCoupons,setMyCoupons]=useState([])
  const [myCouponPosts,setMyCouponPosts]=useState([])
  const [storeId,setStoreId]=useState(null)
  const [postIdStore,setPostIdStore]=useState(null)
  const [chats,setChats]=useState([]);
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
          if (userClaimedCoupons!=undefined){
          setClaimedCoupons(userClaimedCoupons)
          }
          else{
            setClaimedCoupons([])
          }
        }
        catch{
        }
        try{
          var couponPosts=documentSnapshot.data().myCouponPosts.map((post, index)=>{
            return(post._documentPath._parts[1])
          })
          setMyCouponPosts(couponPosts)
        }
        catch{
        }

        try{
          var userActivatedCoupons=documentSnapshot.data().activatedCoupons.map((post, index)=>{
          return {postId:post.couponId,timeStamp:post.timeStamp}
          })
          setActivatedCoupons(userActivatedCoupons)
        }
        catch{
        }
        try{
          var userStore=documentSnapshot.data().myStorePosts.get().then((documentSnapshot)=>{setStoreId(documentSnapshot.id);setMyStore(documentSnapshot.data())
setPostIdStore(documentSnapshot.data().postReference.id)
        })
        }
        catch{
        }
      });
    }
const initializeUserInfo=()=>
{
firebaseSDK.getCurrentUserInfo().then((user)=>{setUserInfo(user);
});
}
  useEffect(() => {
    firebaseSDK.getChatData((chatData)=>{
      setChats(chatData)
    },user.uid)
    updateSelfLocation()
    getUserPosts()
    initializeUserInfo()
        return () => {
          firebaseSDK.unsubChat()
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
  return (
<Tab.Navigator headerShown={false}  swipeEnabled={false}>
    <Tab.Screen
    name="Map"
       children={()=><MapPage postIdStore={postIdStore} storeId={storeId} navigation={navigation} deviceHeading={deviceHeading} coordinates={coordinates} activatedCoupons={activatedCoupons} circleCenters={circleCenters} claimedCoupons={claimedCoupons} myPosts={myPosts} uid={user.uid} />}/>
    <Tab.Screen
    name="Store Page"
    children={()=><StoreEditorPage storeId={storeId} myStore={myStore} uid={user.uid} postIdStore={postIdStore}/>}
    />
    <Tab.Screen name="Messages" children={()=><MessengerPage uid={user.uid} chats={chats}/>}/>
    </Tab.Navigator>
  );
}
export default MainNavigator;
