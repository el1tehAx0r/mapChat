import React, { useState,useEffect,useRef } from 'react';
import { Text, TextInput, View,Button,TouchableHighlight, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-crop-picker'
import CountDown from 'react-native-countdown-component';
import { Form, TextValidator } from 'react-native-validator-form';
import firebaseSDK from '../config/FirebaseSDK'
import styles from '../StyleSheet';
const CouponViewerCreator= (props) => {
  const [claimCouponButton,setClaimedCouponButton]=useState(null)
  const [countDownTimer,setCountDownTimer]=useState(null)
  const [expirationDate,setExpirationDate]=useState(null)
const cancelPressed=()=>
{
props.closePostViewerModal()
}
const deletePressed=()=>
{
props.deletePressed()  
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
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={deletePressed}>
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableHighlight>
</View>
    </View>
  );
}
export default CouponViewerCreator;
