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
  let postUnsub;
  let postUnsub1;
  let storeUnsub;
  const updateSelfLocation=()=>
  {
    RNDeviceHeading.start(10, degree => {
      setDeviceHeading(degree)
    });
    var watch=Geolocation.watchPosition((position)=>
    {
      console.log(position,'MAYUSHKI')
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
    firebaseSDK.getPosts((centerPoints)=>{
      setCircleCenters(centerPoints)
    },
    coordinates);
  }
  async function handleStore(storeReference){
    console.log(storeReference);
  storeUnsub=  await firebaseSDK.getSnapshotFromRefernce((documentSnapshot)=>{
      documentSnapshot.data().id=documentSnapshot.id
      console.log(documentSnapshot.data().postReference.id,'RRRR')
setStoreId(documentSnapshot.id);setMyStore(documentSnapshot.data())
          setPostIdStore(documentSnapshot.data().postReference.id)
    },storeReference)
    }
    useEffect(()=>
  {
    if(myStore!=null)
    {
      console.log(myStore,'YYYY')
  console.log(myStore.postReference.id,'AAAAA')
}
  },[myStore])
  useEffect(() => {
    updateSelfLocation()
    firebaseSDK.getChatData((chatData)=>{
      setChats(chatData)
    },user.uid);
    firebaseSDK.getCurrentUserInfo().then((userData)=>{setUserInfo(userData);
      handleStore(userData.myStorePosts)
    });
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
      if(storeUnsub!=undefined && storeUnsub!=null){
        storeUnsub()
        console.log('SSSSSSSSSs')
        storeUnsub=null;
      }
    }
  }, [])
  return (
    <Tab.Navigator headerShown={false}  swipeEnabled={false}>
    <Tab.Screen
    name="Map"
    children={()=><MapPage postIdStore={postIdStore} storeId={storeId} navigation={navigation} deviceHeading={deviceHeading} coordinates={coordinates}  circleCenters={circleCenters}  uid={user.uid} />}/>
    <Tab.Screen
    name="Store Page"
    children={()=><StoreEditorPage storeId={storeId} myStore={myStore} uid={user.uid} postIdStore={postIdStore}/>}
    />
    <Tab.Screen name="Messages" children={()=><MessengerPage uid={user.uid} chats={chats}/>}/>
    </Tab.Navigator>
  );
}
export default MainNavigator;
