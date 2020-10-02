import React, { Component } from 'react';
import {Modal,ScrollView,Button,Dimensions, Animated,TouchableHighlight, View,Image, Text,TextInput,StyleSheet,TouchableOpacity } from 'react-native';
import styles from '../StyleSheet'

export default function ModalContainer(props){
return (
            <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
            {props.children}
            </View>
            </View>
            </Modal>

        )
}
