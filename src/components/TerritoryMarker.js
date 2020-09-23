import React, {useState} from "react";
import { View, Text,StyleSheet} from "react-native";
import {Icon} from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView,{Marker,PROVIDER_GOOGLE} from 'react-native-maps';
import Draggable from 'react-native-draggable';
export default TerritoryMarker=(props)=>
{
const [draggable,setDraggable]=useState(false)
const getMarkerReleaseCoordinate=(point)=>
{
 props.getMarkerReleaseCoordinate(point)
}
const onMarkerDrag=(point)=>
{
  props.onMarkerDrag(point)
}
const checkDraggable=()=>
{
    return (
      <Draggable position={'absolute'} x={props.x} y={props.y}
onDrag={(event,gestureState)=>{onMarkerDrag({x:gestureState.moveX,y:gestureState.moveY})}}
      onDragRelease={(event,gestureState,bounds)=>
      {
        getMarkerReleaseCoordinate({x:bounds.left,y:bounds.top})
      }}><Icon
      style={{elevation:10}}
size={props.size}
  name='map-marker'
  type='font-awesome'
  color='black'
/></Draggable>)
}
  return(
    checkDraggable()
)
}

const styles=StyleSheet.create({
  container:{flexDirection:'column',
   position: 'absolute',
    bottom: 50,
  height:100,zIndex:10}
})
