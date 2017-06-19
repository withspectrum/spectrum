// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { withApollo } from 'react-apollo';

class ExistingThread extends Component {
  render() {
    return <div />;
  }
}

export default compose()(ExistingThread);
