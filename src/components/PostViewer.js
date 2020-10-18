import React, { useState,useEffect,useRef } from 'react';
import { Text, TextInput, View,Button,TouchableHighlight, Image,ScrollView} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-crop-picker'
import CountDown from 'react-native-countdown-component';
import { Form, TextValidator } from 'react-native-validator-form';
import firebaseSDK from '../config/FirebaseSDK'
import VideoPlaybackComponent from './VideoPlaybackComponent'
import VideoPlayer from 'react-native-video-player';
import CarouselComponent from './CarouselComponent';
import ModalContainer from './ModalContainer'
import styles from '../StyleSheet';
import RadioButtonComponent from './RadioButtonComponent'
import BoardPostCreator from './BoardPostCreator'
const PostViewer= (props) => {
const [boardPosts,setBoardPosts]=useState([]);
const [selectedFilter,setSelectedFilter]=useState(null);
const [modalVisible,setModalVisible]=useState(false)
const [featuredPosts,setFeaturedPosts]=useState([])
const getSnapShotData=async ()=>
{
  console.log(props.postViewerInfo.boardPosts.length,'ZZZZZZZ')
  try{
var tempReferenceList=[]
  await Promise.all(props.postViewerInfo.boardPosts.map(async (docReference) => {
  const snapshotData=await firebaseSDK.getPostByReference(docReference)
  tempReferenceList.push(snapshotData);
}))

  setBoardPosts(tempReferenceList)
}
catch{}
try{

var tempReferenceList1=[]
  await Promise.all(props.postViewerInfo.featuredPosts.map(async (docReference) => {
  const snapshotData1=await firebaseSDK.getPostByReference(docReference)
  tempReferenceList1.push(snapshotData1);
}))
  setFeaturedPosts(tempReferenceList1)
}
catch{}
}
useEffect(()=>{
console.log(boardPosts.length,'WORKKDD')
},[boardPosts])

useEffect(()=>{

},[featuredPosts])
useEffect(()=>{
getSnapShotData()
return () => {

getSnapShotData()
  }
},[props.postViewerInfo])
const getPostData=async (docReference)=>
{
  await firebaseSDK.getPostByReference(docReference)
}
const sortByDate=()=>{
setSelectedFilter(<CarouselComponent  boardPosts={boardPosts}/>)
}
const sortByLikes=()=>{
setSelectedFilter(<CarouselComponent  boardPosts={boardPosts}/>)
}
const sortByFeaturedPosts=()=>{
setSelectedFilter(<CarouselComponent boardPosts={featuredPosts}/>)
}
const cancelPressed=()=>
{
props.closePostViewerModal()
}
const closeBoardPostCreatorModal=()=>
{
  setModalVisible(!modalVisible)
}
const createBoardPost=(uid,message,media)=>
{
firebaseSDK.createBoardPost(uid,message,media,props.postViewerInfo.postId).then((boardPost)=>{
      var boardPostId=boardPost._documentPath._parts[1]
      var remotePath='media/'+boardPostId
      var localPath=media.path.toString()
      var collectionName='BoardPosts'
      var documentName=boardPostId
      var field='media.path'
      firebaseSDK.addToStorage(remotePath,localPath,collectionName,documentName,field)
      closeBoardPostCreatorModal()})
}

  return (
    <View style={{padding: 10}}>
          <ModalContainer modalVisible={modalVisible}>
        <BoardPostCreator uid={props.uid} postViewerInfo={props.postViewerInfo} createBoardPost={createBoardPost} closeBoardPostCreatorModal={closeBoardPostCreatorModal} mediaChanged={(nothing)=>{}}/>
          </ModalContainer>
            <TouchableHighlight
              style={{ ...styles.closeButton, position:'absolute',right:0, top:0 }}
              onPress={cancelPressed}>
              <Text style={styles.xTextStyle}>X</Text>
            </TouchableHighlight>
<RadioButtonComponent sortByDate={sortByDate} sortByLikes={sortByLikes} sortByFeaturedPosts={sortByFeaturedPosts}/>
            <ScrollView>
      <Text style={{ height: 35 }}>
      {props.postViewerInfo.message}
        </Text>
        <CarouselComponent boardPosts={boardPosts}/>
    <View style={{flexDirection:"row"}}>
      </View>
        </ScrollView>
<View style={{justifyContent:'center',flexDirection:'row'}}>
            <TouchableHighlight
              style={{ ...styles.addButton, backgroundColor: "#2196F3" }}
              onPress={()=>setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>+</Text>
            </TouchableHighlight>
            </View>
    </View>


  );
}
export default PostViewer;
