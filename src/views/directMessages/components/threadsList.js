// @flow
import React from 'react';
import ListCardItemDirectMessageThread from './messageThreadListItem';
import { ThreadsListScrollContainer } from './style';

type Input = {
  threads: Array<Object>,
  currentUser: Object,
  active: string,
};

const ThreadsList = ({ threads, currentUser, active }: Input) => {
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

export default ThreadsList;
