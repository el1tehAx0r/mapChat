import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  NativeModules,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated
} from 'react-native';
import { calculateCornerResult, msToSec } from './index.js';
const { RNTrimmerManager: TrimmerManager } = NativeModules;
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row'
  },
  imageItem: {
    flex: 1,
    width: 50,
    height: 50,
    resizeMode: 'cover'
  },
  corners: {
    position: 'absolute',
    height: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightCorner: {
    position: 'absolute',
    flex: 1,
  },
  leftCorner: {
    left: 0
  },
  bgBlack: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width
  },

  bgTime: {
    width
  },

  cornerItem: {
    backgroundColor: 'gray',
    width: 20,
    height: 50
  },
  timeMarker: {
    backgroundColor: 'red',
    width: 5,
    height: 50
  }
});
export class Trimmer extends Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
    onChange: PropTypes.func
  };
  static defaultProps = {
    onChange: () => null
  };
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      duration: -1,
      leftCorner: new Animated.Value(0),
      rightCorner: new Animated.Value(0),
      timeMarker: new Animated.Value(0),
      layoutWidth: width
    };
    this.leftResponder = null;
    this.rightResponder = null;
    this.timeResponder=null;
    this._startTime = 0;
    this._endTime = 0;
    this._handleRightCornerMove = this._handleRightCornerMove.bind(this);
    this._handleLeftCornerMove = this._handleLeftCornerMove.bind(this);
    this._handleTimeMarkerMove= this._handleTimeMarkerMove.bind(this);
    this._retriveInfo = this._retriveInfo.bind(this);
    this._retrivePreviewImages = this._retrivePreviewImages.bind(this);
    this._handleRightCornerRelease = this._handleRightCornerRelease.bind(this);
    this._handleLeftCornerRelease = this._handleLeftCornerRelease.bind(this);
    this._handleTimeMarkerRelease=this._handleTimeMarkerRelease.bind(this);
  }
  componentWillMount() {
    // @TODO: Cleanup on unmount
    this.state.leftCorner.addListener(({ value }) => this._leftCornerPos = value);
    this.state.rightCorner.addListener(({ value }) => this._rightCornerPos = value);
    this.state.timeMarker.addListener(({ value }) => this._timeMarkerPos = value);
    this.leftResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {true},
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onMoveShouldSetPanResponder: (e, gestureState) =>{ Math.abs(gestureState.dx) > 0},
      onMoveShouldSetPanResponderCapture: (e, gestureState) => Math.abs(gestureState.dx) > 0,
      onPanResponderMove: this._handleLeftCornerMove,
      onPanResponderRelease: this._handleLeftCornerRelease
    });

    this.rightResponder = PanResponder.create({
 onStartShouldSetPanResponder: (evt, gestureState) => {true},
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onMoveShouldSetPanResponder: (e, gestureState) => Math.abs(gestureState.dx) > 0,
      onMoveShouldSetPanResponderCapture: (e, gestureState) => Math.abs(gestureState.dx) > 0,
      onPanResponderMove: this._handleRightCornerMove,
      onPanResponderRelease: this._handleRightCornerRelease
    });
    this.timeResponder = PanResponder.create({
 onStartShouldSetPanResponder: (evt, gestureState) => {true},
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onMoveShouldSetPanResponder: (e, gestureState) => Math.abs(gestureState.dx) > 0,
      onMoveShouldSetPanResponderCapture: (e, gestureState) => Math.abs(gestureState.dx) > 0,
      onPanResponderMove: this._handleTimeMarkerMove,
      onPanResponderRelease: this._handleTimeMarkerRelease
    });
    const { source = '' } = this.props;
    if (!source.trim()) {
      throw new Error('source should be valid string');
    }
    this._retrivePreviewImages();
    this._retriveInfo();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.source !== this.props.source) {
      this._retrivePreviewImages();
      this._retriveInfo();
    }
  }
  componentWillUnmount() {
    this.state.leftCorner.removeAllListeners();
    this.state.rightCorner.removeAllListeners();
    this.state.timeMarker.removeAllListeners();
  }
  _handleTimeMarkerRelease() {
    this.state.timeMarker.setOffset(this._timeMarkerPos);
    this.state.timeMarker.setValue(0);
  }
  _handleLeftCornerRelease() {
    this.state.leftCorner.setOffset(this._leftCornerPos);
    this.state.leftCorner.setValue(0);
  }
  _handleRightCornerRelease() {
    this.state.rightCorner.setOffset(this._rightCornerPos);
    this.state.rightCorner.setValue(0);
  }
  _handleTimeMarkerMove(e,gestureState){
    const { duration, layoutWidth } = this.state;
    const leftPos = this._leftCornerPos;
    const timePos=this._timeMarkerPos;
    console.log(timePos,'ZZZZZZZZZZ')
    console.log(layoutWidth)
    const rightPos = layoutWidth - Math.abs(this._rightCornerPos);
    const moveTime = gestureState.dx < 0;
    this._callOnChange();
    Animated.event([
      null, { dx: this.state.timeMarker}
     ])(e, gestureState);
  }
  _handleRightCornerMove(e, gestureState) {
    const { duration, layoutWidth } = this.state;
    const leftPos = this._leftCornerPos;
    const rightPos = layoutWidth - Math.abs(this._rightCornerPos);
    const moveLeft = gestureState.dx < 0;
    if (rightPos - leftPos <= 50 && moveLeft) {
      return;
    }
    this._endTime = calculateCornerResult(duration, this._rightCornerPos, layoutWidth, true);
    this._callOnChange();
    Animated.event([
      null, { dx: this.state.rightCorner }
     ])(e, gestureState);
  }
  _handleLeftCornerMove(e, gestureState) {
    const { duration, layoutWidth } = this.state;
    const leftPos = this._leftCornerPos;
    const rightPos = layoutWidth - Math.abs(this._rightCornerPos);
    const moveRight = gestureState.dx > 0;
    if (rightPos - leftPos <= 50 && moveRight) {
      return;
    }
    this._startTime = calculateCornerResult(duration, this._leftCornerPos, layoutWidth);
    this._callOnChange();
    console.log(this._startTime,'ZKZKZZJZK')
    console.log(this._leftCornerPos,'ZKZKZZJZK')
    Animated.event([
      null,
       { dx: this.state.leftCorner }
     ])(e, gestureState);
  }
  _callOnChange() {
    this.props.onChange({
      startTime: this._startTime,
      endTime: this._endTime
    });
  }
  _retriveInfo() {
    TrimmerManager
      .getVideoInfo(this.props.source)
      .then((info) => {
        this.setState(() => ({
          ...info,
          duration: msToSec(info.duration)
        }));
        this._endTime = msToSec(info.duration);
        this._startTime=msToSec(0)
      });
  }
  _retrivePreviewImages() {
    TrimmerManager
      .getPreviewImages(this.props.source)
      .then(({ images }) => {
        this.setState({ images },console.log(this.state.images));
      })
      .catch((e) => console.error(e));
  }
  renderLeftSection() {
    const { leftCorner, layoutWidth } = this.state;
    return (
      <Animated.View
        style={[styles.container, {
          left: layoutWidth,
          transform: [{
            translateX: leftCorner,
          }]
        }]}
        {...this.leftResponder.panHandlers}
      >
        <View style={styles.row}>
          <View style={styles.bgBlack} />
          <View style={styles.cornerItem} />
        </View>
      </Animated.View>
    );
  }
  renderRightSection() {
    const { rightCorner, layoutWidth } = this.state;
    return (
      <Animated.View
        style={[styles.container,  { right: width}, {
          transform: [{
            translateX: rightCorner
          }]
        }]}
        {...this.rightResponder.panHandlers}>
        <View style={styles.row}>
          <View style={styles.cornerItem} />
          <View style={styles.bgBlack} />
        </View>
      </Animated.View>
    )
  }
  renderTimeMarker() {
    const { timeMarker, layoutWidth } = this.state;
    return (
      <Animated.View
        style={[styles.container,  { left: 0 }, {
          transform: [{
            translateX:timeMarker
          }]
        }]}
        {...this.timeResponder.panHandlers}
      >
        <View style={styles.row}>
          <View style={styles.bgTime} />
          <View style={styles.timeMarker} />
          <View style={styles.bgTime} />
        </View>
      </Animated.View>
    )
  }
  render() {
    const { images } = this.state;
    return (
      <View
        style={styles.container}
        onLayout={({ nativeEvent }) => {
          this.setState({
            layoutWidth: nativeEvent.layout.width
          });
        }}
      >
        {images.map((uri,index) => (
          <Image
            key={`preview-source-${uri}-${index}`}
            source={{ uri }}
            style={styles.imageItem}
          />
        ))}
        <View style={styles.corners}>
{this.renderLeftSection()}
        {this.renderTimeMarker()}
{this.renderRightSection()}
        </View>
      </View>
    );
  }
}
