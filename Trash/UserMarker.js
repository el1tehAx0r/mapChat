import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Text,TextInput,StyleSheet } from 'react-native';
import MapView,{Callout,Marker,PROVIDER_GOOGLE} from 'react-native-maps';
import CustomCallout from '../components/CustomCallout'
import Ionicons from 'react-native-vector-icons/Ionicons';
//Geolocation.getCurrentPosition(info => console.log(info));
export default function UserMarker(props) {
  return (
<Marker image={props.image} coordinate={props.coordinate}>
<Callout><CustomCallout>

        <Ionicons name="chatbox"  size={20} />
 </CustomCallout></Callout>
</Marker>

  );
}
