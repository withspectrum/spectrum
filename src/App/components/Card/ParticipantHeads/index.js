import React, { Component } from 'react';
import { getUserInfo } from '../../../../db/users';
import { Head, HeadWrapper, Container, Label } from './style';
import { UnreadCount } from '../style';

class ParticipantHeads extends Component {
  render() {
    if (this.props.loading) {
      return (
        <Container>
          <HeadWrapper>
            <Head src={`${process.env.PUBLIC_URL}/img/head_placeholder.png`} />
          </HeadWrapper>
        </Container>
      );
    }
    const { participants, list, unread, me, saying } = this.props;
    const arr = Object.keys(participants);

    // sort the participants by last activity
    const sortedParticipants = Object.values(participants).sort((a, b) => {
      return a.last_activity < b.last_activity;
    });

    // create a new array of the sorted participant IDs to be matched against the List in the store
    const sortedArr = sortedParticipants.map(participant => participant.id);

    return (
      <Container>
        {sortedArr.map((participant, i) => {
          while (i <= 4 && list[participant]) {
            return (
              <HeadWrapper
                style={{ position: 'relative', left: `-${i * 4}px` }}
                tipText={list[participant].displayName}
                tipLocation="top-right"
                key={`${participant}-head`}
              >
                <Head src={list[participant].photoURL} />
              </HeadWrapper>
            );
          }
        })}

        {sortedArr.length > 5 && // if more than four participnats, tack on a placeholder
          <HeadWrapper
            style={{ position: 'relative', left: '-16px' }}
            tipText={
              sortedArr.length - 5 > 1
                ? `${sortedArr.length - 5} others`
                : `${sortedArr.length - 5} other`
            }
            tipLocation="top-right"
          >
            <Head src={`${process.env.PUBLIC_URL}/img/head_placeholder.png`} />
          </HeadWrapper>}

        <Label length={sortedArr.length}>
          {list[sortedArr[0]].uid === me
            ? 'You'
            : list[sortedArr[0]].displayName}
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
