// @flow
import React, { Component } from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
import { ListCardItemDirectMessageThread } from './messageThreadListItem';

class ThreadsList extends Component {
  render() {
    const { groups, currentUser, active } = this.props;

    return (
      <div>
        {groups.map(group => {
          return (
            <ListCardItemDirectMessageThread
              group={group}
              key={group.id}
              currentUser={currentUser}
              active={active === group.id}
            />
          );
        })}
      </div>
    );
  }
}

export default pure(ThreadsList);
