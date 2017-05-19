// @flow
import React, { Component } from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
import { ListCardItemDirectMessageThread } from './messageThreadListItem';

class ThreadsList extends Component {
  render() {
    const { threads, currentUser, active } = this.props;
    console.log('threads', threads);
    return (
      <div>
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
      </div>
    );
  }
}

export default pure(ThreadsList);
