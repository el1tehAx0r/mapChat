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
import { useFocusEffect } from '@react-navigation/native';
import ButtonPage from './src/screens/ButtonScreen'
const Stack=createStackNavigator();
import {PermissionsAndroid} from 'react-native';
async function requestLocationPermission()
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Example App',
        'message': 'Example App access to your location '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
    }
  } catch (err) {
    console.warn(err)
  }
}
function App() {
  if (!__DEV__) {
  console.log = () => {};
}
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    console.log(user,'USER')
setUser(user);
    if (initializing) setInitializing(false)
  }
  useEffect(() => {
    let subscriber;

requestLocationPermission();


subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount

  }, []);

  useEffect(()=>
{

},[user])

const signOut=()=>{
  setUser(null);
}
if(initializing) return null;

  return (
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


      /*initializing?
        (<Stack.Screen name="SplashPage" component={SplashPage}/>
      ):*/
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
