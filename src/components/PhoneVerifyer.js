
import React, {useState} from 'react'
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
import PhoneInput from 'react-native-phone-input'
import auth from '@react-native-firebase/auth';

export default function PhoneVerifyer(props) {
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  async function confirmCode() {
    try {
      await props.confirmCode()
      //await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }
  return (
     <Modal   animationType="slide"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Six Digit Verification Code</Text>
    <TextInput style={styles.textInput} placeholder={'######'}  placeholderTextColor='grey' onChangeText={val=> props.changeCode(val)} keyboardType={'phone-pad'} maxLength={6} value={props.code} />
    <View flexDirection="row">
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                props.closeModal();
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>

    <Button title="Confirm" onPress={()=> confirmCode()} />
            </View>
          </View>
        </View>
      </Modal>
  );
}
const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36
  },
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
    padding: 35,
    alignItems: "center",
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
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
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
