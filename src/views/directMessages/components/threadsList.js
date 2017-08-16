// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
import ListCardItemDirectMessageThread from './messageThreadListItem';
import { ThreadsListScrollContainer } from './style';

const ThreadsList = ({ threads, currentUser, active }) => {
  if (!threads || threads.length === 0) {
    return null;
  }

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
};

export default pure(ThreadsList);
