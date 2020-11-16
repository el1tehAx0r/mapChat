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
import TwoButtonModal from '../components/TwoButtonModal'
import StorePage from './StoreScreen'
import ChatViewer from '../components/ChatViewer'
import CloseModalButton from '../components/CloseModalButton'
import styles,{mapstyle} from '../MapStyleSheet'
import { useFocusEffect } from '@react-navigation/native';
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
  const [modalVisible,setModalVisible]=useState(false)
  const [postModalVisible,setPostModalVisible]=useState(false)
  const [shownModal,setShownModal]=useState(null)
  const [showStoreModal,setShowStoreModal]=useState(false);
  const [tempStorePoint,setTempStorePoint]=useStateWithCallbackLazy(null)
  const [storeModalVisible,setStoreModalVisible]=useState(false);
  const [messengerModalVisible,setMessengerModalVisible]=useState(false);
  const [storeViewerInfo,setStoreViewerInfo]=useStateWithCallbackLazy({userReference:{id:null}});
  const [messages,setMessages]=useStateWithCallbackLazy([])
  const [messageUnsub,setMessageUnsub]=useState(null)
  const [postUnsub,setPostUnsub]=useState(null)
  const [storePostUnsub,setStorePostUnsub]=useState(null)
  const mapRef = useRef(null);
  useEffect(()=>{

    return ()=>{
      if(messageUnsub!=null){
      messageUnsub.messageUnsub()
      }
      if(postUnsub!=null)
      {
      postUnsub.postUnsub()
      }
      if(storePostUnsub!=null){
      storePostUnsub.storePostUnsub()
      }
    }
  },[])

