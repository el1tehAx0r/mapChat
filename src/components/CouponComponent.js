import React, { useState, useEffect,useRef } from 'react';
import {TouchableOpacity, StyleSheet, Image,Text, SafeAreaView, ScrollView,View,Modal } from 'react-native';
import FirebaseSDK from '../config/FirebaseSDK'
import PostViewer from './PostViewer'

const Separator = () => (
  <View style={styles.separator} />
);
const CouponComponent =(props)=>
{
  const [modalVisible,setModalVisible]=useState(false)
const onPress=()=>
{
  props.onPress(props.couponId)
  console.log(props.claimedCoupons)
  console.log(props.postViewerInfo)
  setModalVisible(true)
  console.log('viewPressed')
}
const closePostViewerModal=()=>
{
  setModalVisible(false)
}

useEffect(()=>
{
  console.log('QEUNING',props.uid)
},[])
return(
<><Separator/>

     <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <PostViewer uid={props.uid} closePostViewerModal={closePostViewerModal}  postViewerInfo={props.postViewerInfo} claimedCoupons={props.claimedCoupons} />
          </View>
        </View>
      </Modal>
<TouchableOpacity onPress={onPress}>
    <View style={{flexDirection:'row'}} >
   <Image
     style={{
       paddingVertical: 30,
       width: 45,
       height: 30,}}
     resizeMode='cover'
     source={{uri:props.imageUrl}}
   />
        <Text style={styles.text}>
        {props.message}
        </Text>
        <Text style={styles.text}>
        {props.expirationDate}
        </Text>
   </View>
   </TouchableOpacity>

<Separator/></>)
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  text: {
    fontSize: 20,
  },

bottomBorder:
{
  flexDirection:'row',flex:2,
  borderBottomColor:'black',
  borderBottomWidth:1  },
    centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width:'90%',
    height:'90%',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
export default CouponComponent
