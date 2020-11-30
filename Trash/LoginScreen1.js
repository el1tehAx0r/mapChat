import React, { useState, useEffect } from 'react';
import { View, ScrollView,Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginScreen from 'react-native-login-screen';
import firebaseSDK from '../config/FirebaseSDK';
function LoginPage() {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [spinnerVisibility,setSpinnerVisibility]=useState('');
  // Set an initializing state whilst Firebase connects


const loginClicked=()=>{
  firebaseSDK.login('a','b')
}
  useEffect(()=>{
    console.log(username," ",password)
  })
  return (
    <ScrollView>
    <LoginScreen
    spinnerEnable
usernameOnChangeText={(username)=>setUsername(username)}
passwordOnChangeText={(password)=>setPassword(password)}
  onPressLogin={()=>{loginClicked()}}
    />
    </ScrollView>
  );
  }


export default LoginPage;
/*const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});*/
