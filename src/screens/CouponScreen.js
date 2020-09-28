import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Modal, Text,TextInput,StyleSheet,Picker } from 'react-native';
import auth from '@react-native-firebase/auth';
import {DisplayName }from '../components/DisplayName.js'
import ChatScreen from './ChatScreen.js'
 import PhotoUpload from 'react-native-photo-upload'
 import ImagePicker from 'react-native-image-crop-picker';
 import PP from '../components/ProfilePic.js'
 import {GetUserInfo} from '../components/UserInfo.js'
 import MapPage from './MapScreen.js';
 import TabBar from "@mindinventory/react-native-tab-bar-interaction";
 import CouponContainerComponent from '../components/CouponContainerComponent';
 import storage from '@react-native-firebase/storage';
 import firestore from '@react-native-firebase/firestore';
 import firebase from '@react-native-firebase/app';
 import firebaseSDK from '../config/FirebaseSDK';
 import {
  TextField,
  FilledTextField,
  OutlinedTextField2,
} from 'react-native-material-textfield';
import Geolocation from '@react-native-community/geolocation';

const Separator = () => (
  <View style={styles.separator} />
);
//Geolocation.getCurrentPosition(info => console.log(info));
function CouponPage(props,{navigation}) {
  const [sortFilter,setSortFilter]=useState(null)
  const [myPosts,setMyPosts]=useState([])
  const [claimedCoupons,setClaimedCoupons]=useState([])
  const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the cfamera");
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

const onChangeText=(value)=>{
  setDisplayName(value)
}

  useEffect(() => {
    setClaimedCoupons(props.claimedCoupons)
  }, [props.claimedCoupons])

  useEffect(() => {
    setMyPosts(props.myPosts)
  }, [props.myPosts])
const signOut=()=>
{
  auth()
  .signOut()
  .then(() => console.log('User signed out!'));
}
  return (
    <View style={{flex:1,flexDirection:'column'}}>
         <View style={styles.bottomBorder}>
            <Picker
        selectedValue={'Date'}
        style={{ height: 50, width: '70%' }}
        onValueChange={(itemValue, itemIndex) => sortFilter(itemValue)}
      >
        <Picker.Item label="Date (Expire first list first)" value="Date" />
        <Picker.Item label="Distance" value="Distance" />
      </Picker>
         </View>
         <Separator/>
        <View style={{flex:5,}}>
        {<CouponContainerComponent sortFilter={sortFilter} key={props.uid} uid={props.uid} coupons={claimedCoupons}/>}
        </View>
    </View>
  );
}

export default CouponPage;
const styles=StyleSheet.create({
  container: {
   ...StyleSheet.absoluteFillObject,
   height: 400,
   width: 400,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bottomBorder:
  {
    flexDirection:'row',flex:1,}
})
/*const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});*/
