
import React, {useState} from 'react'
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import firestore from '@react-native-firebase/firestore';
import ValidationComponent from 'react-native-form-validator';
import {
  TouchableHighlight,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Button,
  TextInput,
  StyleSheet,Modal
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
  signUp = async () => {
    const { username, password, email, phone_number } = this.state
    try {
      // here place your signup logic
      console.log('user successfully signed up!: ', success)
    } catch (err) {
      console.log('error signing up: ', err)
    }
  }

  confirmCode=async ()=>{
    try {
      await confirm.confirm(code);
      console.log('success');
    } catch (error) {
      console.log('Invalid code.');
    }
  }
  finishSignup=()=>{
    auth()
    .createUserWithEmailAndPassword(this.state.username, this.state.password )
    .then(() => {
      console.log('User account created & signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
    });
  }

  signInWithPhoneNumber=async (phoneNumber)=> {
    var formattedPhoneNumber = phoneNumber.substr(0,phoneNumber.length-9)+' '+phoneNumber.substr(-9,3)+'-'+phoneNumber.substr(-6,3)+'-'+phoneNumber.substr(-3);
    const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
    setConfirm(confirmation);
  }
  closeModal=()=>{
this.state.modalVisible=false
  }
  _onSubmit=()=> {
    if(
      /*this.validate({
      password: {minlength:3, maxlength:7, required: true},
      email: {email: true},
    })*/
    true
  )
  {
    firestore()
    .collection('Users')
    .where('PhoneNumber','==',this.state.phone_number).get()
    .then(querySnapshot => {if (querySnapshot.size==1)
      {console.log('phone number already exist')
    }else{
      console.log('phone number dont exist')
      firestore()
      .collection('Users')
      .where('Email','==',this.state.email).get()
      .then(email=> {if (email.size==1)
        {
          console.log('email already exist');
        }
        else{
          console.log('good')
          this.setState({modalVisible:true}).then(()=>signInWithPhoneNumber(this.state.phone_number))
        }
      })
    }
  }).catch(err=>
    {
      console.log(err)
    })
  }
  else{
    console.log('b')
  }
}
// Call ValidationComponent validate method
render() {
  return (
    <KeyboardAvoidingScrollView
    behavior={Platform.OS == "ios" ? "padding" : "height"}
    style={styles.container}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.inner}>
    <Text style={styles.header}>Header</Text>

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
    <PhoneVerifyer setModalVisible={this.closeModal} changeText={(val)=>this.onChangeText('code',val)} code={this.state.code} modalVisible={this.state.modalVisible} confirmCode={this.confirmCode} />
    <PhoneInput onChangePhoneNumber={val => this.onChangeText('phone_number', val)}  style={styles.textInput} value='+1' ref='phone' textProps={{placeholder:'Telephone number'}}/>
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
