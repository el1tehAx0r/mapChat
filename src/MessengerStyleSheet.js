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
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
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
    container: {
        backgroundColor: '#cccccc',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    username:{
      fontWeight: "bold"
    },
    text:{
color:'black'
    },
    rowFront: {
        alignItems: 'flex-start',
        backgroundColor: '#a9a9a9',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height:90,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    }
})
export default styles;
