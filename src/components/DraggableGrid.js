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
class MyListItem extends React.PureComponent {
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
       uri:this.props.media.path}}
>
</ImageBackground>

   :

   <View pointerEvents="none">
          <VideoPlayer

    repeat
    videoHeight={styles.height/.3}
 ref={this.videoRef}
    video={{ uri:this.props.media.path  }}
    autoplay={true}
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
  editMode:this.props.editMode,
    };
  }
   render_item=(item:{media:object, key:string,message:string}) =>{
    return (
<View
        key={item.key}
      >
{this.state.editMode?
    <View >
            <TouchableHighlight
            onPress={()=>{
              console.log('zzz')
            }}
              style={{ ...styles.addButton, marginBottom:-15,backgroundColor: "red",left:styles.width/8 }}>
              <Text style={styles.textStyle}>X</Text>
            </TouchableHighlight>
    </View>:null
  }
      <MyListItem media={item.media}/>
        <Text>{item.message}</Text>
      </View>
    );
  }
  gridDataChanged=()=>
  {
const newData= this.state.data.map((item,index) => {
  var newItem=item
  newItem.key=index.toString()
  return newItem;
})
this.setState({data:newData});
  }
  componentDidUpdate(prevProps, prevState) {
  if (prevProps.gridData!== this.props.gridData) {
    console.log(this.props.gridData)
    this.setState({data:this.props.gridData})
  }
  if(prevProps.editMode!=this.props.editMode)
  {
    this.setState({editMode:this.props.editMode})
  }
}
render() {
    return (
      <View style={draggableGridStyles.wrapper}>
        <DraggableGrid
        itemHeight={styles.height/4}
          numColumns={4}
          renderItem={this.render_item}
          data={this.state.data}
          onDragRelease={(data) => {
            this.setState({data}, );// need reset the props data sort after drag release
          }}
        />
      </View>
    );
  }
}
