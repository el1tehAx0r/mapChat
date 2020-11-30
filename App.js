import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginPage from './src/screens/LoginScreen';
import SignupPage from './src/screens/SignupScreen';
import { NavigationContainer } from '@react-navigation/native';
import SplashPage from './src/screens/SplashScreen'
import MainNavigator from './src/screens/MainNavigator';
import firestore from '@react-native-firebase/firestore';
import { createStackNavigator } from '@react-navigation/stack';
import firebaseSDK from './src/config/FirebaseSDK';
import { useFocusEffect } from '@react-navigation/native';
import ButtonPage from './src/screens/ButtonScreen'
import PermissionHandler from './src/config/PermissionHandler'
const Stack=createStackNavigator();
function App() {
  if (!__DEV__) {console.log = () => {};}
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false)
  }
  useEffect(() => {
    let subscriber;
    PermissionHandler.requestLocationPermission();
    subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  const signOut = () => {
    setUser(null);
  }
  if (initializing) return null;  return (
    <NavigationContainer>
    <Stack.Navigator>
    {user==null ? <>
      <Stack.Screen name="Welcome To The MapMarket!" component={ButtonPage}/>
      <Stack.Screen name="Login" component={LoginPage}/>
      <Stack.Screen name="Signup" component={SignupPage}/>
      </>
      : <><Stack.Screen name="Welcome To The MapMarket!" component={MainNavigator} initialParams={{user:user}}

      />
      </>
    }
    </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
