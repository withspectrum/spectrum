// @flow
import React, { Component } from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
import { ListCardItemDirectMessageGroup } from './messageGroupListItem';

class GroupsList extends Component {
  render() {
    const { groups, currentUser } = this.props;

    return (
      <div>
        {groups.map(group => {
          return (
            <ListCardItemDirectMessageGroup
              group={group}
              key={group.id}
              currentUser={currentUser}
            />
          );
        })}
      </div>
    );
  }
}

export default pure(GroupsList);
