import deepEqual from 'deep-equal'
class Utility{
  constructor() {
  }
  contains =(item,list)=> list.some(elem =>{
  return deepEqual(item,elem)
});

      makeid=(length)=> {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }
shallowEqual=(object1, object2)=>{
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}
  concatTwoStrings=(string1,string2)=>{
  let totalString;
if(string1.localeCompare(string2)>0)
{
  totalString=string1+string2
}
else{
  totalString=string2+string1
}
return totalString;
  }
  isEmpty=(obj)=>{

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
  getRandomCoordinates=(coordinates,radius)=>
  {
  var distances= this.getRandomDistanceXandY(radius)
  var xDistance=distances.xDistance/111000
  var yDistance=distances.yDistance/111000
  return ({latitude:coordinates.latitude+xDistance,longitude:coordinates.longitude+yDistance})
  }
  getRandomDistanceXandY=(distance)=>
  {
    var randomXDistance=this.getRandomNumber(distance);
    var randomYDistance=this.getRandomNumber(distance-Math.abs(randomXDistance));
    return ({xDistance:randomXDistance,yDistance:randomYDistance})
  }
  getRandomNumber=(distance)=>
  {
    var randomNumber=(Math.random()*(distance)*2)-(distance-1)
    return randomNumber
  }
    deg2rad=(deg)=> {
      return deg * (Math.PI/180)
    }
    // Set an initializing state whilst Firebase connects
    getDistanceFromLatLonInm=(lat1, lon1, lat2, lon2)=>{
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1);
      var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = (R * c)*1000;
      return d;
    }

    insideCircle=(lat1,lon1,lat2,lon2,radius)=>
    {
      if(this.getDistanceFromLatLonInm(lat1,lon1,lat2,lon2)<radius)
      {
        return true
      }
      else{
        return false
      }
    }

    GetFormattedDate=()=> {
      var todayTime = new Date();
      var month = format(todayTime .getMonth() + 1);
      var day = format(todayTime .getDate());
      var year = format(todayTime .getFullYear());
      return year+ "-" + month+ "-" + date;
    }

  requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};
            }
            const utility= new Utility();
            export default utility;
