// @flow
import React, { type Node } from 'react';
import { Linking, Text } from 'react-native';
import { WebBrowser } from 'expo';

type Props = {
  href: string,
  children?: Node,
  onPress?: Function,
};

export default class Anchor extends React.Component<Props> {
  handlePress = () => {
    WebBrowser.openBrowserAsync(this.props.href);
    this.props.onPress && this.props.onPress();
  };

  render() {
    return (
      <Text {...this.props} onPress={this.handlePress}>
        {this.props.children}
      </Text>
    );
  }
}
