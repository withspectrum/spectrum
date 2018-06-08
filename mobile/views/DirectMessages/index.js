// @flow
import React, { Component } from 'react';
import DirectMessageThreadsList from './components/DirectMessageThreadsList';
import { Wrapper } from './style';
import ErrorBoundary from '../../components/ErrorBoundary';
import type { NavigationProps } from 'react-navigation';

type Props = {
  navigation: NavigationProps,
};

class DirectMessages extends Component<Props> {
  render() {
    const { navigation } = this.props;

    return (
      <Wrapper>
        <ErrorBoundary alert>
          <DirectMessageThreadsList navigation={navigation} />
        </ErrorBoundary>
      </Wrapper>
    );
  }
}

export default DirectMessages;
