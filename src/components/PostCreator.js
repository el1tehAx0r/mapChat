import React, { useState,useEffect } from 'react';
import { Text, TextInput, View,Button,TouchableHighlight, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker'
import { Form, TextValidator } from 'react-native-validator-form';

import firebaseSDK from '../config/FirebaseSDK'
import styles from '../StyleSheet';
const PostCreator= (props) => {
  const [text, setText] = useState('');
const [date,setDate]=useState('')
const [postType,setPostType]=useState('');
  const [iconMessage,setIconMessage]=useState('https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d');
  const [shopAddress,setShopAddress]=useState('');
  const [message,setMessage]=useState('');
  const [couponCode,setCouponCode]=useState('');
  const [iconUrl,setIconUrl]=useState('https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d');
  const [expirationDate,setExpirationDate]=useState(null);
  const [imageUrl,setImageUrl]=useState('https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d');
const cancelPressed=()=>
{
props.closePostCreatorModal()
}
  const onPressImageUrl = () => {
ImagePicker.openPicker({
  width: 300,
  height: 200,
  cropping: true
}).then(image => {console.log(image)
  setImageUrl(image.path)
});
}

  const onPressIconUrl= () => {
ImagePicker.openPicker({
  width:65,
  height: 65,
  cropping: true
}).then(image => {
  setIcon(image)
});
}
const editPost=()=>
{
  firebaseSDK.editPost(props.postCreatorInfo.postId,message,shopAddress,iconUrl,expirationDate,imageUrl)
}
const deletePost=()=>
{
//firebaseSDK.deletePost(props.postCreatorInfo.postId)
}
const setFinalButtons=()=>
{
  console.log(props.isEditingPost,'RRRR')
  if(props.isEditingPost){
  return (

    <>
          <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={editPost}
            >
              <Text style={styles.textStyle}>Save Edits</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={deletePost}
            >
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableHighlight></>
  )}
  else{
  return(
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={createPost}
            >
              <Text style={styles.textStyle}>Create Post</Text>
            </TouchableHighlight>
  )
}

}

useEffect(()=>{console.log(expirationDate);console.log(props.postCreatorInfo,'BRRR')},[expirationDate])

const createPost=()=>
{

  props.crtPost(props.uid,props.latitude,props.longitude,message,shopAddress,iconUrl,expirationDate,imageUrl)
}
  return (
    <View style={{padding: 10}}>
<DropDownPicker
    items={[{label: 'Coupon Image', value: 'coupon_image', icon: () => <Icon name="flag" size={15} color="#900" />},
        {label: 'Coupon Video', value: 'coupon_video', icon: () => <Icon name="flag" size={15} color="#900" />},
        {label: 'Postnot implemented ', value: 'coupon_video', icon: () => <Icon name="flag" size={15} color="#900" />},
        {label: 'Postnot implemented', value: 'coupon_video', icon: () => <Icon name="flag" size={15} color="#900" />}, ]}
    defaultValue={null}
    placeholder={'select post type'}
    containerStyle={{height:'12%'}}
    style={{backgroundColor: '#fafafa'}}
    itemStyle={{
        justifyContent: 'flex-start'
    }}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => setPostType(item)}/>
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
      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Coupon Code"
        onChangeText={text => setCouponCode(text)}
        defaultValue={props.postCreatorInfo.message}
      />

 <DatePicker
        style={{width: '70%'}}
        date={expirationDate}
        mode="date"
        placeholder={props.postCreatorInfo.expirationDate}
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
        onDateChange={(date) => {setExpirationDate(date);}}
      />
      </View>

      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Description"
        onChangeText={text => setMessage(text)}
        defaultValue={props.postCreatorInfo.message}
      />
    <View style={{flexDirection:"row"}}>

      </View>

      <TextInput
        style={{ height: 35, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Address of Store"
        onChangeText={text => setShopAddress(text)}
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
            {setFinalButtons()}
            </View>
    </View>
  );
}
export default PostCreator;
