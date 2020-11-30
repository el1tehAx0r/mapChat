import * as React from 'react';
import VideoPlaybackComponent from './VideoPlaybackComponent'
import {
  Text,Image,
  View,
  SafeAreaView } from 'react-native';
import VideoPlayer from 'react-native-video-player';
  import styles from '../StyleSheet'
import Carousel from 'react-native-snap-carousel';
class MyListItem extends React.PureComponent {
  render() {
    return (
          <View style={{backgroundColor:'floralwhite',
              borderRadius: 5,
              padding: 50}}>
{this.props.media.mime=="image/jpeg"||this.props.media.mime=="image/png"?
   <Image
     style={{
       paddingVertical: 30,
       width: styles.width/1.8,
       height: styles.height/1.8}}
     resizeMode='cover'
     source={{
       uri:this.props.media.path}}
   />
   :

          <VideoPlayer
 ref={this.videoRef}
    video={{ uri:this.props.media.path  }}
    videoWidth={700}
    autoplay={true}
    videoHeight={500}
    thumbnail={{ uri:'https://www.google.com/url?sa=i&url=http%3A%2F%2Fpickatime.com%2F&psig=AOvVaw2iV63QwHmyugVaEEE3fMIH&ust=1602702549158000&source=images&cd=vfe&ved=2ahUKEwjI0aCyorLsAhUB0awKHUcwCNoQr4kDegUIARCmAQ' }}
/>
}
          </View>
    )
  }
}
export default class CarouselComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          activeIndex:0,
          carouselItems: [
          {
              title:"Item 1",
              text: "Text 1",
          },
          {
              title:"Item 2",
              text: "Text 2",
          },
          {
              title:"Item 3",
              text: "Text 3",
          },
          {
              title:"Item 4",
              text: "Text 4",
          },
          {
              title:"Item 5",
              text: "Text 5",
          },
        ]
      }
    }
componentDidMount(){
  if (this.props.boardPosts!=null)
  {
    console.log(this.props.boardPosts)
    console.log(this.props.boardPosts.length,'sjdlkjslpenisPENISZZZZZZZZZZZZ')
  }
}
componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
//  console.log(this.props.boardPosts.length,'YAYAYY')
 // console.log(prevProps.boardPosts.length,'OMG')
/*  if (this.props.boardPosts!== prevProps.boardPost) {
    //this.fetchData(this.props.userID);
  }*/
}
    _renderItem({item,index}){
        return (
          <MyListItem media={item.media}/>
        )
    }
    render() {
        return (
                <Carousel
                  layout={"default"}
                  ref={ref => this.carousel = ref}
                  data={this.props.boardPosts}
                  sliderWidth={300}
                  itemWidth={300}
                  renderItem={this._renderItem}
                  onSnapToItem = { index => this.setState({activeIndex:index}) } />
        );
    }
}
