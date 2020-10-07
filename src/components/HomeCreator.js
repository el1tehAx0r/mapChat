import React, { useLayoutEffect,useState,useEffect,useRef } from 'react';
import {Alert, Text, TextInput, View,Button,TouchableHighlight, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker'
import CountDown from 'react-native-countdown-component';
import { Form, TextValidator } from 'react-native-validator-form';
import firebaseSDK from '../config/FirebaseSDK'
import styles from '../StyleSheet';
import { Col, Row, Grid } from "react-native-easy-grid";
import PhotoEditor from 'react-native-photo-editor'
import * as RNFS from 'react-native-fs';
import SingleCell from './SingleCell'
const HomeCreator= (props) => {
const [myHome,setMyHome]=useState([])
const [myHomeJSX,setMyHomeJSX]=useState([])
const [newPhotos,setNewPhotos]=useState([])
const photoEdit=(image,row,column)=>
{
PhotoEditor.Edit({
  onDone:(result)=>{
  const extra= myHome.map((l) => {return l});
  let photos=[];
 extra[row][column]=image.path;
  var remotePath='gallery/'+image.path
  var localPath=image.path
  var collectionName='Users'
  var documentName=props.uid
  var field='storeGallery'
  var galleryArray=extra
  var extra1={}
  for (var i in extra)
  {
  extra1[i]=extra[i]
}
setMyHome(extra)
firebaseSDK.addToPhotoGallery(remotePath,localPath,collectionName,documentName,field,extra1).then(()=>{
  }
)
  },
    path:  image.path.replace('file:///',"")
});
}
const onPress= (row,column) =>
    Alert.alert(
      "Alert Title",
      "Add Image To Profile",
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
        ],
      { cancelable: false }
    );
useEffect(()=>{
  console.log(props.myHome)
  setMyHome(renderHome)
},[])

useLayoutEffect(()=>{

    console.log(myHome,'mine')
  try{
    console.log(myHome,'mine')
  var holder=myHome.map((value, index) => {
    console.log(value,'vaslone')
  return <View key={index} style={{flex: 3, flexDirection: 'row'}}>
<SingleCell photo={value[0]} onPress={onPress} column={0} row={index}/>
<SingleCell photo={value[1]} onPress={onPress} column={1} row={index}/>
<SingleCell photo={value[2]} onPress={onPress} column={2} row={index}/>
 </View>
})
  setMyHomeJSX(holder)
}
catch{}
},[myHome])
useEffect(()=>{
 console.log('jsx')
},[myHomeJSX])

useEffect(()=>{

    console.log(myHome,'mine')
  try{
    console.log(myHome,'mine')
  var holder=myHome.map((value, index) => {
    console.log(value,'vaslone')
  return <View key={index} style={{flex: 3, flexDirection: 'row'}}>
<SingleCell photo={value[0]} onPress={onPress} column={0} row={index}/>
<SingleCell photo={value[1]} onPress={onPress} column={1} row={index}/>
<SingleCell photo={value[2]} onPress={onPress} column={2} row={index}/>
 </View>
})
  setMyHomeJSX(holder)
}
catch{}
},[myHome])
useEffect(()=>{
 console.log('jsx')
},[myHomeJSX])

const renderHome=()=>
{
  var homeImages=[]
  if (props.myHome==null){
  for (var i=0; i< 2;i++){
    console.log('1')
    var holder=[]
  for(var j=0;j<3;j++){
holder.push(null)
//holder.push(<SingleCell photo={null} onPress={onPress} row={i} column={j} key={j}/>)
  }
  homeImages.push(holder)
  }
}
else{
  for (var i=0; i<2;i++){
    var holder=[]
  for(var j=0;j<3;j++){
holder.push(props.myHome[i][j])
  }
  homeImages.push(holder)
}
}
return(homeImages)
}
  return (
    <>
    {myHomeJSX}
      </>
  );
}
export default HomeCreator;
