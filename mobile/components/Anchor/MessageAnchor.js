// @flow
import React, { type Node } from 'react';
import { Share } from 'react-native';
import { MessageAnchorText } from './style';
import { WebBrowser } from 'expo';

type LinkProps = {
  href: string,
  children: Node,
};

type ButtonProps = {
  onPress: () => void,
  children: Node,
};

// Either URL or message has to be defined
export type ShareContent =
  | {
      url: string,
      message?: string,
      title?: string,
    }
  | {
      url?: string,
      message: string,
      title?: string,
    };

type ShareProps = {
  content: ShareContent,
  children: Node,
};

type Props = LinkProps | ButtonProps | ShareProps;

export default class Anchor extends React.Component<Props> {
  handlePress = () => {
    if (typeof this.props.onPress === 'function') return this.props.onPress();
    if (typeof this.props.href === 'string')
      return WebBrowser.openBrowserAsync(this.props.href);
    if (this.props.content) return Share.share(this.props.content);
  };

  render() {
    return (
      <MessageAnchorText {...this.props} onPress={this.handlePress}>
        {this.props.children}
      </MessageAnchorText>
    );
  }
}
