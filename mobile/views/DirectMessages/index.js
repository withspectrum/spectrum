// @flow
import React, { Component } from 'react';
import DirectMessageThreadsList from './components/DirectMessageThreadsList';
import { Wrapper } from './style';
import type { NavigationProps } from 'react-navigation';

type Props = {
  navigation: NavigationProps,
};

class DirectMessages extends Component<Props> {
  render() {
    const { navigation } = this.props;

    return (
      <Wrapper>
        <DirectMessageThreadsList navigation={navigation} />
      </Wrapper>
    );
  }
}

export default DirectMessages;
