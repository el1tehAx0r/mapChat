import React from "react";
import { View, Text,StyleSheet} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import TerritoryMarker from './TerritoryMarker'
import MapView,{Marker,PROVIDER_GOOGLE} from 'react-native-maps';
export default PinStripView=(props)=>
{
const onDrag=()=>{
  props.onDrag
}

const checkDraggable=()=>
{
var markers=[]
      for (var i in props.markerStatuses)
      {
markers.push(<TerritoryMarker
onMarkerDrag={(point)=>{props.onMarkerDrag(point)}}
  getMarkerReleaseCoordinate={(point)=>{props.getMarkerReleaseCoordinate(point)}} color={'#FFFFFF'} size={props.size} x={props.x} y={props.y+i*props.pin_strip_spacing}/>)
}
return markers
}
return(
 <View onDrag={onDrag} style={props.style!=undefined ? props.style: styles.container}>
{checkDraggable()}
      </View>
)
}
const styles=StyleSheet.create({
  container:{flexDirection:'column',
   position: 'absolute',
    bottom: 50,
  height:100,zIndex:10}
})
