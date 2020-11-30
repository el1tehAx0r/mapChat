import React, {useState} from 'react'
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import firestore from '@react-native-firebase/firestore';
import ValidationComponent from 'react-native-form-validator';
import firebaseSDK from '../config/FirebaseSDK'
import {signUpStyles} from '../StyleSheet';
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
import PhoneVerifyer from '../components/PhoneVerifyer'
import PhoneInput from 'react-native-phone-input'
import auth from '@react-native-firebase/auth';

export default class SignUpPage extends ValidationComponent{
  state = {
    username: '', password: '', email: '', phone_number: '',
  }
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }
  _onSubmit=async ()=> {
    if(this.state.email!=''&&this.state.username!=''&&this.state.password!='')
    {
      var userExist=await firebaseSDK.userExist(this.state.email,this.state.username);
      if (!userExist){
        this.createUser()}
        else{
          Alert.alert("User Exists")
        }
      }
      else{
        Alert.alert('Fields cannot be empty')
      }
    }

    createUser=async ()=>
    { var testing=await firebaseSDK.createUser(this.state.email,this.state.username,this.state.password);Alert.alert(testing)  }

    render() {
      return (
        <KeyboardAvoidingScrollView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={signUpStyles.container}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={signUpStyles.inner}>

        <TextInput
        style={signUpStyles.textInput}
        placeholder='Username'
        autoCapitalize="none"
        placeholderTextColor='black'
        onChangeText={val => this.onChangeText('username', val)}
        />

        <TextInput
        style={signUpStyles.textInput}
        placeholder='Password'
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor='black'
        onChangeText={val => this.onChangeText('password', val)}
        />

        <TextInput
        style={signUpStyles.textInput}
        placeholder='Email'
        autoCapitalize="none"
        placeholderTextColor='black'
        onChangeText={val => this.onChangeText('email', val)}
        />
        <View style={signUpStyles.btnContainer}>
        <Button title="Sign Up" onPress={this._onSubmit} />
        </View>
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingScrollView>
      )
    }
  }
