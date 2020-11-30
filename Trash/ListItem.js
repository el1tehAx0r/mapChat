import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Modal, Text,TextInput,StyleSheet,ScrollView,TouchableOpacity,ImageBackground } from 'react-native';
import StoreProfilePic from '../components/StoreProfilePic'
import VideoPlayer from 'react-native-video-player';
import styles,{draggableGridStyles} from '../StyleSheet'
import {
  TextField,
  FilledTextField,
  OutlinedTextField2,
} from 'react-native-material-textfield';
  export default class MyListItem extends React.PureComponent {
    render() {
      return (
        <View
        style={{
          borderRadius: 5,
          width: styles.width/5,
          height: styles.height/5}}
          >
          {this.props.media.mime=="image/jpeg"||this.props.media.mime=="image/png"?
          <ImageBackground
          style={{
            width: styles.width/5,
            height: styles.height/5}}
            resizeMode='cover'
            source={{
              uri:this.props.media.path}}>
              </ImageBackground>
              :
              <View pointerEvents="none">
              <VideoPlayer
              repeat
              videoHeight={styles.height/.3}
              ref={this.videoRef}
              video={{ uri:this.props.media.path}}
              autoplay={true}
              />
              </View>}
            </View>)}}
