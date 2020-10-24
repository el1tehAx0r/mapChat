import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Modal, Text,TextInput,StyleSheet,ScrollView,TouchableOpacity,ImageBackground } from 'react-native';
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
 import { Col, Row, Grid } from "react-native-easy-grid";
 import SingleCell from '../components/SingleCell'
import VideoPlayer from 'react-native-video-player';
import { DraggableGrid } from 'react-native-draggable-grid';
import styles,{draggableGridStyles} from '../StyleSheet'
import { Ionicons } from 'react-native-vector-icons/Ionicons';
import RedXButton from '../components/RedXButton'
 import {
  TextField,
  FilledTextField,
  OutlinedTextField2,
} from 'react-native-material-textfield';
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
  const [editMode,setEditMode]=useState(false);
  const [claimedCoupons,setClaimedCoupons]=useState([])
  const [oldGridData,setOldGridData]=useState([])
  const [showSave,setShowSave]=useState(false)
  const [gridData,setGridData]=useState([]);
  const [storeId,setStoreId]=useState(props.storeId);
class MyListItem extends React.PureComponent {
  render() {
    return (
          <View
     style={{
              borderRadius: 5,
       width: styles.width/5,
       height: styles.height/5}}
              >
{this.props.media.mime=="image/jpeg"||this.props.media.mime=="image/png"?
<ImageBackground
     style={{
       width: styles.width/5,
       height: styles.height/5}}
     resizeMode='cover'
     source={{
       uri:this.props.media.path}}
>
</ImageBackground>
   :
   <View pointerEvents="none">
          <VideoPlayer

    repeat
    videoHeight={styles.height/.3}
 ref={this.videoRef}
    video={{ uri:this.props.media.path  }}
    autoplay={true}
/>

</View>
}

          </View>
    )
  }
}
const render_item=(item:{media:object, key:string,message:string}) =>{
    return (
<View
        key={item.key}
      >
{editMode?
    <View >
    <RedXButton  code={item.key} redXPressed={redXPressed} />
    </View>:null
  }
      <MyListItem media={item.media}/>
        <Text>{item.message}</Text>
      </View>
    );
  }
  function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
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
  const redXPressed=(key)=>{
var condensedArray=deleteDataByKey(key)
setShowSave(true)
setGridData(condensedArray)
  }
  const deleteDataByKey=(key)=>{
var condensedGridData= gridData.filter(function(obj) {
    return obj.key!== key;
});
return condensedGridData;
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

const createPost=(uid,message,media)=>
{
const savedState= gridData.map((data) => {
  return data;
  }
)
var key=makeid(5)
  savedState.push({media:media,key:key,message:message})
setGridData(savedState)
  setShowSave(true);
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
    if (props.myStore!=null){
      if (props.myStore!=null){
      setOldGridData(props.myStore.gridData);
    }
    else{
      setOldGridData([])
    }
    }
  }, [props.myStore])
  useEffect(() => {
      setStoreId(props.storeId)
  }, [props.storeId])
  useEffect(() => {
    setClaimedCoupons(props.claimedCoupons)
  }, [props.claimedCoupons])
  useEffect(() => {
    setMyPosts(props.myPosts)
  }, [props.myPosts])
  useEffect(()=>{
    if(!shallowCompare(gridData,oldGridData)){
      console.log(gridData)
      console.log(oldGridData,'AZEEWWEZEN')
    resetState()
  }
  },[oldGridData])
  function shallowCompare(newObj, prevObj){
    for (var key in newObj){
        if(newObj[key] !== prevObj[key]) return true;
    }
    return false;
}
    const setStore=()=>
    {
var gridDataCopy= [...gridData];
setOldGridData(gridDataCopy);
firebaseSDK.setStore(props.uid,storeId,gridData);
    }
  var resetState=()=>
  {
  setShowSave(false);setEditMode(false);
  setGridData(oldGridData)
  }
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
      <View style={draggableGridStyles.wrapper}>
        <DraggableGrid
        itemHeight={styles.height/4}
          numColumns={4}
          renderItem={render_item}
          data={gridData}
          onDragRelease={(data) => {
            setGridData(data);// need reset the props data sort after drag release
          }}
        />
      </View>
         <Separator/>
    </View>
    </ScrollView>
          <ModalContainer modalVisible={modalVisible}>
        <BoardPostCreator uid={props.uid} createBoardPost={createPost} closeBoardPostCreatorModal={cancelPressed} mediaChanged={(media)=>{}}/>
            </ModalContainer>
<View style={{justifyContent:'center',flexDirection:'row'}}>

{
   (() => {
       if (!editMode){
          return             <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>{setEditMode(!editMode)}}>
              <Text style={styles.textStyle}>EDIT STORE</Text>
            </TouchableHighlight>}
        else {
          if (showSave)
          {
            return(
  <>
   <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Add to Store </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>{setStore()}}>
              <Text style={styles.textStyle}>Save State</Text>
            </TouchableHighlight>
    <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>{resetState()}}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            </>

          )
          }
          else{
            return(
<><TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Add to Store </Text>
            </TouchableHighlight>
    <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>resetState()}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight></>
          )
          }
        }
   })()
}
            </View>
            </>
  );
}
export default StorePage;
