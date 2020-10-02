import React, { useState,useEffect,useRef } from 'react';
import { Text, TextInput, View,Button,TouchableHighlight, Image } from 'react-native';
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
const HomeCreator= (props) => {

PhotoEditor.Edit({
    path: RNFS.DocumentDirectoryPath + "/photo.jpg"
});
  return (
     <View style={{flex: 1, flexDirection: 'row'}}>
      </View>
  );
}
export default HomeCreator;
