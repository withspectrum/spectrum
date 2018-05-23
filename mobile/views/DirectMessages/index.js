// @flow
import React, { Fragment } from 'react';
import DirectMessageThreadsList from './components/DirectMessageThreadsList';
import { Wrapper } from './style';

class DirectMessages extends React.Component<{}> {
  render() {
    return (
      <Wrapper>
        <DirectMessageThreadsList />
      </Wrapper>
    );
  }
}

export default DirectMessages;
