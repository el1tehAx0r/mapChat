import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';
import Geolocation from '@react-native-community/geolocation';
 import storage from '@react-native-firebase/storage';
const GeoFirestore=geofirestore.initializeApp(firestore());
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
          console.log('User added!');
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

    /*  createUser=async(phone_number,email,username,password)=>{
    auth().createUser({
    email: email,
    emailVerified: false,
    phoneNumber: phone_number,
    password: password,
    displayName: username,
    photoURL: '',
    disabled: false
  }).then(() => {
  var user = auth().currentUser;
  if (user) {
  console.log(user)
  geocollection.doc(user.uid).set({
  DisplayName: username,
  Email: email,
  PPPathDb:"",
  PhoneNumber:password,
  Username:username,
}).then(() => {
console.log('User added!');
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
});}*/

createUserHardCode=async(phone_number,email,username,password)=>{
  const geocollection = GeoFirestore.collection('Users');
  auth().createUserWithEmailAndPassword('bennyz5@gmail.com','Littledude1!')
  .then(() => {
    var user = auth().currentUser;
    if (user) {
      console.log(user)
      geocollection.doc(user.uid).set({
        phoneNumber: '+12222222222',
        coordinates:new firebase.firestore.GeoPoint(2.5,2.3),
        displayName: 'bennyz5',
        photoURL: 'https://scontent-ort2-1.xx.fbcdn.net/v/t1.0-9/117817111_308049447197739_3150057679575135482_n.jpg?_nc_cat=104&_nc_sid=09cbfe&_nc_ohc=873vxbPNBmoAX_wxMQc&_nc_ht=scontent-ort2-1.xx&oh=74cf666bcd67a1d332313ba3d4636c8a&oe=5F8568B9',}
      )
      .then(() => {
        console.log('User added!');
      }).catch((err)=>console.log(err))

      auth().currentUser.updateProfile({
        displayName: 'bennyz5',
        photoURL: 'http://www.example.com/12345678/photo.png',
      }).then((me)=>{console.log(user)}).catch((err)=>console.log(err))
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

  getCurrentUserInfo=async()=>
  {
    var user = auth().currentUser;
    if(user)
    {
      try{
        console.log(user,'THIS IS USER')
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

            sendMessage=(senderId,recieverId,chatId,message)=>
            {
              firestore().collection('Messages').add({senderUid:senderUid,recieverUid:recieverUid,message:message,timestamp:firestore().FieldValue.serverTimestamp()}).then((messageId)=>{
                firestore().collection('Chats').doc(chatId).update({messages:firestore().FieldValue.arrayUnion(messageId)})})
              }
              createChat=(senderUid,recieverUid,message)=>
              {
                firestore().collection('Messages').add({senderUid:senderUid,recieverUid:recieverUid,message:message}).then((messageId)=>{
                  firestore().collection('Chats').add({participants:[senderUid,recieverUid],messages:[messageId]}).then((chatId)=>
                  {
                    firestore.collection('Users').doc(senderUid).update({chats:firestore().FieldValue.arrayUnion(chatId)})
                    firestore.collection('Users').doc(recieverUid).update({chats:firestore().FieldValue.arrayUnion(chatId)})
                  })})
                }

                createPost=(uid,latitude,longitude,message,iconUrl,media)=>
                {
                  const userReference=firestore().collection('Users').doc(uid)
                  const geocollection=GeoFirestore.collection('Posts');
                  return new Promise((resolve)=>
                  {
                    geocollection.add({userReference:userReference,message:message,iconUrl:iconUrl,uid:uid,timestamp:firebase.firestore.FieldValue.serverTimestamp(),coordinates:new firebase.firestore.GeoPoint(latitude,longitude)}).then((post)=>{
                      firestore().collection('Users').doc(uid).update({
                        myPosts:firebase.firestore.FieldValue.arrayUnion(post._document),
                      }).then(()=>{console.log('yayyyy');resolve(post)});
                    });
                  })
                }
                createCouponGroup= async (uid,latitude,longitude,message,shopAddress,iconUrl,expirationDate,imageUrl,count,distance,storeAddress)=>
                {
                var couponList=[]
                for (var i in couponList)
                {
                currentPost=await createPost(uid,latitude,longitude,message,shopAddress,iconUrl,expirationDate,imageUrl)
                  couponList.append(currentPost);
                }
                  const geocollection=GeoFirestore.collection('CouponGroup');
                  return new Promise((resolve)=>
                  {
                    geocollection.add({op:uid,expirationDate:expirationDate,shopAddress:shopAddress,message:message,iconUrl:iconUrl,uid:uid,timestamp:firebase.firestore.FieldValue.serverTimestamp(),imageUrl:imageUrl,couponList:couponList}).then((post)=>{
                      firestore().collection('Users').doc(uid).update({
                        myCouponGroups:firebase.firestore.FieldValue.arrayUnion(post._document),
                      }).then(()=>{console.log('yayyyy');resolve(post)});
                    });
                  })

              }
                deleteCouponGroup=async (uid,groupId)=>
                {
                var postRef=firestore().collection('CouponGroup').doc(groupId).get().then((posts)=>
              {
                for (var i in posts)
                {
            deletePost(post[i]);
                }
                  firestore().collection('Users').doc(uid).update({
                    myCouponGroups:firebase.firestore.FieldValue.arrayRemove(groupId),
                  }).then(()=>
                {
                  firestore().collection('CouponGroup').doc(groupId).delete().then((checking) => {console.log('postDeleted!');});
                })
              }
    );

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

                unclaimCoupon=async(uid,couponId)=>
                {
                  var docRefCoupon = await firestore().collection('Posts').doc(couponId);
                  var docRefUser = await firestore().collection('User').doc(uid);
                  firestore().collection('Users').doc(uid).update({
                    claimedCoupons: firebase.firestore.FieldValue.arrayRemove(docRefCoupon),
                  })
                  firestore().collection('Posts').doc(couponId).update({
                    usersClaimed: firebase.firestore.FieldValue.arrayRemove(docRefUser),
                  })
                }
                claimCoupon=async(uid,couponId)=>
                {
                  var docRefCoupon = await firestore().collection('Posts').doc(couponId);
                  var docRefUser = await firestore().collection('User').doc(uid);
                  firestore().collection('Users').doc(uid).update({

                    claimedCoupons:firebase.firestore.FieldValue.arrayUnion(docRefCoupon),
                  })
                  firestore().collection('Posts').doc(couponId).update({
                    usersClaimed:firebase.firestore.FieldValue.arrayUnion(docRefUser),
                  })
                }

                activateCoupon=async(uid,couponId,timeStamp)=>
                {
                  var docRefUser = await firestore().collection('User').doc(uid);
                  firestore().collection('Users').doc(uid).update({

                    activatedCoupons:firebase.firestore.FieldValue.arrayUnion({couponId:couponId,timeStamp:timeStamp}),
                  })
                }
                getCreatedCoupons=async(uid,couponIds)=>
                {
                  var coupons=[]
                  var docRef = await firestore().collection('Posts').doc(pid).get();
                  await couponIds.forEach(async(couponId)=> {
                    var docRef = await firestore().collection('Posts').doc(couponId).get();
                  });
                }
                getClaimedCoupons=async(uid,couponIds)=>
                {
                  var coupons=[]
                  await couponIds.forEach(async (couponId)=> {
                    var docRef = await firestore().collection('Posts').doc(couponId).get();
                  });
                }
                createBoardPost=async (uid,message,media,postId)=>
                {
                  const userReference=firestore().collection('Users').doc(uid.toString())
                  const postReference=firestore().collection('Posts').doc(postId.toString())
                  const boardpostcollection=firestore().collection('BoardPosts');
                  return new Promise((resolve)=>
                  {
                    boardpostcollection.add({userReference:userReference,message:message,uid:uid,timestamp:firebase.firestore.FieldValue.serverTimestamp(),media:media,postReference:postReference}).then((boardPost)=>{
                      firestore().collection('Posts').doc(postId.toString()).update({
                        boardPosts:firebase.firestore.FieldValue.arrayUnion(boardPost),
                      }).then(()=>{console.log('yayyyyPostid');});
                   firestore().collection('Users').doc(uid.toString()).update({
                        myBoardPosts:firebase.firestore.FieldValue.arrayUnion(boardPost),
                      }).then(()=>{console.log('yayyyy')});
                      resolve(boardPost)
                    });
                  })
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
