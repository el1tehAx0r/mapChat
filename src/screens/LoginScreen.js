
import React, {useState} from 'react'
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import firestore from '@react-native-firebase/firestore';
import ValidationComponent from 'react-native-form-validator';
import firebaseSDK from '../config/FirebaseSDK'
import Utility from '../config/Utility'
import {
  TouchableHighlight,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Button,
  TextInput,
  StyleSheet,Modal,Alert
} from 'react-native'
import {signUpStyles} from '../StyleSheet'
import PhoneVerifyer from '../components/PhoneVerifyer'
import PhoneInput from 'react-native-phone-input'
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
export default class SignUpPage extends ValidationComponent{
  state = {
    username: '', password: '', email: '', phone_number: '', modalVisible:false, confirm:null,code:null
  }
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }
  _onSubmit=async ()=> {
    if(this.state.email!=''&&this.state.password!='')
      {
        if(Utility.validateEmail(this.state.email)){
      var testing= await firebaseSDK.login(this.state.email,this.state.password);
      Alert.alert(testing)
        }
        else{
          Alert.alert('Email is Invalid')
        }
  }
  else{
    Alert.alert('Fields Cannot Be Empty')
  }
}
  render() {
    return (
      <KeyboardAvoidingScrollView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={signUpStyles.container}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={signUpStyles.inner}>
  <MaterialIcons style={signUpStyles.header} name={'store-outline'}  />

      <TextInput
      style={signUpStyles.textInput}
      placeholder='email'
      autoCapitalize="none"
      placeholderTextColor='black'
      onChangeText={val => this.onChangeText('email', val)}
      />

      <TextInput
      style={signUpStyles.textInput}
      placeholder='Password'
      secureTextEntry={true}
      autoCapitalize="none"
      placeholderTextColor='black'
      onChangeText={val => this.onChangeText('password', val)}
      />

      <View style={signUpStyles.btnContainer}>
      <Button title="Login" onPress={this._onSubmit} />
      </View>
      </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingScrollView>
    )
  }
}
