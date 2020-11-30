import React, {useState} from 'react';
import { TouchableHighlight,Modal,StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createStackNavigator } from '@react-navigation/stack';
const Separator = () => (
  <View style={styles.separator} />
);
const SplashPage=({navigation})=>
{
return(
    <View style={{alignItems:'center',justifyContent:'center'}}>
  <MaterialIcons name={'store-outline'} size={100} />
    </View>
)
}
export default SplashPage;
