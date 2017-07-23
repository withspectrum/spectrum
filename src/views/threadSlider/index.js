//@flow
import React, { Component } from 'react';
// $FlowFixMe
import queryString from 'query-string';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { Container, Overlay, Thread } from './style';
import ThreadContainer from '../thread/containers';

class ThreadSlider extends Component {
  close = () => {};
  render() {
    const parsed = queryString.parse(this.props.location.search);
    const threadId = parsed.thread;

    if (!threadId) return null;
    return (
      <Container>
        <Link to={this.props.location.pathname}>
          <Overlay />
        </Link>
        <Thread>
          <ThreadContainer threadId={threadId} />
        </Thread>
      </Container>
    );
  }
}

export default ThreadSlider;
