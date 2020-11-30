import {PermissionsAndroid} from 'react-native';
class PermissionHandler{
requestLocationPermission= async()=> {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        'title': 'Example App',
        'message': 'Example App access to your location '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {} else {}
  } catch (err) {
    console.warn(err)
  }
}
}
const permissionHandler=new PermissionHandler();
export default permissionHandler;
