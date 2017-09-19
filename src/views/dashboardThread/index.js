//@flow
import React, { Component } from 'react';
import Icon from '../../components/icons';
import { Button } from '../../components/buttons';
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

    if (!threadId)
      return (
        <NullContainer>
          <NullThread>
            <Illo />
            <Heading>Jump into a conversation!</Heading>
            <Subheading>
              Select a thread from your feed on the left. Or if you want to
              start a conversation of your own, your community is ready for you!
            </Subheading>
            <Link
              to={{
                pathname: window.location.pathname,
                search: `?t=new`,
              }}
            >
              <Button>Start a conversation</Button>
            </Link>
          </NullThread>
        </NullContainer>
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
