import React, { useState, useEffect } from 'react';
import {TouchableHighlight, View,Image, Text,TextInput,StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import {DisplayName }from '../components/DisplayName.js'
 import PhotoUpload from 'react-native-photo-upload'
 import ImagePicker from 'react-native-image-crop-picker';
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'react-native-material-textfield';
export default function StoreProfilePic(props)
{
  const onPress = () => {
ImagePicker.openPicker({
  width: 90,
  height: 90,
  cropping: true
}).then(image => {
props.onPress(image.width,image.heigt,image.path);
});
  }
  return (
<TouchableHighlight style={{flex:1}}onPress={()=>{if(props.editable){onPress()}}}>
   <Image
     style={{
       borderWidth: 1,
       borderColor:'red',
       borderRadius:100,
       width: 65,height:65,
       }}
     resizeMode='cover'
     source={{
       uri:props.profilePic
     }}
   />
</TouchableHighlight>
  )
}
