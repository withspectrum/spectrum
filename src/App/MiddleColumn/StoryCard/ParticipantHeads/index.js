import React, { Component } from 'react';
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
    const { participants, list, unread, me } = this.props;
    const participantsArr = Object.keys(participants);

    // sort the participants by last activity
    const sortedParticipants = participantsArr
      .map(key => participants[key])
      .sort((a, b) => {
        return a.last_activity < b.last_activity;
      });

    // create a new array of the sorted participant IDs to be matched against the List in the store
    const sortedArr = sortedParticipants.map(participant => participant.id);

    return (
      <Container>
        {sortedArr.map((participant, i) => {
          if (i <= 15 && list[participant]) {
            return (
              <HeadWrapper
                tipText={list[participant].displayName}
                tipLocation="top-right"
                key={`${participant}-head`}
              >
                <Head src={list[participant].photoURL} />
              </HeadWrapper>
            );
          }
          return null;
        })}

        {sortedArr.length > 16 && // if more than four participnats, tack on a placeholder
          <HeadWrapper
            tipText={
              sortedArr.length - 15 > 1
                ? `${sortedArr.length - 15} others`
                : `${sortedArr.length - 15} other`
            }
            tipLocation="top-right"
          >
            <Head src={`${process.env.PUBLIC_URL}/img/head_placeholder.png`} />
          </HeadWrapper>}
      </Container>
    );
  }
}

export default ParticipantHeads;
