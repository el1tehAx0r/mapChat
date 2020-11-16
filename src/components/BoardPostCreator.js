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
import firebaseSDK from '../config/FirebaseSDK'
import styles from '../StyleSheet';
const BoardPostCreator= (props) => {
const [postType,setPostType]=useState('');
  const [customDialogVisible,setCustomDialogVisible]=useState(false);
  const [message,setMessage]=useState('')
  const [media,setMedia]=useState({path:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fimages.png?alt=media&token=0f82c0e3-eb6c-43f6-8e58-6c274d310f42',mime:'image/jpeg'})
  const videoRef= useRef(null);
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
useEffect(()=>
{
props.mediaChanged(media)
setCustomDialogVisible(false)
},[media])
const cancelPressed=()=>
{
props.closeBoardPostCreatorModal()
}
const createBoardPost=()=>
{
  props.createBoardPost(props.uid,message,media)
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
  },
    path:  image.path.replace('file:///',"")
});
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
    console.log('ummm')
start()
  }
  const videoFromLibraryPressed=async ()=>
  {
ImagePicker.openPicker({
  cropping:false,
  mediaType: "video",
}).then((data) => {
  setMedia({mime:'video/mp4',path:data.path});
});
  }
  const start = () => {
    videoRef.current.open({ maxLength: 30 },(data) => {
      data.path=data.uri
  setMedia({mime:'video/mp4',path:data.uri});
/*const videoprocess=new VideoProcessor()
videoprocess.compressVideo(data.path).then((compressedData)=>{setMedia({mime:'video/mp4',path:compressedData});
console.log(compressedData,'zzzzz')}
)*/
      //setMedia(data)
    },(err)=>{console.log(err)});

}
  return (
    <View style={{padding: 10}}>

<CustomDialog setDialogVisible={setDialogVisible} photoFromCameraPressed={photoFromCameraPressed} photoFromLibraryPressed={photoFromLibraryPressed} videoFromCameraPressed={videoFromCameraPressed} videoFromLibraryPressed={videoFromLibraryPressed} modalVisible={customDialogVisible} />
      <VideoRecorder ref={videoRef} />
      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Description"
        onChangeText={message=> setMessage(message)}
        defaultValue={message}
      />
<TouchableHighlight onPress={onPressImageUrl}>
{media.mime=="image/jpeg"||media.mime=="image/png"?
   <Image
     style={{
       paddingVertical: 30,
       width: styles.width/1.8,
       height: styles.height/1.8}}
     resizeMode='cover'
     source={{
       uri:media.path}}
   />
   :
   <VideoPlaybackComponent
    videoSource={media.path}/>
}
   </TouchableHighlight>
<Text>Press to Change Image</Text>
<View style={{paddingTop:10, flexDirection:'row'}}>
            {props.children}
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={cancelPressed}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={createBoardPost}
            >
              <Text style={styles.textStyle}>Create Post</Text>
            </TouchableHighlight>
            </View>
    </View>
  );
}
export default BoardPostCreator;
