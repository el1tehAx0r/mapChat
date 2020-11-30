import React, { Component } from 'react';
import {TextInput} from 'react-native';
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'react-native-material-textfield';

export class DisplayName extends Component {

  constructor(props)
  {
    super(props);
    this.state={displayName:'hi'}
  }
  fieldRef = React.createRef();

  onSubmit = () => {
    let { current: field } = this.fieldRef;

    console.log(field.value());
  };
  changeText=(value)=>
  {
    this.props.onChangeText(value)
  }
  render() {
    return (
      <TextInput
      style={{width:80, height: 35, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => this.changeText(text)}
      value={this.props.defaultValue}
        ref={this.fieldRef}
    />
    );
  }
}
