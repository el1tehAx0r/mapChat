import React, { useState,useEffect,useRef } from 'react';
import { Text, TextInput, View,Button,TouchableHighlight, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker'
import { Form, TextValidator } from 'react-native-validator-form';

import firebaseSDK from '../config/FirebaseSDK'
import styles from '../StyleSheet';
const PostViewer= (props) => {
  const [claimCouponButton,setClaimedCouponButton]=useState(null)
const cancelPressed=()=>
{
props.closePostViewerModal()
}

const claimCoupon=()=>
{
  firebaseSDK.claimCoupon(props.uid,props.postViewerInfo.postId)
}

const unclaimCoupon=()=>
{
  firebaseSDK.unclaimCoupon(props.uid,props.postViewerInfo.postId)
}
const actionButton=()=>
{
  if(props.claimedCoupons.includes(props.postViewerInfo.postId)){
  return (<TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={unclaimCoupon}>
              <Text style={styles.textStyle}>Unclaim Coupon</Text>
            </TouchableHighlight>)
  }
  else {
  return (<TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={claimCoupon}>
              <Text style={styles.textStyle}>Claim Coupon</Text>
            </TouchableHighlight>)
  }
}

useEffect(() => {
    setClaimedCouponButton(actionButton())
}, [props.claimedCoupons])

const isFirstRun = useRef(true);
useEffect (() => {
    if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
    }
    setClaimedCouponButton(actionButton())
}, [props.claimedCoupons]);
  return (
    <View style={{padding: 10}}>

      <Text style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}>
      OP IS: ID {props.postViewerInfo.op}
        </Text>
   <Image
     style={{
       paddingVertical: 30,
       width: 300,
       height: 200,}}
     resizeMode='cover'
     source={{
       uri:props.postViewerInfo.imageUrl}}
   />
    <View style={{flexDirection:"row"}}>
 <DatePicker
        style={{width: '70%'}}
        date={props.postViewerInfo.expirationDate}
        mode="date"
        placeholder="select expiration date"
        format="YYYY-MM-DD"
        minDate="2020-05-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36,
            height:30
          }
          // ... You can check the source to find the other keys.
        }}
      />
      </View>
      <Text style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}>
      {props.postViewerInfo.shopAddress}
        </Text>

      <Text style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}>
      {props.postViewerInfo.message}
        </Text>
    <View style={{flexDirection:"row"}}>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={cancelPressed}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
{claimCouponButton}
</View>
    </View>
  );
}
export default PostViewer;
