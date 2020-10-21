import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,TouchableHighlight,
TouchableOpacity,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import { DraggableGrid } from 'react-native-draggable-grid';
import styles,{draggableGridStyles} from '../StyleSheet'
class MyListItem extends React.PureComponent {
  render() {
    return (
          <View
     style={{
              borderRadius: 5,
              backgroundColor:'red',
       width: styles.width/5,
       height: styles.height/5}}
              >
{this.props.media.mime=="image/jpeg"||this.props.media.mime=="image/png"?
   <Image
     style={{
       width: styles.width/5,
       height: styles.height/5}}
     resizeMode='cover'
     source={{
       uri:this.props.media.path}}
   />
   :

   <View pointerEvents="none">
          <VideoPlayer

    videoHeight={styles.height/.3}
 ref={this.videoRef}
    video={{ uri:this.props.media.path  }}
    autoplay={true}
    thumbnail={{ uri:'https://www.google.com/url?sa=i&url=http%3A%2F%2Fpickatime.com%2F&psig=AOvVaw2iV63QwHmyugVaEEE3fMIH&ust=1602702549158000&source=images&cd=vfe&ved=2ahUKEwjI0aCyorLsAhUB0awKHUcwCNoQr4kDegUIARCmAQ' }}
/>

</View>
}
          </View>
    )
  }
}
export default class DraggableGridComponent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
  data:this.props.gridData,
    };
  }
   render_item(item:{media:object, key:string,message:string}) {
    return (
<View
        key={item.key}
      >
      <MyListItem media={item.media}/>
        <Text>{item.message}</Text>
      </View>
    );
  }
  componentDidUpdate(prevProps, prevState) {
  if (prevProps.gridData!== this.props.gridData) {
    console.log(this.props.gridData)
    this.setState({data:this.props.gridData})
  }
}
render() {
    return (
      <View style={draggableGridStyles.wrapper}>
        <DraggableGrid
          numColumns={4}
          renderItem={this.render_item}
          data={this.state.data}
          onDragRelease={(data) => {
            this.setState({data});// need reset the props data sort after drag release
          }}
        />
      </View>
    );
  }
}
