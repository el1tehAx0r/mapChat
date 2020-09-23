import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firebaseSDK from '../config/FirebaseSDK'
export default class ChatPage extends React.Component {
    constructor(props) {
    super(props);
    this.state={messages:[]}
  }
  componentDidMount(){
  }
   get user() {
var user= firebaseSDK.getCurrentUserInfo().then((currentUser)=>{
    return {
      name:user.DisplayName,
      email: user.Email,
      avatar: user.PPPath,
      id: user.uid,
      _id: user.uid
    };
}).catch((error)=>console.log(error));
  }
  render() {
    return <GiftedChat user={this.user}
    messages={this.state.messages}
    onSend={firebaseSDK.send} />;
  }
}
