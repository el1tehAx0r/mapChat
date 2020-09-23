import React, { Component } from 'react';
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
      <OutlinedTextField
      defaultValue={this.props.defaultValue}
        onChangeText={(value)=>this.changeText(value)}
        onSubmitEditing={this.onSubmit}
        ref={this.fieldRef}
      />
    );
  }
}
