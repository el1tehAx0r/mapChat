
import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Text,TextInput,StyleSheet } from 'react-native';
import  MapView,{Circle,Callout,Marker,PROVIDER_GOOGLE} from 'react-native-maps';
import ChatPage from '../screens/ChatScreen'
import CustomCallout from '../components/CustomCallout'
import Ionicons from 'react-native-vector-icons/Ionicons';
//Geolocation.getCurrentPosition(info => console.log(info));
export default function PostMarker(props) {
  useEffect(()=>{
    console.log('AAAAa',props.circleCenters)
  },[props.circleCenters])
  return (
<><Circle tracksViewChanges={false} center={props.coordinate} radius={10}/>
</>
  );
}
