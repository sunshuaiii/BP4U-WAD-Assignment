import React, {Component} from 'react';
import {Text} from 'react-native';
import {AppText} from '../components/AppText';

export class AppHeaderText extends Component {
  render() {
    return (
      <AppText>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          {this.props.children}
        </Text>
      </AppText>
    );
  }
}
