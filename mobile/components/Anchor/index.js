// @flow
import * as React from 'react';
import styled from 'styled-components';
import { Share, Text } from 'react-native';
import { WebBrowser } from 'expo';

type LinkProps = {
  href: string,
  children: React.Node,
};

type ButtonProps = {
  onPress: () => void,
  children: React.Node,
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
  children: React.Node,
};

type Props = LinkProps | ButtonProps | ShareProps;

class Anchor extends React.Component<Props> {
  handlePress = () => {
    if (typeof this.props.onPress === 'function') return this.props.onPress();
    if (typeof this.props.href === 'string')
      return WebBrowser.openBrowserAsync(this.props.href);
    if (this.props.content) return Share.share(this.props.content);
  };

  render() {
    return (
      <Text {...this.props} onPress={this.handlePress}>
        {this.props.children}
      </Text>
    );
  }
}

export const MessageAnchor = styled(Anchor)`
  color: ${props => props.theme.text.default};
  font-weight: 700;
`;

export const ThreadAnchor = styled(Anchor)`
  color: ${props => props.theme.brand.alt};
  font-weight: 500;
`;
