import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Text,TextInput,StyleSheet } from 'react-native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapPage from './MapScreen.js';
import ProfilePage from './ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import firebaseSDK from '../config/FirebaseSDK';
import RNDeviceHeading from 'react-native-device-heading'
import auth from '@react-native-firebase/auth';
import StoreEditorPage from './StoreEditorScreen'
import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import MessengerPage from './MessengerScreen';
import * as geofirestore from 'geofirestore';
const GeoFirestore=geofirestore.initializeApp(firestore());
import Utility from '../config/Utility.js';
import { useFocusEffect } from '@react-navigation/native';
const Tab = createBottomTabNavigator();
function MainNavigator({route, navigation}) {
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
  const [unreadChats,setUnreadChats]=useState(0)
  const [storeUnsub,setStoreUnsub]=useState(null)
  const [userUnsub,setUserUnsub]=useState(null)
  const [chatUnsub,setChatUnsub] =useState(null)
  const [postUnsub,setPostUnsub] =useState(null)
  async function saveTokenToDatabase(token) {
  const userId = auth().currentUser.uid;
  console.log(userId)
  await firestore()
    .collection('Users')
    .doc(auth().currentUser.uid)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });
}
    useFocusEffect(
    React.useCallback(() => {
      let isSubscribed=true;
      console.log('pensi')
         messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });
    getChatData()
    if(isSubscribed){
    handleUserInfo()
      console.log(isSubscribed,'Inusbu')
    }
    return () => {
      isSubscribed=false
      console.log(isSubscribed,'isSubed')
messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });
      RNDeviceHeading.stop();
      Geolocation.clearWatch(watchId);
      console.log(chatUnsub)
      console.log(userUnsub)
      console.log(storeUnsub)
      console.log(postUnsub)
      if(!Utility.isEmpty(chatUnsub))
      {
        console.log("x")
        chatUnsub.chatUnsub()
      }
      if(!Utility.isEmpty(userUnsub))
      {

        console.log("y")
        userUnsub.userUnsub()
      }
      if(!Utility.isEmpty(storeUnsub)){

        console.log("z")
        storeUnsub.storeUnsub()
      }
      if(!Utility.isEmpty(postUnsub)){
        console.log("t")
        postUnsub.postUnsub()
      }
    }
    }, [])
  );
  const mapScreenEntered=()=>{
    Geolocation.getCurrentPosition((position)=>{
      positionHandler(position)
    });
    updateSelfLocation()
  }
  const mapScreenLeft=()=>{
      RNDeviceHeading.stop();
      Geolocation.clearWatch(watchId);
  }
  const getChatData=async ()=>{
    var chatUnsubber=await firebaseSDK.getChatData((chatData)=>{
      var urChats=0
      for(var i in chatData)
      {
        if (!chatData[i].read){
          console.log(chatData[i].read,'HELLO')
          urChats++;
        }
      }
            setUnreadChats(urChats)
      setChats(chatData)
    },auth().currentUser.uid);
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
    },()=>{},{ enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 2000,
        distanceFilter:50,
    })
    setWatchId(watch)
  }
    const signOut=()=>
    {
  setUserInfo({});
  setCircleCenters([]);
setMyStore(null);
setStoreId(null);
setPostIdStore(null);
setChats([]);
setStoreProfilePic(null);
setStoreName(null);
setUnreadChats(0);
      RNDeviceHeading.stop();
      Geolocation.clearWatch(watchId);
      console.log(chatUnsub)
      console.log(userUnsub)
      console.log(storeUnsub)
      console.log(postUnsub)
      if(!Utility.isEmpty(chatUnsub))
      {
        console.log("x")
        chatUnsub.chatUnsub()
        setChatUnsub(null);
      }
      if(!Utility.isEmpty(userUnsub))
      {

        console.log("y")
        userUnsub.userUnsub()
        setUserUnsub(null);
      }
      if(!Utility.isEmpty(storeUnsub)){

        console.log("z")
        storeUnsub.storeUnsub()
        setStoreUnsub(null);
      }
      if(!Utility.isEmpty(postUnsub)){
        console.log("t")
        postUnsub.postUnsub()
        setPostUnsub(null);
      }
      auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    }
  const positionHandler=(position)=>
  {
    firestore().collection('Users').doc(auth().currentUser.uid).update({coordinates:new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
    firestore().collection('Users').doc(auth().currentUser.uid).update({'g.geopoint':new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
    setCoordinates({latitude:position.coords.latitude,longitude:position.coords.longitude})
    mapObjectGrabber({latitude:position.coords.latitude,longitude:position.coords.longitude})
  }
  const mapObjectGrabber=async (coordinates)=>
  {
    var postUnsubber=await firebaseSDK.snapshotPosts(async(centerPoints)=>{
      setCircleCenters(centerPoints)
      return ()=>{}
    },
    coordinates);
    setPostUnsub({'postUnsub':postUnsubber});
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
    console.log(auth().currentUser.uid,'RAWWRRRRRRR');
    var userUnsubber=await firebaseSDK.getSnapshotByCollectionAndDocId(userInfoSnapshot,'Users',auth().currentUser.uid);
    setUserUnsub({'userUnsub':userUnsubber})
  }
  const userInfoSnapshot=(userData)=>{
    setUserInfo(userData);
    try{
    if(userData.data().myStorePosts!=undefined){
    handleStore(userData.data().myStorePosts)
    }
    }
    catch{

    }
  }
  return (
    <Tab.Navigator
screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Map') {
              iconName = focused
                ? 'map'
                : 'map-outline';
            } else if (route.name === 'Messages') {
              iconName=unreadChats==0? 'mail-open-outline' : 'mail-outline';
            }
            else  {
              iconName = focused ? 'pricetags' : 'pricetags-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
     headerShown={false}  swipeEnabled={false}>
    <Tab.Screen
    name="Map"
    children={()=><MapPage stopLocationHandling={mapScreenLeft} startLocationHandling={mapScreenEntered} storeProfilePic={storeProfilePic} storeName={storeName} postIdStore={postIdStore} storeId={storeId} navigation={navigation} deviceHeading={deviceHeading} coordinates={coordinates}  circleCenters={circleCenters}  uid={auth().currentUser.uid} />}/>
    <Tab.Screen
    name="Store Page"
    children={()=><StoreEditorPage myStore={myStore} uid={auth().currentUser.uid} signOut={signOut}  />}
    />
    <Tab.Screen name={'Messages' }  options={{ tabBarBadge: unreadChats }}  children={()=><MessengerPage  storeProfilePic={storeProfilePic} storeName={storeName} uid={auth().currentUser.uid} chats={chats}/>}/>
    </Tab.Navigator>
  );
}
export default MainNavigator;
