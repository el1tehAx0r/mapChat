import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';
import Geolocation from '@react-native-community/geolocation';
import storage from '@react-native-firebase/storage';
import Utility from './Utility'
const GeoFirestore=geofirestore.initializeApp(firestore());
let messageUnsub;
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
          console.log('OMGGGG');
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
getMessages=(callback,userId,storeUid)=>{
  var chatId=Utility.concatTwoStrings(userId,storeUid);
  messageUnsub=firestore().collection('Chats').doc(chatId).collection('Messages').orderBy('createdAt','asc').limitToLast(20).onSnapshot(documentSnapshot=>
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
    console.log('didnt work')
  }
  })
}
sendMessages=(messages,userId,storeUid)=>{
var chatId=Utility.concatTwoStrings(userId,storeUid);
for (var i in messages)
{
firestore().collection('Chats').doc(chatId).collection('Messages').add(messages[i])
}
}
unsubMessages=()=>
{
  if(messageUnsub)
  {
  messageUnsub();
}
}

/*sendMessages=async (messages,userId,storeId)=>{
  try{
var messageGroup=firestore().collection('Chats').where('users', 'array-contains', storeId+userId).collection('Messages')
    for (var i in messages)
    {
    messageGroup.add({messages[i]})
    }
  }
  catch{
  firestore().collection('Chats').set({users:[storeId+userId,userId+storeId]}).then(()=>{
var messageGroup= firestore().collection('Chats').where('users', 'array-contains', storeId+userId).collection('Messages')
    for (var i in messages)
    {
    messageGroup.add({messages[i]})
    }
  })
  }
}*/
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

      createcouponpost=(uid,message,media,expirationDate)=>
      {
        const userReference=firestore().collection('Users').doc(uid)
        const couponcollection=firestore().collection('CouponPosts');
        return new Promise((resolve)=>
        {
          couponcollection.add({userReference:userReference,message:message,uid:uid,media:media,expirationDate:expirationDate,timestamp:firebase.firestore.FieldValue.serverTimestamp()}).then((post)=>{
            firestore().collection('Users').doc(uid).update({
              myCouponPosts:firebase.firestore.FieldValue.arrayUnion(post),
            }).then(()=>{console.log('yayyyy');resolve(post)});
          });
        })
      }
  createcoupon=async (uid,message,media,count,expirationDate,radius,coordinates,iconUrl)=>
  {
  var postsInRadius=  GeoFirestore.collection('Posts').near({center:new firebase.firestore.GeoPoint(coordinates.latitude,coordinates.longitude), radius:100000});
  var couponArray=[]
  var promises=[]
  console.log(media,'MEDIAISJDKFSJL')
  var createdCoupon=await this.createcouponpost(uid,message,media,expirationDate)
      var couponId=createdCoupon._documentPath._parts[1]
      var remotePath='media/'+couponId
      var localPath=media.path
      var collectionName='CouponPosts'
      var documentName=couponId
      var field='media.path'
  var firebaseMediaUrl= await firebaseSDK.addToStorage(remotePath,localPath,collectionName,documentName,field)
      var iconRemotePath='iconUrl/'+couponId
      var iconLocalPath=iconUrl
      var field='iconUrl'
    var firebaseIconUrl =await firebaseSDK.addtoStorageNoDbUpdate(iconRemotePath,iconLocalPath)
for(var i = 0; i <count; i++){
    var overlapCheck=true;
    while (overlapCheck)
   {
var testCoordinates=Utility.getRandomCoordinates(coordinates,radius);
console.log(testCoordinates,'testCoordinates')
      for (var posts in postsInRadius){
if(Utility.getDistanceFromLatLonInm(coordinates.latitude,coordinates.longitude,testCoordinates.latitude,testCoordinates.longitude)<15){
  break;
}
}
var createdPost=  await this.createpost(uid,testCoordinates.latitude,testCoordinates.longitude,message,firebaseIconUrl,firebaseMediaUrl)
    createdPost._document.update({couponReference:createdCoupon})
    promises.push(createdPost._document);
  couponArray.push(createdPost);
  //getting Data
  var createdPostData=await createdPost._document.get()
  console.log(createdPostData.data(),'dATA')
   postsInRadius[createdPost._document.id]=createdPostData
  overlapCheck=false
   }
 }
 Promise.all(promises).then((values)=>{console.log(values,'OMGMKSD');createdCoupon.update({postReferences:values,'media.path':firebaseMediaUrl,iconUrl:iconUrl})})
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

    getCouponPost=async (pid)=>
    {
      var docRef = await firestore().collection('CouponPosts').doc(pid).get();
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
