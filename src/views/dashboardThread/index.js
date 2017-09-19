//@flow
import React, { Component } from 'react';
// $FlowFixMe
import queryString from 'query-string';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import compose from 'recompose/compose';
import { Container, Thread } from './style';
import Icon from '../../components/icons';
import ThreadContainer from '../thread/containers';

class DashboardThread extends Component {
  render() {
    const parsed = queryString.parse(this.props.location.search);
    const threadId = parsed.t;
    if (!threadId) return null;

    return (
      <Container>
        <Thread>
          <ThreadContainer threadId={threadId} slider />
        </Thread>
      </Container>
    );
  }
}

export default compose(withRouter)(DashboardThread);
