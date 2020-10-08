import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Modal, Text,TextInput,StyleSheet,Picker } from 'react-native';
import ModalContainer from '../components/ModalContainer'
import CouponCreator from '../components/CouponCreator'
import auth from '@react-native-firebase/auth';
import {DisplayName }from '../components/DisplayName.js'
import ChatScreen from './ChatScreen.js'
 import PhotoUpload from 'react-native-photo-upload'
 import ImagePicker from 'react-native-image-crop-picker';
 import PP from '../components/ProfilePic.js'
 import {GetUserInfo} from '../components/UserInfo.js'
 import Utility from '../config/Utility'
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
function CouponManager(props,{navigation}) {
  const [sortFilter,setSortFilter]=useState('Date')
  const [postCreatorInfo,setPostCreatorInfo]=useState({expirationDate:null,message:'',op:'',imageUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d',iconUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d'});
  const [postModalVisible,setPostModalVisible]=useState(false)
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
const createCoupon=()=>
{
setPostModalVisible(true)
}
const randomLocationPlacer=(lat,long,distance)=>
{
  for i in
}
const crtPost=(uid,latitude,longitude,message,shopAddress,iconUrl,expirationDate,imageUrl,count,distanceFilter)=>
  {
    firebaseSDK.createCouponGroup(uid,latitude,longitude,message,shopAddress,iconUrl,expirationDate,imageUrl,count,distanceFilter).then((post)=>{
      var postId=post._document._documentPath._parts[1]
      var remotePath='couponPic/'+postId
      var localPath=imageUrl.toString()
      var collectionName='Posts'
      var documentName=postId
      var field='imageUrl'
      firebaseSDK.addToStorage(remotePath,localPath,collectionName,documentName,field)
      var remotePath='iconUrl/'+postId
      var localPath=iconUrl.toString()
      var collectionName='Posts'
      var documentName=postId
      var field='iconUrl'
      firebaseSDK.addToStorage(remotePath,localPath,collectionName,documentName,field)
      closePostCreatorModal()})
    }
        const closePostCreatorModal=()=>
        {
          setPostCreatorInfo({expirationDate:null,message:'',op:'',imageUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d',iconUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d'})
          setPostModalVisible(false)
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
<Button title="createCoupon" onPress={createCoupon}></Button>
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

          <ModalContainer modalVisible={postModalVisible}>
            <CouponCreator circleCenters={props.circleCenters} postCreatorInfo={postCreatorInfo}  uid={props.uid}  createPost={crtPost} closePostCreatorModal={closePostCreatorModal}></CouponCreator>
            </ModalContainer>
        {<CouponContainerComponent  activatedCoupons={props.activatedCoupons} sortFilter={sortFilter} key={props.uid} uid={props.uid} coupons={myPosts}/>}
        </View>
    </View>
  );
}

export default CouponManager;
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
