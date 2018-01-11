/**
 * @flow
 */

import React from 'react';
import { Text, View } from 'react-native';

import { Wrapper } from './style';

class Splash extends React.Component<{}> {
  render() {
    return (
      <Wrapper>
        <View testID="welcome">
          <Text>Open up App.js to start working on your app!</Text>
        </View>
      </Wrapper>
    );
  }
}

export default Splash;
