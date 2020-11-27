import React, { useState, useCallback, useEffect } from 'react'
import StoreProfilePic from './StoreProfilePic'
import { GiftedChat} from 'react-native-gifted-chat'
import {View,Text,TouchableHighlight} from 'react-native'
import styles from '../StyleSheet'
import Utility from '../config/Utility'
import CloseModalButton from './CloseModalButton'
import firebaseSDK from '../config/FirebaseSDK'
export default function ChatViewer(props) {
  const [messages, setMessages] = useState([]);
  useEffect(()=>{
    var tempArray=props.messages.filter(e => !Utility.contains(e,messages))
    setMessages(previousMessages => GiftedChat.append(previousMessages, tempArray))
},[props.messages])
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  const bull=()=>{
  return (<Text>BOOO</Text>)
  }
  return (
    <>
    <CloseModalButton close={props.close}></CloseModalButton>
    <View style={{...styles.rowFront,borderBottomWidth:1,alignItems:'center', flexDirection:'column'}}>
    <View style={{flex:2}}>
    <StoreProfilePic editable={false} onPressEditableFalse={()=>{props.userNamePressed(props.storeUid)}}onPress={(width,height,path)=>{}} profilePic={props.avatar}/>
    </View>

<View style={{flex:2}}>
    <TouchableHighlight onPress={()=>{props.userNamePressed(props.storeUid)}}>
    <Text style={{paddingTop:20, textDecorationLine: 'underline', fontWeight: 'bold'}}>{props.username}</Text>

    </TouchableHighlight>
    </View>

</View>
    <GiftedChat
      messages={messages}
      onSend={messages => props.sendMessages(messages,props.uid,props.storeUid)}
      user={{
        _id: props.uid,
        name:props.username,
        avatar:props.avatar
      }}
    />
    </>
  )
}
