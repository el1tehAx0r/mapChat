import React, { useState,useEffect,useRef } from 'react';
import { Text, TextInput, View,Button,TouchableHighlight, Image,ScrollView} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-crop-picker'
import CountDown from 'react-native-countdown-component';
import { Form, TextValidator } from 'react-native-validator-form';
import firebaseSDK from '../config/FirebaseSDK'
import VideoPlaybackComponent from './VideoPlaybackComponent'
import VideoPlayer from 'react-native-video-player';
import CarouselComponent from './CarouselComponent';
import styles from '../StyleSheet';
import RadioButtonComponent from './RadioButtonComponent'
const PostViewer= (props) => {
const [posts,setPosts]=useState([]);
const [featuredPosts,setFeaturedPosts]=useState([]);
useEffect(()=>{
var tempReferenceList=[]
  for (var i in props.postViewerInfo.posts){
var postData=getPostData(props.postViewerInfo.posts[i])
postData.['reference']=props.postViewerInfo.posts[i]
tempReferenceList.push(postData)
}},[props.postViewerInfo])
const sortByDate=()=>{

}
const sortByLikes=()=>{

}
const viewOpPosts=()=>{

}
const addVideo=()=>{

}
const cancelPressed=()=>
{
props.closePostViewerModal()
}
  return (
    <View style={{padding: 10}}>
            <TouchableHighlight
              style={{ ...styles.closeButton, position:'absolute',right:0, top:0 }}
              onPress={cancelPressed}>
              <Text style={styles.xTextStyle}>X</Text>
            </TouchableHighlight>
<RadioButtonComponent/>
            <ScrollView>
      <Text style={{ height: 35 }}>
      {props.postViewerInfo.message}
        </Text>
        <CarouselComponent featuredPosts={featuredPosts} posts={posts}/>
{/*props.postViewerInfo.media.mime=="image/jpeg"||props.postViewerInfo.media.mime=="image/png"?
   <Image
     style={{
       paddingVertical: 30,
       width: styles.width/1.5,
       height: styles.height/1.5}}
     resizeMode='cover'
     source={{
       uri:props.postViewerInfo.media.path     }}
   />
   :
          <VideoPlayer
    video={{ uri:props.postViewerInfo.media.path }}
hideControlsOnStart
    videoWidth={styles.width}
    disableSeek
    autoplay={true}
    videoHeight={styles.height}
    thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
/>
*/}
    <View style={{flexDirection:"row"}}>
{/* <DatePicker
        style={{width: '80%'}}
        date={props.postViewerInfo.timestamp.toDate()}
        mode="date"
        placeholder="select expiration date"
        format="YYYY-MM-DDTHH:MM:SSZ"
        minDate="2020-05-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36,
            height:30
          }
          // ... You can check the source to find the other keys.
        }}
      />*/}
      </View>
        </ScrollView>
<View style={{justifyContent:'center',flexDirection:'row'}}>
            <TouchableHighlight
              style={{ ...styles.addButton, backgroundColor: "#2196F3" }}
              onPress={addVideo}>
              <Text style={styles.textStyle}>+</Text>
            </TouchableHighlight>
            </View>
    </View>


  );
}
export default PostViewer;
