
import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Modal, Text,TextInput,StyleSheet,ScrollView,TouchableOpacity,ImageBackground } from 'react-native';
import styles,{draggableGridStyles} from '../StyleSheet'

export default function createButtonSet(props)
{
  return(
  <>

<View style={{justifyContent:'center',flexDirection:'row'}}>
  { (() => {
       if (!props.editMode){
          return ( <><TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>{props.setEditMode(!props.editMode)}}>
              <Text style={styles.textStyle}>EDIT STORE</Text>
            </TouchableHighlight>

    <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>props.signOut()}>
              <Text style={styles.textStyle}>Sign Out</Text>
            </TouchableHighlight></>)
          }
        else {
          if (props.showSave)
          {
            return(
  <>
   <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>props.setModalVisible(!props.modalVisible)}>
              <Text style={styles.textStyle}>Add to Store </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>{props.setStore()}}>
              <Text style={styles.textStyle}>Save State</Text>
            </TouchableHighlight>
    <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>{props.resetState()}}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            </>)}
          else{
            return(
<><TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>props.setModalVisible(!props.modalVisible)}>
              <Text style={styles.textStyle}>Add to Store </Text>
            </TouchableHighlight>
    <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={()=>props.resetState()}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            </>
          )
          }
        }
   })()}
  </View>
   </>
 )
}
