import React, { Component } from 'react';
import Composer from '../../components/composer';
import ThreadContainer from '../thread';
import { Container, Thread } from './style';

class DashboardThread extends Component {
  render() {
    const { threadId } = this.props;

    // no thread has been selected
    if (!threadId) return null;

    // composer is selected
    if (threadId === 'new')
      return (
        <Container>
          <Thread>
            <Composer isInbox={true} {...this.props} />
          </Thread>
        </Container>
      );

    // otherwise return the thread that was selected
    return (
      <Container>
        <Thread>
          <ThreadContainer threadViewContext={'inbox'} threadId={threadId} />
        </Thread>
      </Container>
    );
  }
}

export default DashboardThread;
