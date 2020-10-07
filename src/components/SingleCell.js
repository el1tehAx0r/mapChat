import React, { useState,useEffect,useRef } from 'react';
import { Text, TextInput, View,Button,TouchableHighlight, Image,TouchableOpacity,Alert } from 'react-native';
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
const SingleCell= (props) => {
const onPress=()=>
  {
props.onPress(props.row,props.column)
  }
  return (
        <TouchableOpacity
        onPress={onPress}
         style={{height:styles.height/4,width:styles.width/3, flexDirection: 'row'  }}
      >
      {props.photo==null?
     <View style={{ height:styles.height/4,width:styles.width/3,flexDirection: 'row',  backgroundColor: 'skyblue'}}>
      </View>: <Image
      style={{ height:styles.height/4,width:styles.width/3,flexDirection: 'row',}}
      source={{
          uri:props.photo
        }}></Image>
        }
      </TouchableOpacity>
  );
}
export default SingleCell;
