
import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Text,TextInput,StyleSheet } from 'react-native';
import  MapView,{Circle,Callout,Marker,PROVIDER_GOOGLE} from 'react-native-maps';
import ChatPage from '../screens/ChatScreen'
import CustomCallout from '../components/CustomCallout'
import Ionicons from 'react-native-vector-icons/Ionicons';
//Geolocation.getCurrentPosition(info => console.log(info));
export default function PostMarker(props) {
  useEffect(()=>{
    console.log('AAAAa',props.iconUrl)
  },[props.iconUrl])
  return (
<><Circle tracksViewChanges={false} center={props.coordinate} radius={7}/>
<Marker
onPress={(coordinates)=>{props.mapViewPressed(props.coordinate)}}
anchor={{x:0.42,y:0.42}}
  coordinate={props.coordinate}>
   <Image
     style={{
       overflow:'hidden',
       borderRadius: 150 / 2,
       overflow: "hidden",
       borderColor: "red",
    borderWidth: 1,
       width: 55,
       height:55,
     }}
     resizeMode='cover'
     source={{uri:props.iconUrl
     }}/>
     </Marker>
</>
  );
}
