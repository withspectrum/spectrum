/**
 * @flow
 */

import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { Wrapper } from './style';

class Splash extends Component {
  render() {
    return (
      <View testID="welcome">
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

export default Splash;
