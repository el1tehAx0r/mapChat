import React, { useState,useEffect } from 'react';
import { Text,TextInput,View,Button,TouchableHighlight,Image,KeyboardAvoidingView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker'
import { Form, TextValidator } from 'react-native-validator-form';

import firebaseSDK from '../config/FirebaseSDK'
import styles from '../StyleSheet';
const PostCreator= (props) => {
const [postType,setPostType]=useState('');
  const [shopAddress,setShopAddress]=useState(props.postCreatorInfo.shopAddress);
  const [message,setMessage]=useState(props.postCreatorInfo.message);
  const [iconUrl,setIconUrl]=useState(props.postCreatorInfo.iconUrl);
  const [expirationDate,setExpirationDate]=useState(props.postCreatorInfo.expirationDate);
  const [imageUrl,setImageUrl]=useState(props.postCreatorInfo.imageUrl);
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
  setIconUrl(image.path)
});
}
const editPost=()=>
{
  firebaseSDK.editPost(props.postCreatorInfo.postId,message,shopAddress,iconUrl,expirationDate,imageUrl)
}
const deletePost=()=>
{
firebaseSDK.deletePost(props.uid,props.postCreatorInfo.postId)
cancelPressed()
}
const setFinalButtons=()=>
{
  console.log(props.postCreatorInfo.isEditing,'RRRR')
  if(props.postCreatorInfo.isEditing){
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

useEffect(()=>{console.log(expirationDate);console.log(props.postCreatorInfo,'BRRR')},[])

const createPost=()=>
{

  props.createPost(props.uid,props.postCreatorInfo.latitude,props.postCreatorInfo.longitude,message,shopAddress,iconUrl,expirationDate,imageUrl)
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

 <DatePicker
        style={{width: '70%'}}
        date={expirationDate}
        mode="date"
        placeholder={'select expiration date'}
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
            {setFinalButtons()}
            </View>
    </View>
  );
}
export default PostCreator;
