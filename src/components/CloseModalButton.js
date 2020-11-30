import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,TouchableHighlight,
TouchableOpacity,
ImageBackground,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import { DraggableGrid } from 'react-native-draggable-grid';
import styles,{draggableGridStyles} from '../StyleSheet'
import { Ionicons } from 'react-native-vector-icons/Ionicons';
export default function CloseModalButton(props){
    return (
    <View >
            <TouchableHighlight
            onPressIn={()=>{
              props.close()
            }}
              style={{ ...styles.addButton, marginBottom:-15,backgroundColor: "red",left:styles.width/1.33 }}>
              <Text style={styles.textStyle}>X</Text>
            </TouchableHighlight>
    </View>)
}
