// @flow
import React, { type Node } from 'react';
import { Linking, Text } from 'react-native';
import { WebBrowser } from 'expo';

type LinkProps = {
  href: string,
  children: Node,
};

type ButtonProps = {
  onPress: () => void,
  children: Node,
};

type Props = LinkProps | ButtonProps;

export default class Anchor extends React.Component<Props> {
  handlePress = () => {
    if (typeof this.props.onPress === 'function') return this.props.onPress();
    if (typeof this.props.href === 'string')
      return WebBrowser.openBrowserAsync(this.props.href);
  };

  render() {
    return (
      <Text {...this.props} onPress={this.handlePress}>
        {this.props.children}
      </Text>
    );
  }
}
