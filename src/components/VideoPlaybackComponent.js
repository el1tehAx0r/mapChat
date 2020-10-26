import React, { Component } from 'react';
import { View } from 'react-native';
import { VideoPlayer} from 'react-native-video-processing';
import {Trimmer} from './Trimmer.android';
import { ProcessingManager } from 'react-native-video-processing';
export default class VideoPlayerComponent extends Component {
  constructor(props) {
  super(props);
  // Don't call this.setState() here!
  this.state = { videoSource: this.props.videoSource , currentTime:0};
}
    trimVideo() {
        const options = {
            startTime: 0,
            endTime: 15,
            quality: VideoPlayer.Constants.quality.QUALITY_1280x720, // iOS only
            saveToCameraRoll: true, // default is false // iOS only
            saveWithCurrentDate: true, // default is false // iOS only
        };
        this.videoPlayerRef.trim(options)
            .then((newSource) => console.log(newSource))
            .catch(console.warn);
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
  console.log(this.props.videoSource,'vidsourc')
}
    getPreviewImageForSecond(second) {
        const maximumSize = { width: 640, height: 1024 }; // default is { width: 1080, height: 1080 } iOS only
        this.videoPlayerRef.getPreviewForSecond(second, maximumSize) // maximumSize is iOS only
        .then((base64String) => console.log('This is BASE64 of image', base64String))
        .catch(console.warn);
    }
    getVideoInfo() {
        this.videoPlayerRef.getVideoInfo()
        .then((info) => console.log(info))
        .catch(console.warn);
    }

    render() {
        return (
          <>
                <VideoPlayer
                    ref={ref => this.videoPlayerRef = ref}
                    startTime={3}  // seconds
                    endTime={10}   // seconds
                    source={this.state.videoSource}
                    playerWidth={300} // iOS only
                    playerHeight={500} // iOS only
                    height={300}
                    resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
                    onChange={({ nativeEvent }) =>{this.setState({currentTime:nativeEvent});console.log(this.props.videoSource);console.log({ nativeEvent })
                  }} // get Current time on every second
                />
                </>
        );
    }
}
