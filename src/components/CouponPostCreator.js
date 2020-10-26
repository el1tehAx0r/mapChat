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
const CouponPostCreator= (props) => {
const [postType,setPostType]=useState('');
  const [customDialogVisible,setCustomDialogVisible]=useState(false);
  const [message,setMessage]=useState('')
  const [latitude,setLatitude]=useState(null)
  const [longitude,setLongitude]=useState(null)
  const [radius,setRadius]=useState();
  const [expirationDate,setExpirationDate]=useState(null);
  const [expirationTime,setExpirationTime]=useState(null);
  const [expirationDay,setExpirationDay]=useState(null);
  const [timePicker,setTimePicker]=useState(null)
  const [media,setMedia]=useState({path:'file:///storage/emulated/0/Android/data/com.gaialive/files/Pictures/fc6e1d81-41b4-4dec-af83-70c3663d6369.jpg',mime:'image/jpeg'})
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

  useEffect(()=>{
    console.log(expirationDay,expirationTime,'BAGOLO')
    if((expirationDay!==null) &&(expirationTime!=null))
    {
    setExpirationDate(combineDateAndTime(expirationDay,expirationTime))
    }
  },[expirationTime,expirationDay])
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
  props.createBoardPost(props.uid,message,media,expirationDate,radius,{latitude,longitude})
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
  console.log(data,'originalsdata')
  setMedia({mime:'video/mp4',path:data.path});
});
  }
  const start = () => {
    console.log('ljskldjf')
    videoRef.current.open({ maxLength: 30 },(data) => {
  console.log(data,'originalsdata')
      data.path=data.uri
  setMedia({mime:'video/mp4',path:data.uri});
/*const videoprocess=new VideoProcessor()
videoprocess.compressVideo(data.path).then((compressedData)=>{setMedia({mime:'video/mp4',path:compressedData});
console.log(compressedData,'zzzzz')}
)*/
      //setMedia(data)
    },(err)=>{console.log(err)});

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
  return (
    <View style={{padding: 10}}>

<CustomDialog setDialogVisible={setDialogVisible} photoFromCameraPressed={photoFromCameraPressed} photoFromLibraryPressed={photoFromLibraryPressed} videoFromCameraPressed={videoFromCameraPressed} videoFromLibraryPressed={videoFromLibraryPressed} modalVisible={customDialogVisible} />
      <VideoRecorder ref={videoRef} />
      <View style={{flexDirection:'row'}}>
      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Distance From Location (km)"
        onChangeText={radius=> setRadius(radius)}
        defaultValue={null}
      />
      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Lat"
        onChangeText={lat=> setLatitude(lat)}
        defaultValue={null}
      />
      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="long"
        onChangeText={long=> setLongitude(long)}
        defaultValue={null}
      />
      </View>
      <View style={{flexDirection:'row'}}>
      <TextInput
        style={{ flex:5, height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Add A Message"
        onChangeText={message=> setMessage(message)}
        defaultValue={message}
      />
      <TextInput
        style={{ flex:2, height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="How many generate"
        onChangeText={count=> setCouponCount(count)}
        defaultValue={null}
      />
      </View>

 <DatePicker
        style={{width: '100%'}}
        date={expirationDate}
        mode="date"
        placeholder={'pick expiration date'}
        format="YYYY-MM-DDTHH:MM:SSZ"
        minDate="2020-05-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            paddingBottom:10,
            marginLeft: 36,
            height:30
          }}}
        onDateChange={(date) => {setExpirationDay(date);showTimePicker();}}
      />
      {timePicker}
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
export default CouponPostCreator;
