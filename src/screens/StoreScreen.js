import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Modal, Text,TextInput,StyleSheet,ScrollView,TouchableOpacity,ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';
import {DisplayName }from '../components/DisplayName.js'
import ChatScreen from './ChatScreen.js'
import ImagePicker from 'react-native-image-crop-picker';
import StoreProfilePic from '../components/StoreProfilePic'
import {GetUserInfo} from '../components/UserInfo.js'
import Utility from '../config/Utility'
import DraggableGridComponent from '../components/DraggableGrid'
import ModalContainer from '../components/ModalContainer'
import BoardPostCreator from '../components/BoardPostCreator.js'
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import firebaseSDK from '../config/FirebaseSDK';
import { Col, Row, Grid } from "react-native-easy-grid";
import VideoPlayer from 'react-native-video-player';
import { DraggableGrid } from 'react-native-draggable-grid';
import styles,{draggableGridStyles} from '../StyleSheet'
import { Ionicons } from 'react-native-vector-icons/Ionicons';
import RedXButton from '../components/RedXButton'
import EditButtonSet from '../components/EditButtonSet'
import {
  TextField,
  FilledTextField,
  OutlinedTextField2,
} from 'react-native-material-textfield';
function StorePage(props,{navigation}) {
  const [modalVisible, setModalVisible]=useState(false);
  const [change,setChange]=useState(false)
  const [editMode,setEditMode]=useState(false);
  const [oldGridData,setOldGridData]=useState([])
  const [showSave,setShowSave]=useState(false)
  const [gridData,setGridData]=useState([]);
  const [storeProfilePic,setStoreProfilePic]=useState('https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fimages.png?alt=media&token=0f82c0e3-eb6c-43f6-8e58-6c274d310f42');
  const [oldStoreProfilePic,setOldStoreProfilePic]=useState('https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fimages.png?alt=media&token=0f82c0e3-eb6c-43f6-8e58-6c274d310f42');
  const [storeName,setStoreName]=useState('Add Store Name');
  const [oldStoreName,setOldStoreName]=useState('Add Description');
  const [storeDescription,setStoreDescription]=useState('Add Description');
  const [oldStoreDescription,setOldStoreDescription]=useState('Add Store Name')
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
              uri:this.props.media.path}}>
              </ImageBackground>
              :
              <View pointerEvents="none">
              <VideoPlayer
              repeat
              videoHeight={styles.height/.3}
              ref={this.videoRef}
              video={{ uri:this.props.media.path}}
              autoplay={true}
              />
              </View>}
            </View>)}}
      const render_item=(item:{media:object, key:string,message:string}) =>{
        return (
          <View
          key={item.key}
          >
          {editMode?
            <View >
            <RedXButton code={item.key} redXPressed={redXPressed} />
            </View>:null
          }
          <MyListItem media={item.media}/>

          <TextInput
          editable={false}
          style={{ height: 35,fontSize:12, width:styles.width/5, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Title+"
          defaultValue={item.message}
          />

          <TextInput
          editable={false}
          style={{ height: 35,fontSize:12, width:styles.width/5, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Title+"
          defaultValue={item.message}
          />
          </View>
        );
      }
      function checkDifferent(){
        var newStates=[storeProfilePic,storeDescription,storeName,gridData]
        var oldStates=[oldStoreProfilePic,oldStoreDescription,oldStoreName,oldGridData]
        for (var i in newStates)
        {var oldObj=oldStates[i]; var newObj=newStates[i];
          try {
            if (JSON.stringify(oldObj)!=JSON.stringify(newObj)){
              setShowSave(true)
              return
            }
          }
          catch{
            if(oldObj!=newObj)
            {

              setShowSave(true)
              return
            }
          }

        }
        setShowSave(false)
      }
      const onPress= (width,height,path) => {
        setStoreProfilePic(path)
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

      const createPost=(uid,message,media)=>
      {
        const savedState= gridData.map((data) => {
          return data;
        }
      )
      var key=Utility.makeid(5)
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
    }, [])
    useEffect(() => {
      if (props.myStore!=null){
        setOldGridData(props.myStore.gridData);
        setOldStoreProfilePic(props.myStore.storeProfilePic)
        setOldStoreName(props.myStore.storeName)
        setOldStoreDescription(props.myStore.storeDescription)
      }
      else{
        setOldGridData([])
      }
    }, [props.myStore])
    useEffect(()=>{
      if(!shallowCompare(gridData,oldGridData)){
        resetState()
      }
    },[oldGridData])
    useEffect(()=>
    {
      checkDifferent()
    },[storeProfilePic,storeDescription,gridData,storeName])
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
      setOldStoreName(storeName);
      setOldStoreProfilePic(storeProfilePic);
      setOldStoreDescription(storeDescription);
      var remotePath='iconUrl/'+props.myStore.id
      var localPath=storeProfilePic.toString()
      if(!storeProfilePic.includes('firebasestorage.googleapis.com')){
        firebaseSDK.addtoStorageNoDbUpdate(remotePath,localPath).then((storeProfilePicFirebase)=>
        {
          firebaseSDK.setStore(props.uid,props.myStore.id,props.myStore.postReference.id,gridData,storeProfilePicFirebase,storeDescription,storeName).then();
        })
      }
      else{
        firebaseSDK.setStore(props.uid,props.myStore.id,props.myStore.postReference.id,gridData,storeProfilePic,storeDescription,storeName).then();
      }
    }

    var resetState=()=>
    {
      setShowSave(false);setEditMode(false);
      setGridData(oldGridData);
      setStoreDescription(oldStoreDescription);
      setStoreName(oldStoreName);
      setStoreProfilePic(oldStoreProfilePic);
    }
    return (
      <>
      <ScrollView style={{
         borderTopWidth:0.5, borderLeftWidth:0.5, borderRightWidth:0.5}} >
      <View style={{flex:1,flexDirection:'column',padding:10,paddingBottom:20,paddingTop:3}}>
      <View style={{...styles.bottomBorder,marginBottom:25}}>
      <View style={{flex:1,marginTop:"8%", flexDirection:'column',alignItems:'center',justifyContent:'center'}}>

      <StoreProfilePic onPressEditableFalse={()=>{}} editable={editMode} onPress={(width,height,path)=>{onPress(width,height,path)}} profilePic={storeProfilePic}/>
      </View>
      <View style={{flex:2,flexDirection:'column' }}>
      <TextInput
      editable={editMode}
      style={styles.input}
      value={'aklsdjfklsk'}
      onChangeText={text=>{setStoreName(text)}}
      multiline={false}
      underlineColorAndroid='transparent'/>
      <TextInput
      editable={editMode}
      style={styles.input}
      value={storeName}
      onChangeText={text=>{setStoreName(text)}}
      multiline={false}
      underlineColorAndroid='transparent'/>
      <TextInput
      editable={editMode}
      style={styles.input}
      value={storeDescription}
      onChangeText={text=>{setStoreDescription(text)}}
      multiline={true}
      underlineColorAndroid='transparent'/>
      </View>
      </View>
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
      </ScrollView>
      <ModalContainer modalVisible={modalVisible}>
      <BoardPostCreator uid={props.uid} createBoardPost={createPost} closeBoardPostCreatorModal={cancelPressed} mediaChanged={(media)=>{}}/>
      </ModalContainer>
      {React.cloneElement(props.children, { signOut:props.signOut,editMode:editMode,setEditMode:setEditMode,setModalVisible:setModalVisible,setStore:setStore,resetState:resetState,showSave:showSave })}
      {/*<EditButtonSet editMode={editMode} setEditMode={setEditMode} setModalVisible={setModalVisible} modalVisible={modalVisible} setStore={setStore} resetState={resetState} showSave={showSave}/>*/}
      </>
    );
  }
  export default StorePage;
