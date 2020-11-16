import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Text,TextInput,StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MapPage from './MapScreen.js';
import ProfilePage from './ProfileScreen';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import firebaseSDK from '../config/FirebaseSDK';
import RNDeviceHeading from 'react-native-device-heading'
import StoreEditorPage from './StoreEditorScreen'
import Geolocation from '@react-native-community/geolocation';
import MessengerPage from './MessengerScreen';
import * as geofirestore from 'geofirestore';
const GeoFirestore=geofirestore.initializeApp(firestore());
const Tab = createMaterialTopTabNavigator();
function MainNavigator({route, navigation}) {
  const {user}=route.params;
  const [userInfo,setUserInfo]=useState({})
  const [coordinates,setCoordinates]=useState({latitude:5,longitude:5})
  const [circleCenters,setCircleCenters]=useState([])
  const [deviceHeading,setDeviceHeading]=useState(1)
  const [watchId,setWatchId]=useState(null)
  const [myStore,setMyStore]=useState(null)
  const [storeId,setStoreId]=useState(null)
  const [postIdStore,setPostIdStore]=useState(null)
  const [chats,setChats]=useState([]);
  const [storeProfilePic,setStoreProfilePic]=useState(null)
  const [storeName,setStoreName]=useState(null)
  const [storeUnsub,setStoreUnsub]=useState(null)
  const [userUnsub,setUserUnsub]=useState(null)
  const [chatUnsub,setChatUnsub] =useState(null)
  useEffect(() => {
    getChatData()
    handleUserInfo()
    return () => {
      RNDeviceHeading.stop();
      Geolocation.clearWatch(watchId);
      if(chatUnsub!=null)
      {
        chatUnsub.chatUnsub()
      }
      if(userUnsub!=null)
      {
        userUnsub.userUnsub()
      }
      if(storeUnsub!=null){
        storeUnsub.storeUnsub()
      }
    }
  }, [])
  const mapScreenEntered=()=>{
    Geolocation.getCurrentPosition((position)=>{
      positionHandler(position)
    });
    updateSelfLocation()
  }
  const mapScreenLeft=()=>{
console.log('testingMapScreenLeft')
      RNDeviceHeading.stop();
      Geolocation.clearWatch(watchId);
  }
  const getChatData=async ()=>{
    var chatUnsubber=await firebaseSDK.getChatData((chatData)=>{
      setChats(chatData)
    },user.uid);
    setChatUnsub({'chatUnsub':chatUnsubber});
  }
  const updateSelfLocation=()=>
  {
    RNDeviceHeading.start(30, degree => {
      setDeviceHeading(degree)
    });
    var watch=Geolocation.watchPosition((position)=>
    {
      positionHandler(position)
    })
    setWatchId(watch)
  }
  const positionHandler=(position)=>
  {
    firestore().collection('Users').doc(user.uid).update({coordinates:new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
    firestore().collection('Users').doc(user.uid).update({'g.geopoint':new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
    setCoordinates({latitude:position.coords.latitude,longitude:position.coords.longitude})
    mapObjectGrabber({latitude:position.coords.latitude,longitude:position.coords.longitude})
  }
  const mapObjectGrabber=(coordinates)=>
  {
    firebaseSDK.getPosts((centerPoints)=>{
      setCircleCenters(centerPoints)
    },
    coordinates);
  }
  async function handleStore(storeReference){
    var storeUnsubber= await firebaseSDK.getSnapshotFromRefernce((documentSnapshot)=>{
      documentSnapshot.data().id=documentSnapshot.id
      setStoreId(documentSnapshot.id);setMyStore(documentSnapshot.data())
      setPostIdStore(documentSnapshot.data().postReference.id)
      setStoreName(documentSnapshot.data().storeName)
      setStoreProfilePic(documentSnapshot.data().storeProfilePic)
    },storeReference)
    setStoreUnsub({'storeUnsub':storeUnsubber});
  }
  async function handleUserInfo(){
    var userUnsubber=await firebaseSDK.getSnapshotByCollectionAndDocId(userInfoSnapshot,'Users',user.uid);
    setUserUnsub({'userUnsub':userUnsubber})
  }
  const userInfoSnapshot=(userData)=>{
    setUserInfo(userData);
    handleStore(userData.data().myStorePosts)
  }
  return (
    <Tab.Navigator headerShown={false}  swipeEnabled={false}>
    <Tab.Screen
    name="Map"
    children={()=><MapPage stopLocationHandling={mapScreenLeft} startLocationHandling={mapScreenEntered} storeProfilePic={storeProfilePic} storeName={storeName} postIdStore={postIdStore} storeId={storeId} navigation={navigation} deviceHeading={deviceHeading} coordinates={coordinates}  circleCenters={circleCenters}  uid={user.uid} />}/>
    <Tab.Screen
    name="Store Page"
    children={()=><StoreEditorPage myStore={myStore} uid={user.uid}   />}
    />
    <Tab.Screen name="Messages" children={()=><MessengerPage  storeProfilePic={storeProfilePic} storeName={storeName} uid={user.uid} chats={chats}/>}/>
    </Tab.Navigator>
  );
}
export default MainNavigator;
