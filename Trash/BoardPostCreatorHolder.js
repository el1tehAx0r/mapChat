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
const BoardPostCreator= (props) => {
const [postType,setPostType]=useState('');
  const [customDialogVisible,setCustomDialogVisible]=useState(false);
  const [message,setMessage]=useState('')
  const [media,setMedia]=useState({path: 'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/iconUrl%2F0J2xo0x0BDesWW0mrpEp?alt=media&token=06941aa1-0746-4308-a4d2-9b752b3b534a',mime:'image/jpeg'})
  const videoRef= useRef(null);
const cancelPressed=()=>
{
props.closePostCreatorModal()
}

const createBoardPost=()=>
{
  props.createBoardPost(props.uid,message,media,props.postViewerInfo.postId)
}
  return (
<View style={{paddingTop:10, flexDirection:'row'}}>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={cancelPressed}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={createPost}
            >
              <Text style={styles.textStyle}>Create Post</Text>
            </TouchableHighlight>
            </View>
  );
}
export default BoardPostCreatorHolder;
