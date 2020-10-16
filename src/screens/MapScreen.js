import React, { useState, useEffect,useRef } from 'react';
import {Modal,ScrollView,Button,Dimensions, Animated,TouchableHighlight, View,Image, Text,TextInput,StyleSheet,TouchableOpacity } from 'react-native';
import RNDeviceHeading from 'react-native-device-heading'
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import MapView,{Marker,PROVIDER_GOOGLE,Circle} from 'react-native-maps';
import TabBar from "@mindinventory/react-native-tab-bar-interaction";
import UserMarker from "../components/UserMarker";
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import * as geofirestore from 'geofirestore';
import firebaseSDK from '../config/FirebaseSDK'
import PostMarker from '../components/PostsMarker.js'
import PostCreator from '../components/PostCreator'
import PostViewer from '../components/PostViewer'
import ModalContainer from '../components/ModalContainer'
import Utility from '../config/Utility'
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
  const [nearbyPosts,setNearbyPosts]=useState([])
  const [circleCenters,setCircleCenters]=useState([])
  const [claimedCoupons,setClaimedCoupons]=useState([])
  const [modalVisible,setModalVisible]=useState(false)
  const [postModalVisible,setPostModalVisible]=useState(false)
  const [postViewerInfo,setPostViewerInfo]=useStateWithCallbackLazy(false);
  const [postCreatorInfo,setPostCreatorInfo]=useStateWithCallbackLazy({expirationDate:null,message:'',op:'',media:{path: 'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d',mime:'image/jpeg'},iconUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d'});
  const [shownModal,setShownModal]=useState(null)
  const [myPosts,setMyPosts]=useStateWithCallbackLazy([])
  const mapViewRef=useRef(null);
  const [deviceHeading,setDeviceHeading]=useState(1);
  const [watchId,setWatchId]=useState()
 const mapRef = useRef(null);
  let postUnsub;
  let postUnsub2;
useEffect(()=>
{
  mapRef.current.animateCamera(
    {
              center: {
                latitude: props.coordinates.latitude,
                longitude: props.coordinates.longitude,
              },
              altitude:1,
              pitch: 1,
              heading: props.deviceHeading,
              zoom:19
            }
  )
},[props.coordinates,props.deviceHeading])
useEffect(()=>
{
        var jsxPostsMarkers=[]
        var jsxPostMarkersTemp=circleCenters.map((markerInfo,index)=>{
          return <PostMarker mapViewPressed={mapViewPressed} key={index} iconUrl={markerInfo.iconUrl} coordinate={{latitude:markerInfo.latitude,longitude:markerInfo.longitude}}/>
        })
        jsxPostsMarkers=jsxPostMarkersTemp
        setNearbyPosts(jsxPostsMarkers)
        if(circleCenters.length==0)
        {
          setNearbyPosts([])
        }
},[circleCenters])
      useEffect(()=>
    {
      setCircleCenters(props.circleCenters)
    },[props.circleCenters])
      useEffect(()=>
    {
      setDeviceHeading(props.deviceHeading)
    },[props.deviceHeading])

      useEffect(()=>
    {
      setCoordinates(props.coordinates)
    },[props.coordinates])
      useEffect(()=>{
        setClaimedCoupons(props.claimedCoupons)
      },[props.claimedCoupons])
      useEffect(()=>
    {
      setMyPosts(props.myPosts)
    },[props.myPosts])

const crtPost=(uid,latitude,longitude,message,iconUrl,media)=>
  {
    firebaseSDK.createPost(uid,latitude,longitude,message,iconUrl,media).then((post)=>{
      var postId=post._document._documentPath._parts[1]
      var remotePath='media/'+postId
      var localPath=media.path.toString()
      var collectionName='Posts'
      var documentName=postId
      var field='media.path'
      firebaseSDK.addToStorage(remotePath,localPath,collectionName,documentName,field)
      var remotePath='iconUrl/'+postId
      var localPath=iconUrl.toString()
      var collectionName='Posts'
      var documentName=postId
      var field='iconUrl'
      firebaseSDK.addToStorage(remotePath,localPath,collectionName,documentName,field)
      closePostCreatorModal()})
    }
    const openCreatePostModal=(lat,long)=>
    {
    var postObject={}
    postObject=postCreatorInfo;
    setPostCreatorInfo({latitude:lat,longitude:long,expirationDate:null,message:'',op:'',media:{path: 'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d',mime:'image/jpeg'},iconUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d'}
,()=>{console.log('jk');setPostModalVisible(true)})
      }
      const createPost=(point)=>
      {
        if (circleCenters.length!=0)
        {
          for( var i in circleCenters)
          {
            if (Utility.getDistanceFromLatLonInm(circleCenters[i].latitude,circleCenters[i].longitude,point.coordinate.latitude,point.coordinate.longitude)>20)
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
        const mapViewPressed=(coordinates)=>
        {
          console.log(myPosts,'tHESE MYPSOIDS')

          for (var i in circleCenters)
          {
            if (Utility.getDistanceFromLatLonInm(circleCenters[i].latitude,circleCenters[i].longitude,coordinates.latitude,coordinates.longitude)<7)
            {
                  firebaseSDK.getPost(circleCenters[i].id).then((postObject)=>{var postObj=postObject.data(); console.log(postObj); postObj.postId=circleCenters[i].id;
                  setPostViewerInfo(postObj, ()=>{setModalVisible(true)})
                })
              break;
            }
          }
        /*  for (var i in circleCenters)
          {
            if (Utility.getDistanceFromLatLonInm(circleCenters[i].latitude,circleCenters[i].longitude,coordinates.latitude,coordinates.longitude)<7)
            {
              if(myPosts.includes(circleCenters[i].id))
              {
                var circleCenterId=circleCenters[i].id
                firebaseSDK.getPost(circleCenters[i].id).then((postObject)=>{var postObj=postObject.data();postObj.postId=circleCenters[i].id;postObj.isEditing=true;
                  setPostCreatorInfo(postObj, ()=>{setPostModalVisible(true)})
                })
              }
              else{
                console.log('tatiyana')
                firebaseSDK.getPost(circleCenters[i].id).then((postObject)=>{var postObj=postObject.data(); console.log(postObj); postObj.postId=circleCenters[i].id;
                  setPostViewerInfo(postObj, ()=>{setModalVisible(true)})
                })
              }
              break;
            }
          }*/
        }
        const closePostCreatorModal=()=>
        {
          setPostCreatorInfo({expirationDate:null,message:'',op:'',media:{path: 'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d',mime:'image/jpeg'},iconUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d'})
          setPostModalVisible(false)
        }
        const closePostViewerModal=()=>
        {
          setModalVisible(!modalVisible);
        }
        return (
          <View style={styles.container}>
          <MapView
           ref={mapRef}
          scrollEnabled={true}
          loadingEnabled
          rotateEnabled={true}
          onPress={(e)=>{//mapViewPressed(e.nativeEvent.coordinate);
            console.log(e.nativeEvent)}}
          zoomEnabled={false}
          customMapStyle={mapstyle}
          onDoublePress={(e)=>
            {
              console.log('longpress')
              createPost(e.nativeEvent)
            }}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.container}
            >
            {nearbyPosts}
             <Marker.Animated
    coordinate={coordinates}
  />
            </MapView>
          <ModalContainer modalVisible={modalVisible}>
            <PostViewer uid={props.uid}  closePostViewerModal={closePostViewerModal} postViewerInfo={postViewerInfo}  />
          </ModalContainer>
          <ModalContainer modalVisible={postModalVisible}>
            <PostCreator  navigation={props.navigation} postCreatorInfo={postCreatorInfo} uid={props.uid}  createPost={crtPost} closePostCreatorModal={closePostCreatorModal}></PostCreator>
            </ModalContainer>
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
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]
