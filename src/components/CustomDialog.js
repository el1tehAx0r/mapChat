import React, { useState,useEffect } from 'react';
import {StyleSheet,Modal,Alert, Text,TextInput,View,Button,TouchableHighlight,Image,KeyboardAvoidingView,TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import ModalContainer from './ModalContainer'
import ImagePicker from 'react-native-image-crop-picker'
import { Form, TextValidator } from 'react-native-validator-form';

import firebaseSDK from '../config/FirebaseSDK'
const CustomDialog= (props) => {
  return (
 <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose Media Type</Text>

            <TouchableHighlight
              style={{ ...styles.openButton,  }}
              onPress={() => {
props.videoFromLibraryPressed()
              }}
            >
              <Text style={styles.textStyle}>Video from Library</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton,  }}
              onPress={() => {
                props.photoFromCameraPressed()
              }}
            >
              <Text style={styles.textStyle}>Photo from Camera</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton,  }}
              onPress={() => {
                props.photoFromLibraryPressed()
              }}
            >
              <Text style={styles.textStyle}>Photo from Library
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton  }}
              onPress={() => {
              props.videoFromCameraPressed()
              }}
            >
              <Text style={styles.textStyle}>Video Camera</Text>
            </TouchableHighlight>


            <TouchableHighlight
              style={{ ...styles.openButton  }}
              onPress={() => {props.setDialogVisible();}}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
  );
}
export default CustomDialog;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 50,
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    borderRadius: 10,
    padding: 8,
    margin:5,
    elevation: 2
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
