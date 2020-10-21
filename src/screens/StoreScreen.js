import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Modal, Text,TextInput,StyleSheet,ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import {DisplayName }from '../components/DisplayName.js'
import ChatScreen from './ChatScreen.js'
 import PhotoUpload from 'react-native-photo-upload'
 import ImagePicker from 'react-native-image-crop-picker';
 import StoreProfilePic from '../components/StoreProfilePic'
 import {GetUserInfo} from '../components/UserInfo.js'
 import MapPage from './MapScreen.js';
import DraggableGridComponent from '../components/DraggableGrid'
 import TabBar from "@mindinventory/react-native-tab-bar-interaction";
 import CouponContainerComponent from '../components/CouponContainerComponent';
 import ModalContainer from '../components/ModalContainer'
 import BoardPostCreator from '../components/BoardPostCreator.js'
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
function StorePage(props,{navigation}) {
  // Set an initializing state whilst Firebase connects
  const [displayName,setDisplayName]=useState('userName');
  const [profilePic,setProfilePic]=useState('https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/iconUrl%2F4xIN27RXy3bFf8kbIv6W?alt=media&token=58db0a7f-9f54-4afa-8e01-dac307774cdc');
  const [profilePicWidth,setProfilePicWidth]=useState(150);
  const [albumGrid,setAlbumGrid]=useState([]);
  const [profilePicHeight,setProfilePicHeight]=useState(150);
  const [modalVisible, setModalVisible]=useState(false);
  const [userInfo,setUserInfo]=useState({})
  const [myPosts,setMyPosts]=useState([])
  const [change,setChange]=useState(false)
  const [showSaveState,setShowSaveState]=useState(false);
  const [claimedCoupons,setClaimedCoupons]=useState([])
  const [gridData,setGridData]=useState([])
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
  const onPress= (width,height,path) => {
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
const createPost=(uid,message,media)=>
{

const savedState= gridData.map((data) => {
  return data;
  }
)
var keyLen=(savedState.length+1).toString()
  savedState.push({media:media,key:keyLen,message:message})
setGridData(savedState)
  setShowSaveState(true);
  setModalVisible(false);
 }
const cancelPressed=()=>
{
  setModalVisible(false)
}
useEffect(()=>{
})
  useEffect(() => {
    initializeUserInfo()
    console.log(props.myHome,'myhome')
    console.log(change)
  }, [])
  useEffect(() => {
    setClaimedCoupons(props.claimedCoupons)
  }, [props.claimedCoupons])
  useEffect(() => {
    setMyPosts(props.myPosts)
  }, [props.myPosts])
  return (
    <>
    <ScrollView>
    <View style={{flex:1,flexDirection:'column'}}>
         <View style={styles.bottomBorder}>
        <View style={{flex:1,marginTop:10, flexDirection:'column',alignItems:'center',}}>
        <StoreProfilePic onPress={onPress} profilePic={profilePic}/>
        </View>
        <View style={{flex:2,flexDirection:'column' }}>
        <DisplayName defaultValue={displayName} onChangeText={onChangeText}/>
         <TextInput
            style={styles.input}
            value={'profile description'}
            onChangeText={text=>{}}
            multiline={true}
            underlineColorAndroid='transparent'/>
        </View>
         </View>
    <DraggableGridComponent gridData={gridData}/>
         <Separator/>
    </View>
    </ScrollView>
          <ModalContainer modalVisible={modalVisible}>
        <BoardPostCreator uid={props.uid} createBoardPost={createPost} closeBoardPostCreatorModal={cancelPressed} mediaChanged={(media)=>{}}/>
            </ModalContainer>
<View style={{justifyContent:'center',flexDirection:'row'}}>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Add to Store </Text>
            </TouchableHighlight>

{showSaveState?   <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Save State</Text>
            </TouchableHighlight>:null}
            </View>
            </>
  );
}
export default StorePage;
/*const styles=StyleSheet.create({
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
   input: {
    width:200,
    borderBottomColor:'red',
    borderBottomWidth:1,
},
  bottomBorder:
  {
    flexDirection:'row',flex:2,}
})*/
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
