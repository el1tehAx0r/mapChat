
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
      style={styles.container}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.inner}>
      <Text style={styles.header}>Head</Text>

      <TextInput
      style={styles.textInput}
      placeholder='email'
      autoCapitalize="none"
      placeholderTextColor='black'
      onChangeText={val => this.onChangeText('email', val)}
      />

      <TextInput
      style={styles.textInput}
      placeholder='Password'
      secureTextEntry={true}
      autoCapitalize="none"
      placeholderTextColor='black'
      onChangeText={val => this.onChangeText('password', val)}
      />

      <View style={styles.btnContainer}>
      <Button title="Login" onPress={this._onSubmit} />
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
