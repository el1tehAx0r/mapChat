import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat} from 'react-native-gifted-chat'
import {View,Text} from 'react-native'
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

  return (
    <>
    <CloseModalButton close={props.close}></CloseModalButton>
    <GiftedChat
      messages={messages}
      onSend={messages => props.sendMessages(messages,props.uid,props.storeUid)}
      user={{
        _id: props.uid,
      }}
    />
    </>
  )
}
