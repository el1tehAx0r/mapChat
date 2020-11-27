
import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Modal, Text,TextInput,StyleSheet,ScrollView,TouchableOpacity,ImageBackground } from 'react-native';

import auth from '@react-native-firebase/auth';
import {DisplayName }from '../components/DisplayName.js'
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
import { useFocusEffect } from '@react-navigation/native';
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
  constructor(props) {
    super(props);
    this.state = {price:this.props.price,message:this.props.message,media:this.props.media};
  }
    render() {
      return (
        <View
        style={{
          borderRadius: 5,
          paddingTop:3,
          paddingLeft:styles.width/38,
          width: styles.width/3.2,
          height: styles.height/4.5}}
          >
          {this.props.media.mime=="image/jpeg"||this.props.media.mime=="image/png"?
          <ImageBackground
          style={{
            width: styles.width/4,
              justifyContent:'center',
            height: styles.height/4}}
            resizeMode='cover'
            source={{
              uri:this.props.media.path}}>
          <TextInput
          editable={this.props.editable}
          textAlign={'center'}
          style={{ height: 35,fontSize:12,marginBottom:30,color:'white',width:styles.width/4,  backgroundColor: "#000000a0"}}
          placeholder="Title+"
          defaultValue={this.state.price}
          onEndEditing={stuff=>{this.setState({price:stuff.nativeEvent.text},()=>{this.props.onChange(this.state.price,this.state.message,this.props.index)})}}
          />
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

          <TextInput
          editable={this.props.editable}
          style={{ height: 35,fontSize:12, width:styles.width/4, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Title+"
          defaultValue={this.state.message}
          onEndEditing={stuff=>{this.setState({message:stuff.nativeEvent.text},()=>{this.props.onChange(this.state.price,this.state.message,this.props.index)})}}

          />

            </View>)}}
      const render_item=(item:{media:object,price:string, key:string,message:string},index) =>{
        return (
          <View
          style={{paddingBottom:styles.width/6,}}
          key={item.key}>
          {editMode?
            <View >
            <RedXButton code={item.key} redXPressed={redXPressed} />
            </View>:null
          }
          <MyListItem key={index} onChange={(price,message,index)=>{handleChange(price,message,index)}} index={index} editable={editMode} message={item.message} price={item.price} media={item.media}/>
          </View>
        );
      }
      function handleChange (price,message,index) {
        console.log(index,price,message)
    let items = [...gridData];
    console.log(items)
    console.log(items[index],'zendaey')
    const returnedTarget = Object.assign({}, items[index]);
    returnedTarget.price= price;
    returnedTarget.message= message;
    console.log(returnedTarget,'jsaljdfl')
    items[index]=returnedTarget
    setGridData(items)

  //setGridData(items)
}
      function checkDifferent(){
        /*
*/
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

      const createPost=(uid,message,price,media)=>
      {
        console.log(price)
        const savedState= gridData.map((data) => {
          console.log(data,'aslkdfjklsdjl')
          return data;
        }
      )
      var key=Utility.makeid(5)
      savedState.push({media:media,key:key,message:message,price:price})
      setGridData(savedState)
      setShowSave(true);
      setModalVisible(false);
    }
    const cancelPressed=()=>
    {
      setModalVisible(false)
    }
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
    var renderItem=()=>{
      var rows = [];
      var cols=[];
      var j=0
for (var i = 0; i <gridData.length; i++) {
  var bear=render_item(gridData[i],i)
  var dog=bear
  rows.push(dog)
  if (i%2==0 && i!=0){
    cols.push(<Row key={i}>{rows}</Row>)
    rows=[]
  }
}
  if(i%3!=0)
  {
    cols.push(<Row key={i}>{rows}</Row>)
  }
return cols
    }
    return (
      <>
      <ScrollView style={{
         borderTopWidth:0.5, borderLeftWidth:0.5, borderRightWidth:0.5}} >
      <View style={{flex:1,flexDirection:'column',paddingBottom:60,paddingTop:3,alignItems:'center' }}>
      <View style={{...styles.bottomBorder}}>
      <View style={{flex:1,marginTop:"8%", flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <StoreProfilePic onPressEditableFalse={()=>{}} editable={editMode} onPress={(width,height,path)=>{onPress(width,height,path)}} profilePic={storeProfilePic}/>
      </View>
      <View style={{flex:2,flexDirection:'column' }}>

      <TextInput
      editable={editMode}
      style={styles.input}
      value={storeName}
      onChangeText={text=>{setStoreName(text)}}
      multiline={false}
      underlineColorAndroid='transparent'/>
      <Text style={{color:editMode?'black':'#d3d3d3'}}>Username</Text>
      <TextInput
      editable={editMode}
      style={styles.input}
      value={storeDescription}
      onChangeText={text=>{setStoreDescription(text)}}
      multiline={true}
      underlineColorAndroid='transparent'/>
      <Text style={{color:editMode?'black':'#d3d3d3'}}>Description</Text>
      </View>
      </View>
      <Grid>{renderItem()}</Grid>
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
