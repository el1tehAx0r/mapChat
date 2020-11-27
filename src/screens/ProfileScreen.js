import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Modal, Text,TextInput,StyleSheet,ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import {DisplayName }from '../components/DisplayName.js'
 import PhotoUpload from 'react-native-photo-upload'
 import ImagePicker from 'react-native-image-crop-picker';
 import PP from '../components/ProfilePic.js'
 import {GetUserInfo} from '../components/UserInfo.js'
 import MapPage from './MapScreen.js';
 import TabBar from "@mindinventory/react-native-tab-bar-interaction";
 import storage from '@react-native-firebase/storage';
 import firestore from '@react-native-firebase/firestore';
 import firebase from '@react-native-firebase/app';
 import firebaseSDK from '../config/FirebaseSDK';
 import styles from '../StyleSheet';
 import { Col, Row, Grid } from "react-native-easy-grid";
 import SingleCell from '../components/SingleCell'
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
  const [profilePic,setProfilePic]=useState('https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/iconUrl%2F4xIN27RXy3bFf8kbIv6W?alt=media&token=58db0a7f-9f54-4afa-8e01-dac307774cdc');
  const [change,setChange]=useState(false)
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
const changed=()=>{
  setChange(true)
}
const onChangeText=(value)=>{
  setDisplayName(value)
}
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
    console.log(props.myHome,'myhome')
    console.log(change)
  }, [])
const signOut=()=>
{
  auth()
  .signOut()
  .then(() => console.log('User signed out!'));
}
  return (
    <>
    <ScrollView>
    <View style={{flex:1,flexDirection:'column'}}>
         <View style={styles.bottomBorder}>
        <View style={{flex:1, flexDirection:'column'}}>
        <DisplayName defaultValue={displayName} onChangeText={onChangeText}/>
        </View>
        <View style={{flex:2,flexDirection:'column' }}>
         <TextInput
            style={styles.input}
            value={'profile description'}
            onChangeText={text=>{}}
            multiline={true}
            underlineColorAndroid='transparent'/>
{/*<Button title="signout" onPress={signOut}></Button>*/}
        </View>
         </View>
         <Separator/>
        <View style={{flex:5}}>
        </View>
    </View>
    </ScrollView>
<View style={{justifyContent:'center',flexDirection:'row'}}>
            <TouchableHighlight
              style={{ ...styles.addButton, backgroundColor: "#2196F3" }}
              onPress={()=>setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>+</Text>
            </TouchableHighlight>
            </View></>
  );
}
export default ProfilePage;
