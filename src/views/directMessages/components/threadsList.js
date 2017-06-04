// @flow
import React, { Component } from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
import { ListCardItemDirectMessageThread } from './messageThreadListItem';
import { ThreadsListScrollContainer } from './style';

class ThreadsList extends Component {
  render() {
    const { threads, currentUser, active } = this.props;

    return (
      <ThreadsListScrollContainer>
        {threads.map(thread => {
          return (
            <ListCardItemDirectMessageThread
              thread={thread}
              key={thread.id}
              currentUser={currentUser}
              active={active === thread.id}
            />
          );
        })}
      </ThreadsListScrollContainer>
    );
  }
}

export default pure(ThreadsList);
