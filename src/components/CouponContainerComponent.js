import React, { useState, useEffect,useRef } from 'react';
import { StyleSheet, Image,Text, SafeAreaView, ScrollView,View } from 'react-native';
import FirebaseSDK from '../config/FirebaseSDK'
import CouponComponent from './CouponComponent'
import PostViewer from './PostViewer'
const Separator = () => (
  <View style={styles.separator} />
);
const CouponContainerComponent= (props) => {
const [coupons,setCoupons]=useState([])
const couponPressed=(couponId)=>
{

  console.log(couponId)
}
const renderCoupon=(couponId,message,expirationDate,imageUrl,postViewerInfo,claimedCoupons)=>
{
  console.log(message,expirationDate,imageUrl)
  console.log(postViewerInfo,'psoidjfioj')
  return( <><CouponComponent uid={props.uid} couponId={couponId} message={message} postViewerInfo={postViewerInfo} claimedCoupons={claimedCoupons} expirationDate={expirationDate} imageUrl={imageUrl} onPress={couponPressed}/></>)
}
useEffect(()=>
{
    async function fetchCoupons() {
      var theCoupons=[]
  for (var i in props.coupons)
  {

    var couponRefs=await FirebaseSDK.getPost(props.coupons[i])
    console.log(couponRefs.data())
    theCoupons.push(couponRefs.data())
    var holder=couponRefs.data()
    holder.postId=props.coupons[i]
    console.log(holder,'hollllderr')
    theCoupons=renderCoupon(props.coupons[i],couponRefs.data().message,couponRefs.data().expirationDate,couponRefs.data().image, holder,props.coupons)
  }
  console.log(theCoupons)
  setCoupons(theCoupons)
    }
    fetchCoupons()
},[props.coupons])
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.scrollView}>

      {coupons}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  text: {
    fontSize: 20,
  },

bottomBorder:
{
  flexDirection:'row',flex:2,
  borderBottomColor:'black',
  borderBottomWidth:1  },
    centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width:'90%',
    height:'90%',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
export default CouponContainerComponent;
