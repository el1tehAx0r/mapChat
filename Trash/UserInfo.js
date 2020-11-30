
import React, {useState} from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
 import storage from '@react-native-firebase/storage';
 import firebase from '@react-native-firebase/app';
export async function GetUserInfo(userId) {
  try{
user=await firestore().collection('Users').doc(userId).get()
return user.data()
}
catch(err)
{
  console.log(err)
}
}
