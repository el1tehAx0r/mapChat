import {StyleSheet,Dimensions} from 'react-native'
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height*0.25;
const CARD_WIDTH = width * 0.7;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const PIN_STRIP_HEIGHT='20%';
const PIN_STRIP_HEIGHT_PIXELS=0.35*height;
const PIN_STRIP_WIDTH='12%';
const MARKER_SIZE=width*0.1;
        const styles=StyleSheet.create({
           overlay: {
    position: 'absolute',
    bottom:50,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
          pinStrip: {
            position:'absolute',
            marginTop: Platform.OS === 'ios' ? 40 : 20,
            flexDirection:"column",
            backgroundColor: '#fff',
            width: '12%',
            height:'45%',
            opacity:0.6,
            borderRadius: 5,
            left:width*0.85,
            padding: 10,
            shadowColor: '#ccc',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 10,
          },
          cardtitle: {
            fontSize: 12,
            // marginTop: 5,
            fontWeight: "bold",
          },
          card: {
            // padding: 10,
            elevation: 2,
            backgroundColor: "#FFF",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            marginHorizontal: 10,
            shadowColor: "#000",
            shadowRadius: 5,
            shadowOpacity: 0.3,
            shadowOffset: { x: 2, y: -2 },
            height: CARD_HEIGHT,
            width: CARD_WIDTH,
            overflow: "hidden",
          },
          cardImage: {
            flex: 3,
            width: "100%",
            height: "100%",
            alignSelf: "center",
          },
          /*container: {
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'flex-end',
          alignItems: 'center',
        },*/
        container:{
          flex:1,
        },
        map: {
          ...StyleSheet.absoluteFillObject,
        },
        bottomBorder:
        {
          flexDirection:'row',flex:2,
          borderBottomColor:'black',
          borderBottomWidth:1  },
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
        })
export default styles;
