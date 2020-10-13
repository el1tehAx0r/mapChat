import React, { Component } from 'react';
import { View,Image } from 'react-native';
import VideoPlayer from 'react-native-video-player';
import {IconSelect} from '../components/IconSelect.android';
import { ProcessingManager } from 'react-native-video-processing';
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

      this.videoRef.current.seek(3);
      this.videoRef.current.pause();

  /*  ProcessingManager.getPreviewForSecond(this.props.videoSource, 0, maximumSize)
      .then((data) =>{ console.log(data)})*/
}

  timeMarkerChanged=(currentTime)=>{
var ben=currentTime
    console.log(parseInt(currentTime),'aslkdjfklfjsl')

    console.log(parseInt(currentTime),'aslkdjfklfjsl')
    if(!isNaN(ben)){
  this.videoRef.current.seek(ben)}
  }


    render() {
        return (
          <>
          <VideoPlayer
 ref={this.videoRef}
    video={{ uri:this.props.videoSource  }}
hideControlsOnStart
    videoWidth={900}
    muted
    disableSeek
    autoplay={true}
    videoHeight={1200}
    thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
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
                </>
        );
    }
}
