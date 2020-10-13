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
import firebaseSDK from '../config/FirebaseSDK'
import styles from '../StyleSheet';
const PostCreator= (props) => {
const [postType,setPostType]=useState('');
  const [shopAddress,setShopAddress]=useState(props.postCreatorInfo.shopAddress);
  const [customDialogVisible,setCustomDialogVisible]=useState(false);
  const [message,setMessage]=useState(props.postCreatorInfo.message);
  const [iconUrl,setIconUrl]=useState(props.postCreatorInfo.iconUrl);
  const [expirationDay,setExpirationDay]=useState(null);
  const [expirationDate,setExpirationDate]=useState(props.postCreatorInfo.expirationDate);
  const [expirationTime,setExpirationTime]=useState(null);
  const [imageUrl,setImageUrl]=useState(props.postCreatorInfo.imageUrl);
  const [media,setMedia]=useState(props.postCreatorInfo.media)
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
useEffect(()=>{console.log(media,'mismdim')},[media])
useEffect(()=>
{
  if(props.postCreatorInfo.expirationDate!=null)
  {
    setExpirationDate(props.postCreatorInfo.expirationDate.toDate())
  }
},[imageUrl])
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
    console.log(date,'kjklsj',time,'THESE')
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Jan is 0, dec is 11
    var day = date.getDate();
    var hours=time.getHours();
    var minutes=time.getMinutes();
    var combined = new Date(year,month,day,hours,minutes,0,0);
    console.log(combined,'WKJSDKLJ')

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

const photoEdit=(image)=>
{
PhotoEditor.Edit({
  onDone:(result)=>{
    setMedia(image)
  setCustomDialogVisible(false)
  },
    path:  image.path.replace('file:///',"")
});
}

useEffect(()=>{
  console.log(props.myHome)
},[])
  const idk= () => {

ImagePicker.openCamera({
  width: 300,
  height: 200,
  cropping: true
}).then(image => {console.log(image)
  setImageUrl(image.path)
});
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
  const onPressIconUrl= () => {
ImagePicker.openPicker({
  width:65,
  height: 65,
  cropping: true
}).then(image => {
  setIconUrl(image.path)
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


const createPost=()=>
{

  props.createPost(props.uid,props.postCreatorInfo.latitude,props.postCreatorInfo.longitude,message,shopAddress,iconUrl,expirationDate,imageUrl)
}

const editPost=()=>
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
}
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
const changeMediaPath= (value, type,value2,type2) => {
    let qty = { ... media}; // make a copy
    qty[type] = value;
    qty[type2] = value2;
    setMedia(qty);
};
  const photoFromLibraryPressed=()=>
  {
ImagePicker.openPicker({
  width:styles.width/1.5,
  height: styles.height/1.5,
  cropping: true
}).then((result)=>{photoEdit(result)});
  }

  const videoFromCameraPressed=()=>
  {
start()
  }
  const videoFromLibraryPressed=async ()=>
  {
ImagePicker.openPicker({
  cropping:false,
  mediaType: "video",
}).then((data) => {
  console.log(data,'originalsdata')
  setMedia({mime:'video/mp4',path:data.path});
  setIconUrl(data.path)
/*const videoprocess=new VideoProcessor()
videoprocess.compressVideo(data.path).then((compressedData)=>{setMedia({mime:'video/mp4',path:compressedData});
console.log(compressedData,'ZZZZZZZZ')})*/
});
  }
  const start = () => {
    videoRef.current.open({ maxLength: 30 },(data) => {
  console.log(data,'originalsdata')
      data.path=data.uri
  setMedia({mime:'video/mp4',path:data.uri});

  setIconUrl(data.path)
/*const videoprocess=new VideoProcessor()
videoprocess.compressVideo(data.path).then((compressedData)=>{setMedia({mime:'video/mp4',path:compressedData});
console.log(compressedData,'zzzzz')}
)*/
      //setMedia(data)
    });
}
  return (
    <View style={{padding: 10}}>
    <Modal visible={iconPickerVisible}>
    <IconSelectPage videoSource={media.path}/>
    </Modal>
<CustomDialog setDialogVisible={setDialogVisible} photoFromCameraPressed={photoFromCameraPressed} photoFromLibraryPressed={photoFromLibraryPressed} videoFromCameraPressed={videoFromCameraPressed} videoFromLibraryPressed={videoFromLibraryPressed} modalVisible={customDialogVisible} />
      <VideoRecorder ref={videoRef} />

      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Description"
        onChangeText={message=> setMessage(message)}
        defaultValue={props.postCreatorInfo.message}
      />
{media.mime=="image/jpeg"||media.mime=="image/png"||iconPickerVisible?

<TouchableHighlight onPress={onPressImageUrl}>
   <Image
     style={{
       paddingVertical: 30,
       width: styles.width/1.5,
       height: styles.height/1.5}}
     resizeMode='cover'
     source={{
       uri:media.path     }}
   />
   </TouchableHighlight>
   :

   <VideoPlaybackComponent
    videoSource={media.path}/>

}
<View style={{flexDirection:'row'}}>
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
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={cancelPressed}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            {setFinalButtons()}
            </View>
    </View>
  );
}
export default PostCreator;
