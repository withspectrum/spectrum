// @flow
import React, { Component } from 'react';
import DirectMessageThreadsList from './components/DirectMessageThreadsList';
import { Wrapper } from './style';

class DirectMessages extends Component<{}> {
  render() {
    return (
      <Wrapper>
        <DirectMessageThreadsList />
      </Wrapper>
    );
  }
}

export default DirectMessages;
