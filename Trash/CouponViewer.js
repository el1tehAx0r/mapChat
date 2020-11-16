import React, { useState,useEffect,useRef } from 'react';
import { Text, TextInput, View,Button,TouchableHighlight, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-crop-picker'
import CountDown from 'react-native-countdown-component';
import { Form, TextValidator } from 'react-native-validator-form';
import firebaseSDK from '../config/FirebaseSDK'
import styles from '../StyleSheet';
const PostViewer= (props) => {
  const [claimCouponButton,setClaimedCouponButton]=useState(null)
  const [countDownTimer,setCountDownTimer]=useState(null)
  const [expirationDate,setExpirationDate]=useState(null)
const cancelPressed=()=>
{
props.closePostViewerModal()
}

const claimCoupon=()=>
{
  firebaseSDK.claimCoupon(props.uid,props.postViewerInfo.postId)
  cancelPressed()
}
const activateButtonPressed=()=>{
var timeStamp=new Date()
console.log(timeStamp)
firebaseSDK.activateCoupon(props.uid,props.postViewerInfo.postId,timeStamp)
    setCountDownTimer(
      <CountDown
        until={300}
        onFinish={() =>setCountDownTimer(<Text>CouponBeenCLaimed</Text>)}
        size={20}/>)
}
const unclaimCoupon=()=>
{
  console.log(props.uid,props.postViewerInfo.postId)
  firebaseSDK.unclaimCoupon(props.uid,props.postViewerInfo.postId)
  cancelPressed()
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
const findByKey=(item,objectList,key)=>
{
for (var i in objectList)
{
    if (item==objectList[i][key])
    {
      return i
    }
    else{
      continue
    }
}
return -1;
    }

useEffect(()=>
{
  console.log('RRRRR')
  console.log(props.postViewerInfo.expirationDate.toDate().toString())
  var itemIndex=findByKey(props.postViewerInfo.postId, props.activatedCoupons,'postId')
  console.log(itemIndex)
var claimed=  props.claimedCoupons.includes(props.postViewerInfo.postId)
console.log(claimed)
if(claimed){
  if(itemIndex!=-1)
  {
var activatedTime=props.activatedCoupons[itemIndex].timeStamp.toDate()
    var currentTime= new Date()
    var antiTimeLeft=currentTime-activatedTime
    var timeLeft=300-antiTimeLeft/1000
    if (timeLeft<=0)
    {
      setCountDownTimer(<Text>You have used this coupon unclaim to remove from you coupons</Text>)
    }
    else{
    setCountDownTimer(
      <CountDown
        until={timeLeft}
        onFinish={() => setCountDownTimer(<Text>CouponBeenCLaimed</Text>)}
        size={20}/>)
    }
  }
    else{
  setCountDownTimer(<TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={activateButtonPressed}>
              <Text style={styles.textStyle}>3 minute activation do not click till at the store and ready to redeem</Text>
            </TouchableHighlight>)}}
},[])

useEffect(() => {
  var itemIndex=findByKey(props.postViewerInfo.postId, props.activatedCoupons)
  if(itemIndex!=-1&&claimed)
  {
    var activatedTime=props.acitvatedCoupons[itemIndex][props.postViewerInfo.postId].toDate()
    var currentTime= new Date()
    var antiTimeLeft=activatedTime-currentTime
    var timeLeft=300-antiTimeLeft
    if (timeLeft<=0)
    {
      console.log('game over')
    }
    else{
    setCountDownTimer(
      <CountDown
        until={timeLeft}
        onFinish={() => setCountDownTimer(<Text>CouponBeenCLaimed</Text>)}
        size={20}/>)
    }
  }
}, [props.activatedCoupons])
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
        style={{width: '80%'}}
        date={props.postViewerInfo.expirationDate.toDate()}
        mode="date"
        placeholder="select expiration date"
        format="YYYY-MM-DDTHH:MM:SSZ"
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

{countDownTimer}
    </View>
  );
}
export default PostViewer;
