
import React, {useState} from 'react'
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import firestore from '@react-native-firebase/firestore';
import ValidationComponent from 'react-native-form-validator';
import firebaseSDK from '../config/FirebaseSDK'
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
    username: '', password: '', email: '', phone_number: '', modalVisible:false, confirm:null,code:null
  }
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  onChangeCode=(text)=>
  {
    this.setState({['code']:text})
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


  closeModal=()=>{
    this.setState({modalVisible:false})
  }
    createUser=async ()=>
  { var testing=await firebaseSDK.createUser(this.state.email,this.state.username,this.state.password);Alert.alert(testing)  }

  // Call ValidationComponent validate method
  render() {
    return (
      <KeyboardAvoidingScrollView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.inner}>

      <TextInput
      style={styles.textInput}
      placeholder='Username'
      autoCapitalize="none"
      placeholderTextColor='black'
      onChangeText={val => this.onChangeText('username', val)}
      />

      <TextInput
      style={styles.textInput}
      placeholder='Password'
      secureTextEntry={true}
      autoCapitalize="none"
      placeholderTextColor='black'
      onChangeText={val => this.onChangeText('password', val)}
      />

      <TextInput
      style={styles.textInput}
      placeholder='Email'
      autoCapitalize="none"
      placeholderTextColor='black'
      onChangeText={val => this.onChangeText('email', val)}
      />
    {/*  <PhoneVerifyer closeModal={this.closeModal} changeCode={val => this.onChangeText('code', val)} code={this.state.code} modalVisible={this.state.modalVisible} confirmCode={this.confirmCode} />
      <PhoneInput onChangePhoneNumber={val => this.onChangeText('phone_number', val)}  style={styles.textInput} value='+1' ref='phone' textProps={{placeholder:'Telephone number'}}/>*/}
      <View style={styles.btnContainer}>
      <Button title="Sign Up" onPress={this._onSubmit} />
      </View>
      </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around"
  },
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12
  }

});
