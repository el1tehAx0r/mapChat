import {StyleSheet,Dimensions} from 'react-native'
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height*0.25;
const CARD_WIDTH = width * 0.7;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const PIN_STRIP_HEIGHT='20%';
const PIN_STRIP_HEIGHT_PIXELS=0.35*height;
const PIN_STRIP_WIDTH='12%';
const MARKER_SIZE=width*0.1;

const draggableGridStyles = StyleSheet.create({
  button:{
    width:150,
    height:100,
    backgroundColor:'blue',
  },
  wrapper:{
    paddingTop:30,
    width:'100%',
    height:'100%',
    justifyContent:'center',
  },
  item:{
    width:100,
    height:100,
    borderRadius:8,
    backgroundColor:'red',
    justifyContent:'center',
    alignItems:'center',
  },
  item_text:{
    fontSize:40,
    color:'#FFFFFF',
  },
});
const styles=StyleSheet.create({
    close: {
    margin: 5,
    position: "absolute",
    top: 0,
    left: 0,
    width: 25,
    height: 25,
    color: "tomato"
  },
   input: {
    width:'85%',
    borderBottomColor:'red',
    borderBottomWidth:1,
},
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowView:{flexDirection:'column'},
  width:width,
  height:height,
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
  paddingBottom:10,
  borderBottomWidth:1  },

separation:
{
  flexDirection:'row',flex:1,
  borderBottomColor:'black',
  borderBottomWidth:1  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8
  },
  modalView: {
    width:'93%',
    height:'98%',
    margin: 10,
    padding:10,
    backgroundColor: "white",
    alignItems: "stretch",
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
    height:39,
    marginTop:10,
    marginLeft:5,
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  addButton: {
    backgroundColor: "#F194FF",
    width:width/8,
    height:width/8,
    padding: 15,
    elevation: 2
  },
  closeButton: {
    borderColor:"#000000",
    borderWidth:1,
    height:39,
    marginTop:10,
    marginRight:-15,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  xTextStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
    rowFront: {
        alignItems: 'flex-start',
        backgroundColor: '#a9a9a9',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height:90,
    },
})
export {width, draggableGridStyles}
export default styles;
