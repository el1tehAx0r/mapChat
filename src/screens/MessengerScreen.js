import React, { useState, useEffect,useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
} from 'react-native';
import  ModalContainer from '../components/ModalContainer'
import ChatViewer from '../components/ChatViewer'
import { SwipeListView } from 'react-native-swipe-list-view';
import firebaseSDK from '../config/FirebaseSDK';

import { useStateWithCallbackLazy } from 'use-state-with-callback';
export default function MessengerPage(props) {
    const [listData, setListData] = useState(
        Array(20)
            .fill('')
            .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
    );
    const [modalVisible,setModalVisible]=useState(false)
    const [storeViewerInfo,setStoreViewerInfo]=useState({})
  const [messages,setMessages]=useStateWithCallbackLazy([])

    const [chats,setChats]=useState([])
    useEffect(()=>{
      console.log(props.chats)
      console.log(listData)
      setChats(props.chats)
    },[props.chats])
    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

      const sendMessages=(messages,userId,storeId)=>{
    firebaseSDK.sendMessages(messages,userId,storeId)
       }
    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
    };
    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };
    const renderItem = data => (
        <TouchableHighlight
            onPress={() =>{
              firebaseSDK.getMessages((messageList)=>{console.log('zabboom',messageList);
      setMessages(messageList,()=>{
      setModalVisible(true)
      })
    },props.uid,data.item.otherUser)}
              }
            style={styles.rowFront}
            underlayColor={'#AAA'}>
            <View>
                <Text>{data.item.otherUser} </Text>
                <Text>Last Message: {data.item.lastMessage.text} </Text>
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
            <SwipeListView
                data={chats}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-150}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}/>
          <ModalContainer modalVisible={modalVisible}>
          <ChatViewer uid={props.uid} storeViewerInfo={storeViewerInfo} storeUid={props.uid} sendMessages={sendMessages} messages={messages} close={()=>{firebaseSDK.unsubMessages(); setModalVisible(false)}}></ChatViewer>
          </ModalContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'flex-start',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height:90,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});
