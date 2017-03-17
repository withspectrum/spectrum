import React, { Component } from 'react';
import { getUserInfo } from '../../../../db/users';
import { Head, HeadWrapper, Container, Label } from './style';
import { UnreadCount } from '../style';

class ParticipantHeads extends Component {
  render() {
    const { participants, list, unread, me, saying } = this.props;
    const arr = Object.keys(participants);

    return (
      <Container>
        {arr.map((participant, i) => {
          while (i <= 4 && list[participant]) {
            return (
              <HeadWrapper
                style={{ position: 'relative', left: `-${i * 4}px` }}
                tipText={list[participant].displayName}
                tipLocation="top"
              >
                <Head
                  key={`${participant}-head`}
                  src={list[participant].photoURL}
                />
              </HeadWrapper>
            );
          }
        })}

        {arr.length > 4 && // if more than four participnats, tack on a placeholder
          <HeadWrapper style={{ position: 'relative', left: '-16px' }}>
            <Head src={`${process.env.PUBLIC_URL}/img/head_placeholder.png`} />
          </HeadWrapper>}

        <Label length={arr.length}>
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
