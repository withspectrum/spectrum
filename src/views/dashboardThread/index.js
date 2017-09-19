//@flow
import React, { Component } from 'react';
import { Container, Thread } from './style';
import Icon from '../../components/icons';
import ThreadContainer from '../thread/containers';

class DashboardThread extends Component {
  render() {
    const { threadId } = this.props;

    if (!threadId)
      return (
        <Container>
          <Thread>No thread selected</Thread>
        </Container>
      );

    if (threadId === 'new')
      return (
        <Container>
          <Thread>New post!</Thread>
        </Container>
      );

    return (
      <Container>
        <Thread>
          <ThreadContainer threadId={threadId} slider />
        </Thread>
      </Container>
    );
  }
}

export default DashboardThread;
