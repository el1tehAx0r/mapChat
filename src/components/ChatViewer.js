import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat} from 'react-native-gifted-chat'
import {View,Text} from 'react-native'
import styles from '../StyleSheet'
import Utility from '../config/Utility'
import CloseModalButton from './CloseModalButton'
import firebaseSDK from '../config/FirebaseSDK'
export default function ChatViewer(props) {
  const [messages, setMessages] = useState([]);
/*  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])*/
  useEffect(()=>{
    console.log(props.messages,'AAAA')
    console.log(messages,'YaYYY')
    var tempArray=props.messages.filter(e => !Utility.contains(e,messages))
    console.log(tempArray,'RRRR')
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
