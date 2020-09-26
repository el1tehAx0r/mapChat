import React, { useState, useEffect,useRef } from 'react';
import {Modal,ScrollView,Button,Dimensions, Animated,TouchableHighlight, View,Image, Text,TextInput,StyleSheet,TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import {DisplayName }from '../components/DisplayName.js'
import ImagePicker from 'react-native-image-crop-picker';
import RNDeviceHeading from 'react-native-device-heading'
import PP from '../components/ProfilePic.js'
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import {GetUserInfo} from '../components/UserInfo.js'
import MapView,{Marker,PROVIDER_GOOGLE,Circle} from 'react-native-maps';
import TabBar from "@mindinventory/react-native-tab-bar-interaction";
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserMarker from "../components/UserMarker";
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import * as geofirestore from 'geofirestore';
import firebaseSDK from '../config/FirebaseSDK'
import PinStripView from '../components/PinStripView'
import PostMarker from '../components/PostsMarker.js'
import PostCreator from '../components/PostCreator'
import PostViewer from '../components/PostViewer'
import {
  TextField,
  FilledTextField,
  OutlinedTextField2,
} from 'react-native-material-textfield';
import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height*0.25;
const CARD_WIDTH = width * 0.7;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const PIN_STRIP_HEIGHT='20%';
const PIN_STRIP_HEIGHT_PIXELS=0.35*height;
const PIN_STRIP_WIDTH='12%';
const MARKER_SIZE=width*0.1;
const MARKER_X_POSITION=(0.12*width)/2-MARKER_SIZE/4
const GeoFirestore=geofirestore.initializeApp(firestore());
function MapPage(props,{navigation}) {
  const [coordinates,setCoordinates]=useState({latitude:5,longitude:5})
  const [myRegion,setMyRegion]=useState({latitude:5,longitude:5,longitudeDelta:1,latitudeDelta:1})
  const [nearbyPosts,setNearbyPosts]=useState([])
  const [nearbyCoupons,setNearbyCoupons]=useState([]);
  const [postCenters, setPostCenters]=useState([])
  const [circleCenters,setCircleCenters]=useState([])
  const [claimedCoupons,setClaimedCoupons]=useState([])
  const [modalVisible,setModalVisible]=useState(false)
  const [postModalVisible,setPostModalVisible]=useState(false)
  const [postViewerInfo,setPostViewerInfo]=useStateWithCallbackLazy(false);
  const [bullshit,setBullshit]=useStateWithCallbackLazy(false);
  const [postCreatorInfo,setPostCreatorInfo]=useStateWithCallbackLazy({expirationDate:null,message:'',op:'',imageUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d',iconUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d'});
  const [myPosts,setMyPosts]=useStateWithCallbackLazy([])
  const mapViewRef=useRef(null);
  const [mapInitialized,setMapInitialized]=useState(false);
  const [latitudeClicked,setLatitudeClicked]=useStateWithCallbackLazy(1);
  const [longitudeClicked,setLongitudeClicked]=useStateWithCallbackLazy(1);
  const [postCreator,setPostCreator]=useState(null)
  const [createdCoupons,setCreatedCoupons]=useState(false);
  const [test,setTest]=useState(props.claimedCoupons);
  const [deviceHeading,setDeviceHeading]=useState(1);
  const [editingPost,setEditingPost]=useStateWithCallbackLazy(false)
  let postUnsub;
  let myPostUnsub;
  let watchId;
  const updateSelfLocation=()=>
  {

    RNDeviceHeading.start(20, degree => {
      setDeviceHeading(degree)
      //   console.log(degree,"degrees rotated")
    });
    watchId=Geolocation.watchPosition((position)=>
    {
      if(postUnsub!=undefined)
      {
        postUnsub()
        postUnsub=null;
      }
      firestore().collection('Users').doc(props.uid).update({coordinates:new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
      firestore().collection('Users').doc(props.uid).update({'g.geopoint':new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
      setCoordinates({latitude:position.coords.latitude,longitude:position.coords.longitude})
      mapObjectGrabber({latitude:position.coords.latitude,longitude:position.coords.longitude})
    },(err)=>{console.log(err)},{distanceFilter:5, enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })
  }
const crtPost=(uid,latitude,longitude,message,shopAddress,iconUrl,expirationDate,imageUrl)=>
  {
    firebaseSDK.createPost(uid,latitude,longitude,message,shopAddress,iconUrl,expirationDate,imageUrl).then((post)=>{
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
/* const editPost=(uid,postId,message,shopAddress,iconUrl,expirationDate,imageUrl)=>
  {
  firebaseSDK.editPost(props.postCreatorInfo.postId,message,shopAddress,iconUrl,expirationDate,imageUrl)
    firebaseSDK.createPost(uid,latitude,longitude,message,shopAddress,iconUrl,expirationDate,imageUrl).then((post)=>{
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
    }*/
    const getUserPosts=()=>
    {
      myPostUnsub= firestore()
      .collection('Users')
      .doc(props.uid).onSnapshot(documentSnapshot => {
        try{
          var userPosts=documentSnapshot.data().myPosts.map((post, index)=>{
            return post._documentPath._parts[1]
          })
          setMyPosts(userPosts)
        }
        catch{}
        try{
          var userClaimedCoupons=documentSnapshot.data().claimedCoupons.map((post, index)=>{
            return(post._documentPath._parts[1])
          })
          setClaimedCoupons(userClaimedCoupons)
        }
        catch{
          console.log('didntwork')
        }
      });
    }
    const mapObjectGrabber=(coordinates)=>
    {
      const postgeocollection = GeoFirestore.collection('Posts');
      console.log(postgeocollection,'postgeo')
      const postquery = postgeocollection.near({ center: new firebase.firestore.GeoPoint(coordinates.latitude,coordinates.longitude), radius: 1000000 });
      postUnsub=postquery.onSnapshot((dog)=>{
        console.log(dog.docs,'benten1')
        var jsxPostsMarkers=[]
        var jsxPostMarkersTemp=dog.docs.map((markerInfo,index)=>{
          return <PostMarker circleCenters={circleCenters} key={index} coordinate={{latitude:markerInfo.data().coordinates.latitude,longitude:markerInfo.data().coordinates.longitude}}/>
        })
        var centerPoints=dog.docs.map((markerInfo,index)=>{
          return {latitude:markerInfo.data().coordinates.latitude,longitude:markerInfo.data().coordinates.longitude, id:markerInfo.id,}
        })
        setCircleCenters(centerPoints)
        jsxPostsMarkers=jsxPostMarkersTemp
        setNearbyPosts(jsxPostsMarkers)
        console.log(dog.docs.length,'sdjflsjdkfs')
        if(dog.docs.length==0)
        {
          setCircleCenters([])
          setNearbyPosts([])
        }
      })
    }
    // Set an initializing state whilst Firebase connects
    function getDistanceFromLatLonInm(lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1);
      var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = (R * c)*1000; // Distance in km
      return d;
    }

    const insideCircle=(lat1,lon1,lat2,lon2,radius)=>
    {
      if(getDistanceFromLatLonInm(lat1,lon1,lat2,lon2)<radius)
      {
        return true
      }
      else{
        return false
      }
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
    function GetFormattedDate() {
      var todayTime = new Date();
      var month = format(todayTime .getMonth() + 1);
      var day = format(todayTime .getDate());
      var year = format(todayTime .getFullYear());
      return year+ "-" + month+ "-" + date;
    }

    const openCreatePostModal=(lat,long)=>
    {
console.log('lskdjl')
    var postObject={}
    postObject=postCreatorInfo;
    console.log(postObject)
    setPostCreatorInfo({latitude:lat,longitude:long,expirationDate:null,message:'',op:'',imageUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d',iconUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d'}
,()=>{console.log('jk');setPostModalVisible(true)})
      }
      const createPost=(point)=>
      {
        if (circleCenters.length!=0)
        {
          for( var i in circleCenters)
          {
            if (getDistanceFromLatLonInm(circleCenters[i].latitude,circleCenters[i].longitude,point.coordinate.latitude,point.coordinate.longitude)>20)
            {
              if ((i==(circleCenters.length-1)))
              {
console.log('zzz')
                openCreatePostModal(point.coordinate.latitude,point.coordinate.longitude)
              }
            }
            else{
              break;
            }
          }
        }
        else{
                openCreatePostModal(point.coordinate.latitude,point.coordinate.longitude)
        }

      }

      const requestLocationPermission= async () => {
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
            console.log("You can use the camera");
          } else {
            console.log("Camera permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      };

      useEffect(()=>{
        //getUserPosts();
        updateSelfLocation();
        return () => {
          console.log('yaypoo')
          Geolocation.clearWatch(watchId);
          Geolocation.stopObserving()
          if(postUnsub!=undefined)
          {
            postUnsub()
            postUnsub=null;
          }
          if(myPostUnsub!=undefined)
          {
            myPostUnsub()
            myPostUnsub=null;
          }
        }
      },[])
      useEffect(()=>{
        setClaimedCoupons(props.claimedCoupons)
        console.log(props.claimedCoupons)
      },[props.claimedCoupons])
      useEffect(()=>
    {
      setMyPosts(props.myPosts)
        console.log(props.myPosts)
    },[props.myPosts])

      const onDrag=()=>{
        console.log('fuck')
      }
      function _renderItem({item,index}){
        return (
          <View style={{
            backgroundColor:'floralwhite',
            borderRadius: 5,
            height: 250,
            padding: 50,
            marginLeft: 25,
            marginRight: 25, }}>
            <Text style={{fontSize: 30}}>{item.title}</Text>
            <Text>{item.text}</Text>
            </View>

          )
        }
        const mapViewPressed=(coordinates)=>
        {
          for (var i in circleCenters)
          {
            if (getDistanceFromLatLonInm(circleCenters[i].latitude,circleCenters[i].longitude,coordinates.latitude,coordinates.longitude)<10)
            {
              console.log(myPosts,'AAAAA')
              if(myPosts.includes(circleCenters[i].id))
              {
                var circleCenterId=circleCenters[i].id
                firebaseSDK.getPost(circleCenters[i].id).then((postObject)=>{var postObj=postObject.data();postObj.postId=circleCenters[i].id;postObj.isEditing=true; setPostCreatorInfo(postObj, ()=>{setPostModalVisible(true)})})
              }
              else{
                console.log('tatiyana')
                firebaseSDK.getPost(circleCenters[i].id).then((postObject)=>{var postObj=postObject.data();postObj.postId=circleCenters[i].id;setPostViewerInfo(postObj, ()=>{setModalVisible(true)})})
              }
              break;
            }

          }

        }
        const closePostCreatorModal=()=>
        {
          setPostCreatorInfo({expirationDate:null,message:'',op:'',imageUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d',iconUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d'})
          setPostModalVisible(false)
        }

        const closePostViewerModal=()=>
        {
          setModalVisible(!modalVisible);
        }
        return (
          <View style={styles.container}>
          <MapView
          scrollEnabled={true}
          rotateEnabled={true}
          onPress={(e)=>{mapViewPressed(e.nativeEvent.coordinate);console.log(e.nativeEvent)}}
          zoomEnabled={false}
          onDoublePress={(e)=>
            {
              console.log('longpress')
              createPost(e.nativeEvent)
            }}
            camera = {{
              center: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
              },
              altitude:1,
              pitch: 1,
              heading: deviceHeading,

              zoom:19
            }}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.container}
            >
            {nearbyPosts}
            </MapView>
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
            <PostViewer uid={props.uid} closePostViewerModal={closePostViewerModal}   postViewerInfo={postViewerInfo} claimedCoupons={claimedCoupons} />
            </View>
            </View>
            </Modal>

            <Modal
            animationType="slide"
            transparent={true}
            visible={postModalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
            >
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <PostCreator  postCreatorInfo={postCreatorInfo}  uid={props.uid}  createPost={crtPost} closePostCreatorModal={closePostCreatorModal}></PostCreator>
            </View>
            </View>
            </Modal>
            </View>
          );
        }

        /*<PinStripView
        onMarkerDrag={onMarkerDrag}
        getMarkerReleaseCoordinate={(point)=>getMarkerReleaseCoordinate(point)} pin_strip_spacing={PIN_STRIP_HEIGHT_PIXELS/5} style={styles.pinStrip} markerStatuses={markerStatuses} size={MARKER_SIZE} onDrag={onDrag} x={MARKER_X_POSITION} y={0}/>*/

        //<UserMarker image={props.image} coordinate={{latitude:latitude,longitude:longitude}}/>
        export default MapPage;
        const styles=StyleSheet.create({
          pinStrip: {
            position:'absolute',
            marginTop: Platform.OS === 'ios' ? 40 : 20,
            flexDirection:"column",
            backgroundColor: '#fff',
            width: '12%',
            height:'45%',
            opacity:0.6,
            borderRadius: 5,
            left:width*0.85,
            padding: 10,
            shadowColor: '#ccc',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 10,
          },
          cardtitle: {
            fontSize: 12,
            // marginTop: 5,
            fontWeight: "bold",
          },
          card: {
            // padding: 10,
            elevation: 2,
            backgroundColor: "#FFF",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            marginHorizontal: 10,
            shadowColor: "#000",
            shadowRadius: 5,
            shadowOpacity: 0.3,
            shadowOffset: { x: 2, y: -2 },
            height: CARD_HEIGHT,
            width: CARD_WIDTH,
            overflow: "hidden",
          },
          cardImage: {
            flex: 3,
            width: "100%",
            height: "100%",
            alignSelf: "center",
          },
          /*container: {
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'flex-end',
          alignItems: 'center',
        },*/
        container:{
          flex:1,
        },
        map: {
          ...StyleSheet.absoluteFillObject,
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
        })
        var mapstyle=[
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8ec3b9"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1a3646"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#4b6878"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#64779e"
              }
            ]
          },
          {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#4b6878"
              }
            ]
          },
          {
            "featureType": "landscape.man_made",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#334e87"
              }
            ]
          },
          {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#283d6a"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#6f9ba5"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3C7680"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#304a7d"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#98a5be"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#2c6675"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#255763"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#b0d5ce"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#98a5be"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#283d6a"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3a4762"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#0e1626"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#4e6d70"
              }
            ]
          }
        ]
