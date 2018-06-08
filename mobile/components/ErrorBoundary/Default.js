// @flow
import * as React from 'react';
import { View, Text } from 'react-native';

class DefaultErrorScreen extends React.Component<{}> {
  render() {
    return (
      <View>
        <Text>Oops, something went wrong! Our team has been alerted</Text>
      </View>
    );
  }
}

export default DefaultErrorScreen;
