import React, {Component} from 'react';
import {Text} from 'react-native';

export class AppText extends Component {
  render() {
    return (
      <Text>
        <Text style={{fontFamily: 'cochin', color: 'orange'}}>
          {this.props.children}
        </Text>
      </Text>
    );
  }
}
