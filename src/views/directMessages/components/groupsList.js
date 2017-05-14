// @flow
import React, { Component } from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
import { Card } from '../../../components/card';
import { ListCardItemDirectMessageGroup } from './messageGroupListItem';

class GroupsList extends Component {
  render() {
    const { groups, active } = this.props;

    return (
      <div>
        {groups.map(group => {
          return (
            <ListCardItemDirectMessageGroup group={group} key={group.id} />
          );
        })}
      </div>
    );
  }
}

export default pure(GroupsList);
