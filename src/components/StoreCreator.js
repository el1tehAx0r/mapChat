import React, { useState,useEffect,useRef } from 'react';
import {Alert, Text,TextInput,View,Button,TouchableHighlight,Image,KeyboardAvoidingView,TouchableOpacity,Modal } from 'react-native';
import DatePicker from 'react-native-datepicker'
import PhotoEditor from 'react-native-photo-editor'
import * as RNFS from 'react-native-fs';
import CustomDialog from './CustomDialog'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker'
import IconSelectPage from '../screens/IconSelectScreen'
import { Form, TextValidator } from 'react-native-validator-form';
import { VideoPlayer, Trimmer } from 'react-native-video-processing';
import VideoRecorder from 'react-native-beautiful-video-recorder';
import VideoEditor from './VideoEditor'
import VideoPlaybackComponent from './VideoPlaybackComponent'
import ModalContainer from './ModalContainer'
import VideoProcessor from './VideoProcessor'
import { ProcessingManager } from 'react-native-video-processing';
import BoardPostCreator from './BoardPostCreator'
import firebaseSDK from '../config/FirebaseSDK'
import styles from '../StyleSheet';
const StoreCreator= (props) => {
const [postType,setPostType]=useState('');
  const [shopAddress,setShopAddress]=useState(props.postCreatorInfo.shopAddress);
  const [customDialogVisible,setCustomDialogVisible]=useState(false);
  const [message,setMessage]=useState(props.postCreatorInfo.message);
  const [iconUrl,setIconUrl]=useState('https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/iconUrl%2F0J2xo0x0BDesWW0mrpEp?alt=media&token=06941aa1-0746-4308-a4d2-9b752b3b534a')
  const [expirationDay,setExpirationDay]=useState(null);
  const [expirationDate,setExpirationDate]=useState(props.postCreatorInfo.expirationDate);
  const [expirationTime,setExpirationTime]=useState(null);
  //const [imageUrl,setImageUrl]=useState(props.postCreatorInfo.imageUrl);
  const [media,setMedia]=useState({path: 'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d',mime:'image/jpeg'})
  const [iconPickerVisible,setIconPickerVisible]=useState(false)
  const [timePicker,setTimePicker]=useState(null)
  const videoRef= useRef(null);
useEffect(()=>
{
  console.log(props.postCreatorInfo.media,'zkjdsklfkj')
  if(props.postCreatorInfo.expirationDate!=null)
  {
    setExpirationDate(props.postCreatorInfo.expirationDate.toDate())
  }
},[])
useEffect(()=>{
  console.log(media,'RRRRR')
  if(media.mime!="image/jpeg"&&media.mime!="image/png"){
  console.log(media,'RRRRR')
      const maximumSize = { width: 300, height: 300 };
    ProcessingManager.getPreviewForSecond(media.path,0, maximumSize,'JPEG')
      .then((data) =>{
        console.log(data,'AYAYYSAYD')
      setIconUrl(data.uri)
      })
    }
},[media])

  useEffect(()=>{
    console.log(expirationDay,expirationTime,'BAGOLO')
    if((expirationDay!==null) &&(expirationTime!=null))
    {
    setExpirationDate(combineDateAndTime(expirationDay,expirationTime))
    }
  },[expirationTime,expirationDay])
const combineDateAndTime = function(date, time) {
    var timeString = time.getHours() + ':' + time.getMinutes() + ':00';
    date= new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Jan is 0, dec is 11
    var day = date.getDate();
    var hours=time.getHours();
    var minutes=time.getMinutes();
    var combined = new Date(year,month,day,hours,minutes,0,0);
    return combined;
};
const cancelPressed=()=>
{
props.closePostCreatorModal()
}
const onPressImageUrl=()=>
{
setCustomDialogVisible(true)
}
const showTimePicker =()=>
{
  setTimePicker(
        <RNDateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode={'time'}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />)
}
const onPressIconUrl=()=>
{
        ImagePicker.openCropper({
      path: media.path,
      width: 65,
      height: 65,
    })
      .then((image) => {
        console.log(image)
  setIconUrl(image.path)
      })
      .catch((e) => {
        console.log(e);
      });
}
  const onPressIconUrlVideo= () => {
  setIconPickerVisible(true)
}

const deletePost=()=>
{
firebaseSDK.deletePost(props.uid,props.postCreatorInfo.postId)
cancelPressed()
}
const setFinalButtons=()=>
{
  if(props.postCreatorInfo.isEditing){
  return (
    <>
          <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={editPost}
            >
              <Text style={styles.textStyle}>Save Edits</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={deletePost}
            >
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableHighlight></>
  )}
  else{
  return(
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={createPost}
            >
              <Text style={styles.textStyle}>Create Post</Text>
            </TouchableHighlight>
  )
}
}
const createPost=(uid,message,media)=>
{
  console.log(media,'test123')
  props.createPost(props.uid,props.postCreatorInfo.latitude,props.postCreatorInfo.longitude,message,iconUrl,media)
}

/*const editPost=()=>
{
  firebaseSDK.editPost(props.postCreatorInfo.postId,message,shopAddress,iconUrl,expirationDate,imageUrl).then((post)=>
{
      var postId=props.postCreatorInfo.postId
      var remotePath='couponPic/'+postId
      var localPath=imageUrl.toString()
      var collectionName='Posts'
      var documentName=postId
      var field='imageUrl'
      firebaseSDK.addToStorage(remotePath,localPath,collectionName,documentName,field)
      var remotePath='couponIcon/'+postId
      var localPath=iconUrl.toString()
      var collectionName='Posts'
      var documentName=postId
      var field='iconUrl'
      firebaseSDK.addToStorage(remotePath,localPath,collectionName,documentName,field).then(()=>
    {
      cancelPressed()
    })
})
}*/
  const onChange = (event, selectedTime) => {
    console.log(selectedTime)
    setTimePicker(null)
    setExpirationTime(selectedTime)
  };
  const setDialogVisible=()=>
  {
  setCustomDialogVisible(false)
  }

  const photoFromCameraPressed=()=>
  {
ImagePicker.openCamera({
  width: styles.width/1.5,
  height: styles.height/1.5,
  cropping: true
}).then((result)=>{console.log(result);photoEdit(result)})
  }
  const videoFromCameraPressed=()=>
  {
    console.log('ummm')
start()
  }
  const closeIconPicker=()=>{
    setIconPickerVisible(false)
  }

const setIcon=(iconUrl)=>
{
  setIconUrl(iconUrl)
}
  return (
    <View style={{padding: 10}}>
    <Modal visible={iconPickerVisible}>
    <IconSelectPage setIcon={setIcon} closeIconPicker={closeIconPicker} videoSource={media.path}/>
    </Modal>
        <BoardPostCreator uid={props.uid} postViewerInfo={props.postViewerInfo} createBoardPost={createPost} closeBoardPostCreatorModal={cancelPressed} mediaChanged={(media)=>{console.log(media,'SDJFLSKJF');setMedia(media);setIconUrl(media.path)}}>
<View style={{paddingTop:10, flexDirection:'column'}}>
<TouchableHighlight onPress={media.mime=='image/jpeg'||media.mime=='image/png'? onPressIconUrl: onPressIconUrlVideo}>
   <Image
     style={{
       borderWidth: 2,
       borderColor:'red',
       borderRadius:100,
       width: 65,height:65,
       }}
     resizeMode='cover'
     source={{
       uri:iconUrl,
     }}
   />
</TouchableHighlight>
            </View>
        </BoardPostCreator>

    </View>
  );
}
export default StoreCreator;
