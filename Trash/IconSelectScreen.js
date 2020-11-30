import React, { Component } from 'react';
import { View,Image,TouchableHighlight,Text } from 'react-native';
import VideoPlayer from 'react-native-video-player';
import {IconSelect} from '../components/IconSelect.android';
import { ProcessingManager } from 'react-native-video-processing';
import styles from '../StyleSheet'
import ImagePicker from 'react-native-image-crop-picker';
export default class IconSelectPage extends Component {
  constructor(props) {
  super(props);
  // Don't call this.setState() here!
  this.videoRef=React.createRef()
  this.state = { videoSource: this.props.videoSource , currentTime:0,displayImage:null};
}

    /*compressVideo() {
        this.videoPlayerRef.compress(options)
            .then((newSource) => console.log(newSource))
            .catch(console.warn);
    }*/
 static getDerivedStateFromProps(props, state) {
   console.log(props.videoSource,'videosourls')
    return {videoSource: props.videoSource};
  }
componentDidMount(){
  this.setState({videoSource:this.props.videoSource})
      const maximumSize = { width: 300, height: 300 };
    ProcessingManager.getPreviewForSecond(this.state.videoSource,0, maximumSize,'JPEG')
      .then((data) =>{
      this.setState({displayImage:data},console.log(this.state.displayImage))
      })
        if(this.state.currentTime==0){
          console.log(this.state.currentTime)
        setTimeout(()=>{
this.videoRef.current.seek(0);console.log('three')}
           , 2000)}
}
  timeMarkerChanged=(currentTime)=>{
var ben=currentTime
    console.log(parseInt(currentTime),'aslkdjfklfjsl')

    console.log(parseInt(currentTime),'aslkdjfklfjsl')
    if(!isNaN(ben)){
  this.videoRef.current.seek(ben)}
  }
cropSelection=()=>{

      const maximumSize = { width: 300, height: 300 };
    ProcessingManager.getPreviewForSecond(this.state.videoSource,0, maximumSize,'JPEG')
      .then((data) =>{
      this.setState({displayImage:data},this.crop())
      })
  console.log(this.state.displayImage)
}
crop=()=>
{
        ImagePicker.openCropper({
      path: this.state.displayImage.uri,
      width: 200,
      height: 200,
    })
      .then((image) => {
        console.log(image)
        this.props.setIcon(image.path)
        this.cancelPressed()
      })
      .catch((e) => {
        console.log(e);
      });
}
cancelPressed=()=>{
this.props.closeIconPicker();
}
    render() {
        return (
          <>
          <Text> Choose Icon Picture</Text>
          <VideoPlayer
 ref={this.videoRef}
    video={{ uri:this.props.videoSource  }}
hideControlsOnStart
    videoWidth={700}
    muted
    disableSeek
    autoplay={true}
    videoHeight={500}
    thumbnail={{ uri:'https://www.google.com/url?sa=i&url=http%3A%2F%2Fpickatime.com%2F&psig=AOvVaw2iV63QwHmyugVaEEE3fMIH&ust=1602702549158000&source=images&cd=vfe&ved=2ahUKEwjI0aCyorLsAhUB0awKHUcwCNoQr4kDegUIARCmAQ' }}
/>
                  <IconSelect
                  timeMarkerChanged={this.timeMarkerChanged}
                    source={this.state.videoSource}
                    height={100}
                    width={300}
                    onTrackerMove={(e) => console.log(e.currentTime)} // iOS only
                    currentTime={this.state.currentTime} // use this prop to set tracker position iOS only
                    themeColor={'white'} // iOS only
                    thumbWidth={30} // iOS only
                    trackerColor={'green'} // iOS only
                    onChange={(e) => console.log(e.startTime, e.endTime)}
                />
            <View style={{flexDirection:'row'}} >
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={this.cancelPressed}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={this.cropSelection}>
              <Text style={styles.textStyle}>Crop Selection</Text>
            </TouchableHighlight>
            </View>
                </>
        );
    }
}
