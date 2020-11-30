import React, {useState} from 'react';
import { TouchableHighlight,Modal,StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const Separator = () => (
  <View style={styles.separator} />
);
const ButtonPage=({navigation})=>
{
  const [modalVisible,setModalVisible]=useState(false)
return(
  <SafeAreaView style={styles.container}>
  <MaterialIcons name={'store-outline'} size={50} />
    <View>
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
    <Separator />
    <View>
      <Button
        title="Signup"
        color="#f194ff"
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
    <Separator />
  </SafeAreaView>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default ButtonPage;
