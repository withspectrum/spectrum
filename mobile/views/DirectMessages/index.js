// @flow
import React, { Component } from 'react';
import DirectMessageThreadsList from './components/DirectMessageThreadsList';
import { Wrapper } from './style';
import ErrorBoundary from '../../components/ErrorBoundary';
import { track, events } from '../../utils/analytics';
import type { NavigationProps } from 'react-navigation';

type Props = {
  navigation: NavigationProps,
};

class DirectMessages extends Component<Props> {
  trackView = () => {
    track(events.DIRECT_MESSAGES_VIEWED);
  };

  componentDidMount() {
    this.trackView();
  }

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
