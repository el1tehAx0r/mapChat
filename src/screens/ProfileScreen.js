import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Modal, Text,TextInput,StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import {DisplayName }from '../components/DisplayName.js'
import ChatScreen from './ChatScreen.js'
 import PhotoUpload from 'react-native-photo-upload'
 import ImagePicker from 'react-native-image-crop-picker';
 import PP from '../components/ProfilePic.js'
 import {GetUserInfo} from '../components/UserInfo.js'
 import MapPage from './MapScreen.js';
 import TabBar from "@mindinventory/react-native-tab-bar-interaction";
 import CouponContainerComponent from '../components/CouponContainerComponent';
 import HomeCreator from '../components/HomeCreator';
 import storage from '@react-native-firebase/storage';
 import firestore from '@react-native-firebase/firestore';
 import firebase from '@react-native-firebase/app';
 import firebaseSDK from '../config/FirebaseSDK';
 import { Col, Row, Grid } from "react-native-easy-grid";
 import {
  TextField,
  FilledTextField,
  OutlinedTextField2,
} from 'react-native-material-textfield';
import Geolocation from '@react-native-community/geolocation';

const Separator = () => (
  <View style={styles.separator} />
);
//Geolocation.getCurrentPosition(info => console.log(info));
function ProfilePage(props,{navigation}) {
  // Set an initializing state whilst Firebase connects
  const [displayName,setDisplayName]=useState('userName');
  const [profilePic,setProfilePic]=useState('https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d');
  const [profilePicWidth,setProfilePicWidth]=useState(150);
  const [profilePicHeight,setProfilePicHeight]=useState(150);
  const [userInfo,setUserInfo]=useState({})
  const [myPosts,setMyPosts]=useState([])
  const [claimedCoupons,setClaimedCoupons]=useState([])
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
      console.log("You can use the cfamera");
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
  var remotePath='profilePics/'+displayName
  var localPath=path
  var collectionName='Users'
  var documentName=auth().currentUser.uid
  var field='photoURL'
firebaseSDK.addToStorage(remotePath,localPath,collectionName,documentName,field).then((url)=>
{
  setProfilePic(url)
})
  }

const onChangeText=(value)=>{
  setDisplayName(value)
}
/*const couponGrabber= async ()=>
{
             const subscriber = firestore()
      .collection('Users')
      .doc(props.uid).onSnapshot(documentSnapshot => {
        try{
        var userPosts=documentSnapshot.data().myPosts.map((post, index)=>{
       return post._document._documentPath._parts[1];
      })
setMyCoupons(userPosts)
    }
    catch{//log('didntwork')
  setMyCoupons([])}
    try{
        var userClaimedCoupons=documentSnapshot.data().claimedCoupons.map(async (post, index)=>{
       return post._document._documentPath._parts[1]
        })
        setClaimedCoupons(userClaimedCoupons)
      }
      catch{
        setClaimedCoupons([])
        //console.log('didntwork')
      }

      });
}*/
const initializeUserInfo=()=>
{
firebaseSDK.getCurrentUserInfo().then((user)=>{setDisplayName(user.displayName);

  setUserInfo(user);
  if(user.photoURL!='')
    {
    setProfilePic(user.photoURL)
  }
});
}
useEffect(()=>{
})
  useEffect(() => {
    initializeUserInfo()
  }, [])

  useEffect(() => {
    setClaimedCoupons(props.claimedCoupons)
  }, [props.claimedCoupons])

  useEffect(() => {
    setMyPosts(props.myPosts)
  }, [props.myPosts])
const signOut=()=>
{
  auth()
  .signOut()
  .then(() => console.log('User signed out!'));
}
  return (
    <View style={{flex:1,flexDirection:'column'}}>
         <View style={styles.bottomBorder}>
        <View style={{flex:3, justifyContent:'center',alignItems:'center'}}>
        <PP onPPClicked={onPPPress} PPPath={profilePic}/>
        </View>
        <View style={{flex:2, }}>
<Button title="signout" onPress={signOut}></Button>
        <DisplayName defaultValue={displayName} onChangeText={onChangeText}/>
        </View>
         </View>
         <Separator/>
        <View style={{flex:5}}>
        <HomeCreator/>
        </View>


    </View>
  );
}

export default ProfilePage;
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
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bottomBorder:
  {
    flexDirection:'row',flex:2,}
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
