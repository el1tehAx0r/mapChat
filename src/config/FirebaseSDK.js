import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';
import Geolocation from '@react-native-community/geolocation';
import storage from '@react-native-firebase/storage';
import Utility from './Utility'
const GeoFirestore=geofirestore.initializeApp(firestore());
let messageUnsub;
let chatUnsub;
let postUnsub;
class FirebaseSDK {
  constructor() {
  }
  login = async (email,password) => {
    return new Promise((resolve)=>
    {
      auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        resolve(true)
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        resolve(false)
        console.error(error);
      });
    })
  };
  userExist=async(email,username) =>{
    var doesUsernameExist=await this.variableExist('Users','displayName',username);
    var doesEmailExist= await this.variableExist('Users','email',email);
    if(!doesUsernameExist){
      if(!doesEmailExist){
        return false
      }
    }
    return true
  }
  variableExist=async(collection,field,value)=>{
    var result =await firestore()
    .collection(collection)
    .where(field,'==',value).get()
    if(result.size>=1)
    {
      console.log(field, ' exist');
      return true
    }
    else{
      console.log(field, value,' does not exist')
      return false
    }
  }
  createUser=async(email,username,password)=>{
    const geocollection = GeoFirestore.collection('Users');
    const postgeocollection= GeoFirestore.collection('Posts');
    const storegeocollection= GeoFirestore.collection('StorePosts');
    auth().createUserWithEmailAndPassword(email,password)
    .then(() => {
      var user = auth().currentUser;
      if (user) {
        geocollection.doc(user.uid).set({
          displayName: username,
          coordinates:new firebase.firestore.GeoPoint(2.5,2.3),
          email: email,
          photoURL:"",
        }).then(() => {
        postgeocollection.add({userReference:geocollection.doc(user.uid)._document,coordinates:new firebase.firestore.GeoPoint(0,0)}).then((post)=>{
        storegeocollection.add({userReference:geocollection.doc(user.uid)._document,postReference:post._document, coordinates:new firebase.firestore.GeoPoint(0,0),storeProfilePic:'https://firebasestorage.googleapis.com/v0/b/mapapp-1e662.appspot.com/o/storePhotos%2F2EEmr?alt=media&token=956bc3e7-a81e-4d4b-8410-b0e4c0d5bb3d',gridData:[],storeDescription:'',storeName:''}).then((storePost)=>{
        post.update({storeReference:storePost._document})
        geocollection.doc(user.uid).update({myStorePosts:storePost._document,myPosts:[post._document]}).then(()=>{console.log('zZZZZ')}).catch((err)=>{console.log(err)})
})
}).catch((err)=>{console.log(err)})
        }).catch((err)=>console.log(err))
      } else {
      }
      console.log('User account created & signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
    });}
placeStore=async(postId,coordinates)=>
{
   firestore().collection('Posts')
              .doc(postId.toString())
              .update({
                coordinates:new firebase.firestore.GeoPoint(coordinates.latitude,coordinates.longitude)
              })
              .then(() => {
                console.log('User updated!');
              }).catch((err)=>
              {
                console.log(err)
              })
}
getMessages=async (callback,userId,storeUid)=>{
  var chatId=Utility.concatTwoStrings(userId,storeUid);
  var bringl=await firestore().collection('Users').doc(userId).collection('Chats').doc(chatId).collection('Messages').get()
  bringl.forEach((item, i) => {
  });
  messageUnsub=firestore().collection('Users').doc(userId).collection('Chats').doc(chatId).collection('Messages').orderBy('createdAt','desc').limitToLast(20).onSnapshot(documentSnapshot=>
  {
    var messages=[];
  try{
  documentSnapshot.forEach((querySnapshot,index)=>{
    querySnapshot.data().createdAt=querySnapshot.data().createdAt.toDate()
  messages.push(querySnapshot.data())
  });
  callback(messages)
  }
  catch{
  }
  })
}

unsubMessages=()=>
{
  if(messageUnsub)
  {
  messageUnsub();
}
}
getChatData=async(callback,uid)=>
{
  chatUnsub=firestore().collection('Users').doc(uid).collection('Chats').orderBy('lastUpdated','desc').onSnapshot(documentSnapshot=>
  {
    var chats=[];
  try{
  documentSnapshot.forEach((querySnapshot,index)=>{
    querySnapshot.data().lastUpdated=querySnapshot.data().lastUpdated.toDate()
    querySnapshot.data().key=querySnapshot.id
  chats.push(querySnapshot.data())
  });
  callback(chats)
  }
  catch{
    console.log('didnt work')
  }
  })
}
unsubChat=()=>
{
  if(chatUnsub)
  {
    chatUnsub();
  }
}
sendMessages=async (messages,uid,storeUid)=>{
var chatId=Utility.concatTwoStrings(uid,storeUid);
let last;
for (var i in messages)
{
firestore().collection('Users').doc(uid).collection('Chats').doc(chatId).collection('Messages').add(messages[i])
firestore().collection('Users').doc(storeUid).collection('Chats').doc(chatId).collection('Messages').add(messages[i])
last=messages[i]
}
firestore().collection('Users').doc(uid).collection('Chats').doc(chatId).set({otherUser:storeUid,lastMessage:last,lastUpdated:firebase.firestore.FieldValue.serverTimestamp(),read:true})
firestore().collection('Users').doc(storeUid).collection('Chats').doc(chatId).set({otherUser:uid,lastMessage:last,lastUpdated:firebase.firestore.FieldValue.serverTimestamp(),read:false})
}

  getCurrentUserInfo=async()=>
  {
    var user = auth().currentUser;
    if(user)
    {
      try{
        var docRef = await firestore().collection('Users').doc(user.uid).get();
        var docRefData=docRef.data()
        docRefData.uid=user.uid;
        return docRefData
      }
      catch(err)
      {
        console.log(err)
      }
    }
  }
  updateSelfLocation=(uid)=>
  {
    return new Promise((resolve)=>{
      Geolocation.watchPosition((position)=>
      {
        firestore().collection('Users').doc(uid).update({coordinates:new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
        var coordinates={
          latitude:position.coords.latitude,
          longitude:position.coords.longitude
        }
        resolve(coordinates)
      },(err)=>{console.log(err)},{distanceFilter:5, enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })
    })
  }
      createpost=(uid,latitude,longitude,message,iconurl,media)=>
      {
        const userReference=firestore().collection('Users').doc(uid)
        const geocollection=GeoFirestore.collection('Posts');
        return new Promise((resolve)=>
        {
          console.log(latitude,longitude,'YASAASS')
          geocollection.add({userReference:userReference,message:message,iconUrl:iconurl,uid:uid,timestamp:firebase.firestore.FieldValue.serverTimestamp(),coordinates:new firebase.firestore.GeoPoint(latitude,longitude)}).then((post)=>{
            firestore().collection('Users').doc(uid).update({
              myPosts:firebase.firestore.FieldValue.arrayUnion(post._document),
            }).then(()=>{console.log('yayyyy');resolve(post)});
          });
        })
      }

getPosts=(callback,coordinates)=>
    {
      const postgeocollection = GeoFirestore.collection('Posts');
      const postquery = postgeocollection.near({ center: new firebase.firestore.GeoPoint(coordinates.latitude,coordinates.longitude), radius: 1000000 });
      postUnsub=postquery.onSnapshot((dog)=>{
        var centerPoints=dog.docs.map((markerInfo,index)=>{
          return {latitude:markerInfo.data().coordinates.latitude,longitude:markerInfo.data().coordinates.longitude, id:markerInfo.id,iconUrl:markerInfo.data().iconUrl}
        })
        callback(centerPoints)
        if(dog.docs.length==0)
        {
          callback([])
        }
      })
    }
unsubPosts=()=>
{
  if(postUnsub)
  {
  postUnsub();
}
}
    editPost=(postId,message,shopAddress,iconUrl,expirationDate,imageUrl)=>
    {
      const geocollection=GeoFirestore.collection('Posts');
      return new Promise((resolve)=>
      {
        geocollection.doc(postId).update({expirationDate:expirationDate,shopAddress:shopAddress,message:message,iconUrl:iconUrl,timestamp:firebase.firestore.FieldValue.serverTimestamp(),imageUrl:imageUrl}).then((post)=>{console.log(post,'this is post'); resolve(post)});
      })
    }
    deletePost=(uid,postId)=>
    {
      var postRef=firestore().collection('Posts').doc(postId).get().then((post)=>
      {
        firestore().collection('Users').doc(uid).update({
          myPosts:firebase.firestore.FieldValue.arrayRemove(post._ref),
        }).then(()=>
        {
          firestore().collection('Posts').doc(postId).delete().then((checking) => {console.log('postDeleted!');});
        })
      });
    }
    getPostByReference =async(docRef)=>{
      return new Promise((resolve)=>{
        var docSnapshot = docRef.get().then((snapshot)=>console.log(resolve(snapshot.data()),'zzzz'))
      })
    }
    getPost=async (pid)=>
    {
      var docRef = await firestore().collection('Posts').doc(pid).get();
      return docRef;
    }
    setStore=async(uid,storeId,postId,gridData,profilePic,description,name)=>
    {
      console.log(postId,'zZZZ')
      firestore().collection('Posts').doc(postId.toString()).update({iconUrl:profilePic});
        firestore().collection('StorePosts').doc(storeId.toString()).update({gridData:gridData,storeProfilePic:profilePic,storeDescription:description,storeName:name}).then((storePost)=>{
          this.storageUpdatedGridData(gridData,storeId.toString(),'StorePosts').then((newGridData)=>{
          console.log(newGridData,'newGridData')
        firestore().collection('StorePosts').doc(storeId.toString()).update({gridData:newGridData}).then((storePost)=>{})
          })
        })
    }
    getSnapshotFromRefernce=async(callback,reference)=>
    {
      var snapshotUnsub=reference.onSnapshot((documentSnapshot)=>
    {
      callback(documentSnapshot);
    })
    return snapshotUnsub;
    }
    storageUpdatedGridData=async (gridData,storeId,collectionName)=>
    {
      console.log(gridData,'asdklfjsdlk')
      return new Promise(async (resolve)=>
      {
      const remotePathArray=await  Promise.all(
        gridData.map(async (data) => {
          console.log(data,'DAN')
            var remotePath='storePhotos/'+data.key
        if (!(data.media.path.includes('firebasestorage.googleapis.com'))){
          var firebaseStorageUrl=await this.addtoStorageNoDbUpdate(remotePath,data.media.path)
          console.log(firebaseStorageUrl,'ksdjkldjlkaaaaaaa')
          return firebaseStorageUrl}
          else{
            return data.media.path
          }
        }))
      console.log(remotePathArray,'REMOTEPATHS');
      const tempGridData= gridData.map((a) =>{var tempObject=Object.assign({}, a)
      tempObject.media=Object.assign({},tempObject.media); return tempObject;
    });
      console.log(tempGridData,'asdlkjflAAAAAAAtinietempah')
      for(var i in tempGridData){
        if (!(tempGridData[i].media.path.includes('firebasestorage.googleapis.com'))){
        tempGridData[i].media.path=remotePathArray[i];
        }
      }
      console.log(tempGridData,'tinietempah')
     resolve(tempGridData)
    })
      }
      addtoStorageNoDbUpdate=async(remotePath,localPath)=>{
        return new Promise((resolve)=>{
          const reference=storage().ref(remotePath)
          reference.putFile(localPath).then((path)=>{console.log(path)
            storage()
            .ref(remotePath)
            .getDownloadURL().then((url)=>{console.log('theurlforthing is',url);resolve(url)}).catch((err)=>{console.log(err)})
          }
        )
      }
    )
    }
    addToStorage=async(remotePath,localPath,collectionName,documentName,field)=>
    {
      return new Promise((resolve)=>{
        const reference=storage().ref(remotePath)
        reference.putFile(localPath).then((path)=>{console.log(path)
          storage()
          .ref(remotePath)
          .getDownloadURL().then((url)=>{
            var urlToString=url+''
            firestore().collection(collectionName)
            .doc(documentName)
            .update({
              [field]:url,
            })
            .then(() => {
              console.log('User updated!');
              resolve(url)
            }).catch((err)=>
            {
              console.log(err)
            });}
          );
        })})
      }
      addToPhotoGallery=async(storagePath,localPath,collectionName,documentName,field,galleryArray)=>
      {
        return new Promise((resolve)=>{
          const reference=storage().ref(storagePath)
          reference.putFile(localPath).then((path)=>{console.log(path)
            storage()
            .ref(storagePath)
            .getDownloadURL().then((url)=>{
              var urlToString=url+''
              console.log(urlToString,'lskjdfkls',url)
              console.log(collectionName,'zzzzzzzz')
              console.log(documentName,'sdklfjskldjf')
              firestore().collection(collectionName)
              .doc(documentName)
              .update({
                [field]:galleryArray,
              })
              .then(() => {
                console.log('User updated!');
                resolve(url)
              }).catch((err)=>
              {
                console.log(err)
              });}
            );
          })})
        }
      }


      const firebaseSDK = new FirebaseSDK();
      export default firebaseSDK;
