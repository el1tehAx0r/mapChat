import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginPage from './src/screens/LoginScreen';
import SignupPage from './src/screens/SignupScreen';
import ProfilePage from './src/screens/ProfileScreen';
import { NavigationContainer } from '@react-navigation/native';
import SplashPage from './src/screens/SplashScreen'
import MainNavigator from './src/screens/MainNavigator';
import firestore from '@react-native-firebase/firestore';
import { createStackNavigator } from '@react-navigation/stack';
import firebaseSDK from './src/config/FirebaseSDK';
const Stack=createStackNavigator();
function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  function waitUserInfoUpdated (user){
  const query=firestore().collection('Users').doc(user.uid).get().then(
    (querySnapshot)=>
    {
      console.log(querySnapshot,'BIG')
      if (querySnapshot.data()==undefined)
      {
        console.log(querySnapshot.data())
        waitUserInfoUpdated(user)
      }
      else{
        console.log(querySnapshot.data())
        setUser(user)
    if (initializing) setInitializing(false)
      }
    }
  )
  }
  function onAuthStateChanged(user) {
    //setUser(user);
    if(user!=null)
    {

      console.log(user,'THIS IS USER')
waitUserInfoUpdated(user)
    }
else{setUser(user)}
if(initializing) setInitializing(false)
//    firebaseSDK.getCurrentUserInfo().then((userInfo)=>{
 // })
  }
  useEffect(() => {

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
if (initializing) return null;
  return (
        <NavigationContainer>
      <Stack.Navigator>
 {user== null ? (
<>
<Stack.Screen name="Splash" component={SplashPage}/>
<Stack.Screen name="Login" component={LoginPage}/>
<Stack.Screen name="Signup" component={SignupPage}/>
   </>) :
    (<><Stack.Screen name="MainNavigator" component={MainNavigator} initialParams={{user:user}}/></>)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


//<Stack.Screen name="Login" component={LoginPage} />
//<Stack.Screen name="SignupPage" component={SignupPage} options={{title:''}}/>

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

export default App;