useFocusEffect(
    React.useCallback(() => {
      props.startLocationHandling()
      return () =>{
      props.stopLocationHandling()
      }
    }, [])
  );

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
    setCoordinates(props.coordinates)
  },[props.coordinates])
  const createBoardPost=(uid,message,media,postId)=>
  {
    firebaseSDK.createBoardPost(uid,message,media,postId).then((boardPost)=>{
      var boardPostId=boardPost._documentPath._parts[1]
      var remotePath='media/'+boardPostId
      var localPath=media.path
      var collectionName='BoardPosts'
      var documentName=boardPostId
      var field='media.path'
      firebaseSDK.addToStorage(remotePath,localPath,collectionName,documentName,field)
      setPostModalVisible(false)})
    }
    const crtPost= async (uid,latitude,longitude,message,iconUrl,media)=>
    {
      firebaseSDK.createPost(uid,latitude,longitude,message,iconUrl).then((post)=>{
        var postId=post._document._documentPath._parts[1]
        createBoardPost(uid.toString(),message,media,postId.toString())
        var remotePath='iconUrl/'+postId.toString()
        var localPath=iconUrl.toString()
        var collectionName='Posts'
        var documentName=postId.toString()
        var field='iconUrl'
        firebaseSDK.addToStorage(remotePath,localPath,collectionName,documentName,field)
        closePostCreatorModal()})
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
      const mapViewPressed=async (coordinates)=>
      {
        for (var i in circleCenters)
        {
          if (Utility.getDistanceFromLatLonInm(circleCenters[i].latitude,circleCenters[i].longitude,coordinates.latitude,coordinates.longitude)<7)
          {
            var postUnsubber=await firebaseSDK.getSnapshotFromRefernce(async (postObject)=>{
              var postObj=postObject.data();  postObj.postId=circleCenters[i].id;
              if (postObj.storeReference!=null)
              {
                var storePostUnsubber=await firebaseSDK.getSnapshotFromRefernce((documentSnapshot)=>{
                  var storeObj=documentSnapshot.data(); storeObj.storeId=postObj.storeReference.id;
                  storeObj.postId=postObj.postId;
                  setStoreViewerInfo(storeObj,()=>{
                    setStoreModalVisible(true)
                  }
                )
              },postObj.storeReference)
              setStorePostUnsub({'storePostUnsub':storePostUnsubber});
            }
          },firestore().collection('Posts').doc(circleCenters[i].id))
          setPostUnsub({'postUnsub':postUnsubber});
          break;
        }
      }
    }
    const messageButtonPressed= async ()=>{
      try{

        var messageUnsubber=await firebaseSDK.getMessages((messageList)=>{
        setMessages(messageList,()=>{
          setMessengerModalVisible(true)
        })
      },props.uid,storeViewerInfo.userReference.id)
      setMessageUnsub({'messageUnsub':messageUnsubber})
    }
      catch(exception){
        console.log(exception,'NOOOO')
      }}
      useEffect(()=>{},[messages])
      const sendMessages=(messages,userId,storeId)=>{
        firebaseSDK.sendMessages(messages,userId,storeId)
      }
      const closePostCreatorModal=()=>
      {
        setPostCreatorInfo({expirationDate:null,message:'',op:'',media:{path: 'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d',mime:'image/jpeg'},iconUrl:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/profilePics%2Fadu12345?alt=media&token=db4f1cbc-2f44-470b-bed1-01462fb5447d'})
        setPostModalVisible(false)
      }
      const placeStore=()=>
      {
        firebaseSDK.placeStore(props.postIdStore, tempStorePoint.coordinate);
        setShowStoreModal(false);
      }
      const openStoreModal=(tempStorePoint)=>
      {
        if (circleCenters.length!=0)
        {
          for( var i in circleCenters)
          {
            if (Utility.getDistanceFromLatLonInm(circleCenters[i].latitude,circleCenters[i].longitude,tempStorePoint.coordinate.latitude,tempStorePoint.coordinate.longitude)>20)
            {
              if ((i==(circleCenters.length-1)))
              {
                setShowStoreModal(true)
              }
            }
            else{
              break;
            }
          }
        }
        else{
          setShowStoreModal(true)
        }
      }
      const cancelStorePlacement=()=>
      {
        setShowStoreModal(false);
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
              setTempStorePoint(e.nativeEvent,(tempPoint)=>{
                openStoreModal(tempPoint)
              }
            )
          }}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.container}
          >
          {nearbyPosts}
          <Marker.Animated
          coordinate={coordinates}
          />
          </MapView>
          <ModalContainer modalVisible={messengerModalVisible}>
          <ChatViewer  avatar={storeViewerInfo.storeProfilePic} userNamePressed={()=>{}}username={storeViewerInfo.storeName} uid={props.uid} storeUid={storeViewerInfo.userReference.id} sendMessages={sendMessages} messages={messages} close={()=>{messageUnsub.messageUnsub(); setMessengerModalVisible(false)}}></ChatViewer>
          </ModalContainer>
          <ModalContainer modalVisible={storeModalVisible}>

          <StorePage storeId={storeViewerInfo.storeId} myStore={storeViewerInfo} uid={props.uid} postIdStore={storeViewerInfo.postId}>
          <View style={{justifyContent:'center',flexDirection:'row'}}>
          <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
          onPress={()=>setStoreModalVisible(false)}>
          <Text style={styles.textStyle}>Close</Text>
          </TouchableHighlight>

          <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
          onPress={messageButtonPressed}>
          <Text style={styles.textStyle}>Message</Text>
          </TouchableHighlight>
          </View>
          </StorePage>
          </ModalContainer>
          <TwoButtonModal visible={showStoreModal} text={'Do you want to set your store here? You only get one. Note, it can be moved anytime by double pressing anywhere else on the map again'} option1Text={'Place'} option2Text={'Cancel'} option1={placeStore} option2={cancelStorePlacement}/>
          </View>
        );
      }

      /*<PinStripView
      onMarkerDrag={onMarkerDrag}
      getMarkerReleaseCoordinate={(point)=>getMarkerReleaseCoordinate(point)} pin_strip_spacing={PIN_STRIP_HEIGHT_PIXELS/5} style={styles.pinStrip} markerStatuses={markerStatuses} size={MARKER_SIZE} onDrag={onDrag} x={MARKER_X_POSITION} y={0}/>*/

      //<UserMarker image={props.image} coordinate={{latitude:latitude,longitude:longitude}}/>
      export default MapPage;
