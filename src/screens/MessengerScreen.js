import React, { useState, useEffect,useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Image
} from 'react-native';
import StoreProfilePic from '../components/StoreProfilePic'
import  ModalContainer from '../components/ModalContainer'
import ChatViewer from '../components/ChatViewer'
import { SwipeListView } from 'react-native-swipe-list-view';
import firebaseSDK from '../config/FirebaseSDK';
import styles from '../MessengerStyleSheet';
import StorePage from './StoreScreen'
import CloseModalButton from '../components/CloseModalButton'
import Utility from '../config/Utility'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { useFocusEffect } from '@react-navigation/native';
export default function MessengerPage(props) {
  const [modalVisible,setModalVisible]=useState(false)
  const [storeViewerInfo,setStoreViewerInfo]=useStateWithCallbackLazy({})
  const [chat,setChat]=useStateWithCallbackLazy({});
  const [chats,setChats]=useState([])
  const [storeShown,setStoreShown]=useState(false)
  const [messageUnsub,setMessageUnsub]=useState(null)
  const [storeUnsub,setStoreUnsub]=useState(null)
  const [unreadMessages,setUnreadMessages]=useState(0)
  //useEffect hook but with tab navigation
  useFocusEffect(
    React.useCallback(() => {
      return ()=>{
        if(messageUnsub!=null)
        {
          messageUnsub.messageUnsub()
        }
        if(storeUnsub!=null)
        {
          storeUnsub.storeUnsub()
        }
      }
    }, [])
  );

    //update chat info when when new chats enter via props.chats
    useEffect(()=>{
      getChatInfo();
    },[props.chats])

  //getChatInfo
  async function getChatInfo() {
    const promises = props.chats.map(async (item) => {
      var holdItems=await firebaseSDK.getStoreUsernameAndAvatar(item.otherUser)
      item.userName=holdItems.storeName;
      item.avatar=holdItems.storeProfilePic;
      return item
    });
    var newChats=await Promise.all(promises);
    setChats(newChats)}
    const onRenderItem=async (dataItem)=>{
      return new Promise(async (resolve)=>{
        var messageUnsubber=await firebaseSDK.getMessages((messageList)=>{console.log('zabboom');
        setChat({messages:messageList,otherUser:dataItem.otherUser, avatar:dataItem.avatar, userName:dataItem.userName},(chat)=>{
          resolve(true)
        })
      },props.uid,dataItem.otherUser)
      setMessageUnsub({'messageUnsub':messageUnsubber})
    })
  }

  //profilePressed
  const onProfilePressed= async (storeUid)=>{
    console.log(storeUid)
    return new Promise(async (resolve)=>
    {
      console.log(storeUid)
      firebaseSDK.getDataByCollectionAndDocId('Users',storeUid).then(async (documentData)=>
      {
        var storeUnsubber=await firebaseSDK.getSnapshotFromRefernce((snapshot)=>{
          var snapshotCopy= Object.assign({}, snapshot.data());
          snapshotCopy.otherUser=storeUid
          snapshotCopy.userName=snapshot.data().storeName
          snapshotCopy.avatar=snapshot.data().storeProfilePic
          setStoreViewerInfo(snapshotCopy,()=>{
            resolve(true)
          })
        },documentData.myStorePosts)
        setStoreUnsub({'storeUnsub':storeUnsubber})
      })
    })
  }

  //close out of screen
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  //this deletes a chat
  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...chats];
    const prevIndex = chats.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setChat(newData);
  };

//when yo open a chat
  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };


//  here is where we render everything
  const renderItem = data => (
    <TouchableHighlight
    onPress={async () =>{
      if(data.item.read==false)
      {
        firebaseSDK.updateRead(props.uid,data.item.key)
      }
      onRenderItem(data.item).then((useless)=>{
        setStoreShown(false)
        setStoreShown(false)
        setModalVisible(true)
      })
    }
  }
  underlayColor={'#CCC'}>
  <View style={{...styles.rowFront,flexDirection:'row'}}>
  <View style={{flex:2}}>
  <StoreProfilePic editable={false} onPressEditableFalse={()=>{onProfilePressed(data.item.otherUser).then((useless)=>{
    setStoreShown(true);setModalVisible(true)})}} onPress={(width,height,path)=>{}} profilePic={data.item.avatar}/>
    </View>

    <View style={{flex:8,flexDirection:'column'}}>
    <View style={{flexDirection:'row'}}>
    <View style={{paddingTop:10}}>
    <Text style={styles.username}> {data.item.userName} </Text>
    <Text style={styles.text}>Last Message: {data.item.lastMessage.text} </Text>
    </View>
    <View style={{flex:2, alignItems:'center',justifyContent:'center'}}>{data.item.read? <Ionicons name='mail-open-outline' size={20} color="#900" />: <Ionicons name='mail-outline' size={20} color="#900" />}</View>
    </View>
    </View>
    </View>
    </TouchableHighlight>
  );
  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
    <TouchableOpacity
    style={[styles.backRightBtn, styles.backRightBtnLeft]}
    onPress={() => closeRow(rowMap, data.item.key)}
    >
    <Text style={styles.backTextWhite}>Close</Text>
    </TouchableOpacity>
    <TouchableOpacity
    style={[styles.backRightBtn, styles.backRightBtnRight]}
    onPress={() => deleteRow(rowMap, data.item.key)}
    >
    <Text style={styles.backTextWhite}>Delete</Text>
    </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
    {chats.length>0?
      <SwipeListView
      data={chats}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-150}
      previewRowKey={'0'}
      previewOpenValue={-40}
      previewOpenDelay={3000}
      onRowDidOpen={onRowDidOpen}/>:
      <Text>No Messages currently found, Click on a store on the map to send a message to begin!</Text>
    }
    <ModalContainer modalVisible={modalVisible}>
    {
      storeShown==false?
      (<ChatViewer avatar={chat.avatar} username={chat.userName} userNamePressed={(storeUid)=>{onProfilePressed(storeUid).then((useless)=>{
        setStoreShown(true);setModalVisible(true); messageUnsub.messageUnsub()})}} uid={props.uid} storeViewerInfo={storeViewerInfo} storeUid={chat.otherUser} sendMessages={
          (messages,userId,storeId)=>{
            firebaseSDK.sendMessages(messages,userId,storeId)
          }
        } messages={chat.messages} close={()=>{//firebaseSDK.unsubMessages();
          messageUnsub.messageUnsub();
          setModalVisible(false);console.log('area');}}></ChatViewer>):
          <><CloseModalButton close={()=>{
            setModalVisible(false);storeUnsub.storeUnsub();
          }}></CloseModalButton>
          <StorePage storeId={storeViewerInfo.storeId} myStore={storeViewerInfo} uid={props.uid} postIdStore={storeViewerInfo.postId}>
          <View style={{justifyContent:'center',flexDirection:'row'}}>
          <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
          onPress={()=>{onRenderItem(storeViewerInfo).then((useless)=>{
            storeUnsub.storeUnsub()
            setStoreShown(false)
          })}}>
          <Text style={styles.textStyle}>Message</Text>
          </TouchableHighlight>
          </View>
          </StorePage>
          </>
        }
        </ModalContainer>

        </View>
      );
    }
