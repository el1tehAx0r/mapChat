import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Text,TextInput,StyleSheet } from 'react-native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapPage from './MapScreen.js';
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
//this Method is the main method of our post-loginProgram. We lift up state here.
function MainNavigator({route, navigation}) {
  //Setting state for everything here
  const [userInfo,setUserInfo]=useState({})
  const [coordinates,setCoordinates]=useState({latitude:5,longitude:5})
  const [circleCenters,setCircleCenters]=useState([])
  const [deviceHeading,setDeviceHeading]=useState(1)
  const [watchId,setWatchId]=useState(null)
  const [myStore,setMyStore]=useState(null)
  const [chats,setChats]=useState([]);
  const [unreadChats,setUnreadChats]=useState(0)
  const [storeUnsub,setStoreUnsub]=useState(null)
  const [userUnsub,setUserUnsub]=useState(null)
  const [chatUnsub,setChatUnsub] =useState(null)
  const [postUnsub,setPostUnsub] =useState(null)

  //Getting Notification tokens
  async function saveTokenToDatabase(token) {
  await firestore()
    .collection('Users')
    .doc(auth().currentUser.uid)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });
}

//function to Unsub enmass for all listeners
const massUnsub=()=>{
      RNDeviceHeading.stop();
      Geolocation.clearWatch(watchId);
      if(!Utility.isEmpty(chatUnsub))
      {
        chatUnsub.chatUnsub()
        setChatUnsub(null);
      }
      if(!Utility.isEmpty(userUnsub))
      {
        userUnsub.userUnsub()
        setUserUnsub(null);
      }
      if(!Utility.isEmpty(storeUnsub)){
        storeUnsub.storeUnsub()
        setStoreUnsub(null);
      }
      if(!Utility.isEmpty(postUnsub)){
        postUnsub.postUnsub()
        setPostUnsub(null);
      }
}

//When MainNavigator stack is entered and left
    useFocusEffect(
      React.useCallback(() => {
        let isSubscribed = true;
        messaging()
          .getToken()
          .then(token => {
            return saveTokenToDatabase(token);
          });
        if (isSubscribed) {
          getChatData()
          handleUserInfo()
        }
        return () => {
          isSubscribed = false
          messaging().onTokenRefresh(token => {
            saveTokenToDatabase(token);
          });
          massUnsub();
        }
      }, [])

    //Lift up state method for when MapTabIsOpen
    );  const mapScreenEntered=()=>{
      //we first call get the geolocaion on first call because on snapshot waits for a change so we need to initialize
    Geolocation.getCurrentPosition((position)=>{
      positionHandler(position)
    });
    //update self lcoation contains the snapshot method
    updateSelfLocation()
  }

    //Lift up state method for when MapTabIsClosed for navigation purposes
  const mapScreenLeft=()=>{
      RNDeviceHeading.stop();
      Geolocation.clearWatch(watchId);
  }

//Gets the Chats you are in using a snapshotListner with firebaseSDK helper
  const getChatData=async ()=>{
    var chatUnsubber=await firebaseSDK.getChatData((chatData)=>{
      var urChats=0
      for(var i in chatData)
      {
        if (!chatData[i].read){
          urChats++;
        }
      }
      //anyUnreadChats?
      setUnreadChats(urChats)
      setChats(chatData)
    },auth().currentUser.uid);
    //unsubscriber method
    setChatUnsub({'chatUnsub':chatUnsubber});
  }

//method to update the location of yourself
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

//sign OUt method unsubscribe and set all info to zero
    const signOut=()=>
    {
  setUserInfo({});
  setCircleCenters([]);
setMyStore(null);
setChats([]);
setUnreadChats(0);
massUnsub()
      auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    }

//takes the geolocation info from snapshot and get and updates user state positions
  const positionHandler=(position)=>
  {
    firestore().collection('Users').doc(auth().currentUser.uid).update({coordinates:new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
    firestore().collection('Users').doc(auth().currentUser.uid).update({'g.geopoint':new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
    setCoordinates({latitude:position.coords.latitude,longitude:position.coords.longitude})
    mapObjectGrabber({latitude:position.coords.latitude,longitude:position.coords.longitude})
  }


//updates the map
  const mapObjectGrabber=async (coordinates)=>
  {
    if(setPostUnsub!=null)
    {
if(!Utility.isEmpty(userUnsub)){

        postUnsub.postUnsub()
}
    }
    var postUnsubber=await firebaseSDK.snapshotPosts(async(centerPoints)=>{
      setCircleCenters(centerPoints)
    },
    coordinates);
    setPostUnsub({'postUnsub':postUnsubber});
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
  //updates user store information
  async function handleStore(storeReference){
    var storeUnsubber= await firebaseSDK.getSnapshotFromRefernce((documentSnapshot)=>{
      documentSnapshot.data().id=documentSnapshot.id
      setMyStore(documentSnapshot.data())
    },storeReference)
    setStoreUnsub({'storeUnsub':storeUnsubber});
  }

  //method to handle user account info
  async function handleUserInfo(){
    var userUnsubber=await firebaseSDK.getSnapshotByCollectionAndDocId(userInfoSnapshot,'Users',auth().currentUser.uid);
    setUserUnsub({'userUnsub':userUnsubber})
  }

const screenOptions=({ route }) => ({
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
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })
  return (
    <Tab.Navigator
screenOptions={screenOptions}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
     headerShown={false}  swipeEnabled={false}>
    <Tab.Screen
    name="Map"
    children={()=><MapPage stopLocationHandling={mapScreenLeft} startLocationHandling={mapScreenEntered}  postIdStore={myStore?myStore.postReference.id:null}  navigation={navigation} deviceHeading={deviceHeading} coordinates={coordinates}  circleCenters={circleCenters}  uid={auth().currentUser.uid} />}/>
    <Tab.Screen
    name="Store Page"
    children={()=><StoreEditorPage myStore={myStore} uid={auth().currentUser.uid} signOut={signOut}  />}
    />
    <Tab.Screen name={'Messages' }  options={{ tabBarBadge: unreadChats }}  children={()=><MessengerPage uid={auth().currentUser.uid} chats={chats}/>}/>
    </Tab.Navigator>
  );
}
export default MainNavigator;
