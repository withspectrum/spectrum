import React, { Component } from 'react';
import { getUserInfo } from '../../../../db/users';
import { Head, Container, Label } from './style';
import { UnreadCount } from '../style';

class ParticipantHeads extends Component {
  render() {
    const { participants, list, unread, me, saying } = this.props;
    const arr = Object.keys(participants);

    return (
      <Container>
        {arr.map((participant, i) => {
          while (i < 4 && list[participant]) {
            return (
              <Head
                tipText="Share story"
                tipLocation="left"
                key={`${participant}-head`}
                src={list[participant].photoURL}
              />
            );
          }
        })}
        <Label>
          {list[arr[0]].uid === me ? 'You' : list[arr[0]].displayName}
          {' '}and{' '}
          {arr.length - 1}
          {' '}others are{' '}
          {saying}
          {unread > 0 && <UnreadCount>{` (${unread} new!)`}</UnreadCount>}
        </Label>
      </Container>
    );
  }
}

export default ParticipantHeads;
