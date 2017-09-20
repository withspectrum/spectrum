//@flow
import React, { Component } from 'react';
import Icon from '../../components/icons';
import { Button } from '../../components/buttons';
import ThreadComposer from '../../components/threadComposer';
import { Link } from 'react-router-dom';
import ThreadContainer from '../thread/containers';
import {
  NullContainer,
  Container,
  NullThread,
  Thread,
  Illo,
  Heading,
  Subheading,
} from './style';

class DashboardThread extends Component {
  render() {
    const { threadId } = this.props;

    // no thread has been selected
    if (!threadId) return null;

    // composer is selected
    if (threadId === 'new')
      return (
        <NullContainer>
          <NullThread>
            <Heading>New thread composer will go here</Heading>
          </NullThread>
        </NullContainer>
      );

    // otherwise return the thread that was selected
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
