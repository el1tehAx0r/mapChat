import React, { useState,useEffect } from 'react';
import { Text,TextInput,View,Button,TouchableHighlight,Image,KeyboardAvoidingView,TouchableOpacity,ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker'
import { Form, TextValidator } from 'react-native-validator-form';

import firebaseSDK from '../config/FirebaseSDK'
import styles from '../StyleSheet';
const CouponCreator= (props) => {
const [postType,setPostType]=useState('');
  const [shopAddress,setShopAddress]=useState(props.postCreatorInfo.shopAddress);
  const [message,setMessage]=useState(props.postCreatorInfo.message);
  const [count,setCount]=useState(props.postCreatorInfo.count);
  const [dropRadius,setDropRadius]=useState(props.postCreatorInfo.dropRadius);
  const [iconUrl,setIconUrl]=useState(props.postCreatorInfo.iconUrl);
  const [expirationDay,setExpirationDay]=useState(null);
  const [expirationDate,setExpirationDate]=useState(props.postCreatorInfo.expirationDate);
  const [expirationTime,setExpirationTime]=useState(null);
  const [imageUrl,setImageUrl]=useState(props.postCreatorInfo.imageUrl);
  const [timePicker,setTimePicker]=useState(null)
useEffect(()=>
{
  if(props.postCreatorInfo.expirationDate!=null)
  {
    setExpirationDate(props.postCreatorInfo.expirationDate.toDate())
  }
},[])
  useEffect(()=>{
    console.log(expirationDay,expirationTime,'BAGOLO')
    if((expirationDay!==null) &&(expirationTime!=null))
    {
    setExpirationDate(combineDateAndTime(expirationDay,expirationTime))
    }
  },[expirationTime,expirationDay])


const combineDateAndTime = function(date, time) {
    var timeString = time.getHours() + ':' + time.getMinutes() + ':00';
    date= new Date(date);
    console.log(date,'kjklsj',time,'THESE')
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Jan is 0, dec is 11
    var day = date.getDate();
    var hours=time.getHours();
    var minutes=time.getMinutes();
    var combined = new Date(year,month,day,hours,minutes,0,0);
    console.log(combined,'WKJSDKLJ')

    return combined;
};
const cancelPressed=()=>
{
props.closePostCreatorModal()
}
  const onPressImageUrl = () => {
ImagePicker.openCamera({
  width: 300,
  height: 200,
  cropping: true
}).then(image => {console.log(image)
  setImageUrl(image.path)
});
}
const showTimePicker =()=>
{
  setTimePicker(
        <RNDateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode={'time'}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />)
}
  const onPressIconUrl= () => {
ImagePicker.openPicker({
  width:65,
  height: 65,
  cropping: true
}).then(image => {
  setIconUrl(image.path)
});
}



const createPost=()=>
{
  props.createPost(props.uid,props.postCreatorInfo.latitude,props.postCreatorInfo.longitude,message,shopAddress,iconUrl,expirationDate,imageUrl,count,dropRadius)
}

  const onChange = (event, selectedTime) => {
    console.log(selectedTime)
    setTimePicker(null)
    setExpirationTime(selectedTime)
  };
  return (
    <ScrollView >
    <View style={{flexDirection:"row"}}>
      </View>
<TouchableHighlight onPress={onPressImageUrl}>
   <Image
     style={{
       paddingVertical: 30,
       width: 300,
       height: 200,}}
     resizeMode='cover'
     source={{
       uri:imageUrl,
     }}
   />
</TouchableHighlight>
    <View style={{flexDirection:"row"}}>
 <DatePicker
        style={{width: '100%'}}
        date={expirationDate}
        mode="date"
        placeholder={'pick expiration date'}
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
            paddingBottom:10,
            marginLeft: 36,
            height:30
          }}}
        onDateChange={(date) => {setExpirationDay(date);showTimePicker();}}
      />
      {timePicker}
      </View>
      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Description"
        onChangeText={message=> setMessage(message)}
        defaultValue={props.postCreatorInfo.message}
      />

      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Count"
        onChangeText={message=> setMessage(message)}
        defaultValue={props.postCreatorInfo.message}
      />
      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Distance From"
        onChangeText={message=> setMessage(message)}
        defaultValue={props.postCreatorInfo.message}
      />
    <View style={{flexDirection:"row"}}>
      </View>
      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Address of Store"
        onChangeText={shopAddress=> setShopAddress(shopAddress)}
        defaultValue={props.postCreatorInfo.shopAddress}/>

<View style={{flexDirection:'row'}}>

<TouchableHighlight onPress={onPressIconUrl}>
   <Image
     style={{
       width: 65,height:65,
       }}
     resizeMode='cover'
     source={{
       uri:iconUrl,
     }}
   />
</TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={cancelPressed}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={createPost}
            >
              <Text style={styles.textStyle}>Create Post</Text>
            </TouchableHighlight>
            </View>
    </ScrollView>
  );
}
export default CouponCreator;
