import React, { useState, useEffect } from 'react';
import {Button, TouchableHighlight, View,Image, Modal, Text,TextInput,StyleSheet,ScrollView,TouchableOpacity,ImageBackground } from 'react-native';
import StorePage from './StoreScreen.js'
import EditButtonSet from '../components/EditButtonSet'
export default function storePage(props)
{
return( <StorePage signOut={props.signOut} storeId={props.storeId} myStore={props.myStore} uid={props.uid} postIdStore={props.postIdStore}><EditButtonSet/></StorePage>)
}
