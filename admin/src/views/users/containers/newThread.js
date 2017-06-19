// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { withApollo } from 'react-apollo';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
import Titlebar from '../../../components/titlebar';
import { MessagesContainer } from '../style';

class NewThread extends Component {
  render() {
    return (
      <MessagesContainer>
        <Titlebar
          title={'New Message'}
          provideBack={true}
          backRoute={`/messages`}
          noComposer
        />
      </MessagesContainer>
    );
  }
}

export default compose(withApollo, withRouter, connect())(NewThread);
