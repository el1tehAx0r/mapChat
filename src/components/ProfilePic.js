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
export default function PP(props)
{
  const onPress = () => {
ImagePicker.openPicker({
  width: 120,
  height: 120,
  cropping: true
}).then(image => {
props.onPPClicked(image.width,image.heigt,image.path);
});
  }
  return (
<TouchableHighlight onPress={onPress}>
   <Image
     style={{
       paddingVertical: 30,
       width: 120,
       height: 120,
     }}
     resizeMode='cover'
     source={{
       uri:props.PPPath
     }}
   />
</TouchableHighlight>
  )
}
