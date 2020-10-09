import React, { useState,useEffect,useRef } from 'react';
import {Alert, Text,TextInput,View,Button,TouchableHighlight,Image,KeyboardAvoidingView,TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker'
import PhotoEditor from 'react-native-photo-editor'
import * as RNFS from 'react-native-fs';
import CustomDialog from './CustomDialog'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker'
import { Form, TextValidator } from 'react-native-validator-form';
import { VideoPlayer, Trimmer } from 'react-native-video-processing';
import VideoRecorder from 'react-native-beautiful-video-recorder';
import VideoEditor from './VideoEditor'

import firebaseSDK from '../config/FirebaseSDK'
import styles from '../StyleSheet';
const PostCreator= (props) => {
const [postType,setPostType]=useState('');
  const [shopAddress,setShopAddress]=useState(props.postCreatorInfo.shopAddress);
  const [customDialogVisible,setCustomDialogVisbile]=useState(false);
  const [message,setMessage]=useState(props.postCreatorInfo.message);
  const [iconUrl,setIconUrl]=useState(props.postCreatorInfo.iconUrl);
  const [expirationDay,setExpirationDay]=useState(null);
  const [expirationDate,setExpirationDate]=useState(props.postCreatorInfo.expirationDate);
  const [expirationTime,setExpirationTime]=useState(null);
  const [imageUrl,setImageUrl]=useState(props.postCreatorInfo.imageUrl);
  const [timePicker,setTimePicker]=useState(null)
  const videoRef= useRef(null);
useEffect(()=>
{
  if(props.postCreatorInfo.expirationDate!=null)
  {
    setExpirationDate(props.postCreatorInfo.expirationDate.toDate())
  }
},[])
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
setCustomDialogVisbile(true)
}

const photoEdit=(image)=>
{
PhotoEditor.Edit({
  onDone:(result)=>{
  },
    path:  image.path.replace('file:///',"")
});
}

const forLater= () =>
    Alert.alert(
      "Alert Title",
      "Add Imago Profile",
      [
        {text: "Cancel", onPress: () => console.log("OK Pressed")},
        {
          text:"Add photo from Library",
          onPress: () =>{
ImagePicker.openPicker({
  width:styles.width/3,
  height: styles.height/4,
  cropping: true
}).then((result)=>{photoEdit(result,row,column)});
    }
        },
        {
          text: "Take Photo from Camera",
          onPress: () =>
ImagePicker.openCamera({
  width: styles.width/3,
  height: styles.height/4,
  cropping: true
}).then(photoEdit),
        },
        {
          text:"Add Video from Library",
          onPress: () =>{
ImagePicker.openPicker({
  mediaType: "video",
}).then((video) => {
  console.log(video);
}).then((result)=>{photoEdit(result,row,column)});
    }
        },
        ],
      { cancelable: false }
    );
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
  width: styles.width/3,
  height: styles.height/4,
  cropping: true
}).then((result)=>photoEdit(result))
  }

  const photoFromLibraryPressed=()=>
  {
ImagePicker.openPicker({
  width:styles.width/3,
  height: styles.height/4,
  cropping: true
}).then((result)=>{photoEdit(result)});
  }

  const videoFromCameraPressed=()=>
  {
start()
  }
  const videoFromLibraryPressed=()=>
  {
ImagePicker.openPicker({
  cropping:false,
  mediaType: "video",
}).then((video) => {
  console.log(video);
});
  }
  const start = () => {
    // 30 seconds
    videoRef.current.open({ maxLength: 30 },(data) => {

        console.log('captured data', data);
    });
}

  return (

    <View style={{padding: 10}}>
<CustomDialog setDialogVisible={setDialogVisible} photoFromCameraPressed={photoFromCameraPressed} photoFromLibraryPressed={photoFromLibraryPressed} videoFromCameraPressed={videoFromCameraPressed} videoFromLibraryPressed={videoFromLibraryPressed} modalVisible={customDialogVisible} />
<DropDownPicker
    items={[{label: 'Coupon Image', value: 'coupon_image', icon: () => <Icon name="flag" size={15} color="#900" />},
        {label: 'Coupon Video', value: 'coupon_video', icon: () => <Icon name="flag" size={15} color="#900" />},
        {label: 'Postnot implemented ', value: 'coupon_video', icon: () => <Icon name="flag" size={15} color="#900" />},
        {label: 'Postnot implemented', value: 'coupon_video', icon: () => <Icon name="flag" size={15} color="#900" />}, ]}
    defaultValue={null}
    placeholder={'Select Media Type'}
    containerStyle={{height:'12%'}}
    style={{backgroundColor: '#fafafa'}}
    itemStyle={{
        justifyContent: 'flex-start'
    }}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => setPostType(item)}/>
    <View style={{flexDirection:"row"}}>
      </View>
      <VideoRecorder ref={videoRef} />
<TouchableHighlight onPress={onPressImageUrl}>
   <Image
     style={{
       paddingVertical: 30,
       width: 300,
       height: 200,}}
     resizeMode='cover'
     source={{
       uri:imageUrl,
     }}
   />
</TouchableHighlight>
    <View style={{flexDirection:"row"}}>

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
      </View>
      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Description"
        onChangeText={message=> setMessage(message)}
        defaultValue={props.postCreatorInfo.message}
      />
    <View style={{flexDirection:"row"}}>

      </View>

      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Address of Store"
        onChangeText={shopAddress=> setShopAddress(shopAddress)}
        defaultValue={props.postCreatorInfo.shopAddress}/>

<View style={{flexDirection:'row'}}>
<TouchableHighlight onPress={onPressIconUrl}>
   <Image
     style={{
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
