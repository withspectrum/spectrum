import React from 'react';
import { Avatar } from '../../components/avatar';
import { ParticipantHeads, ParticipantCount, Creator } from './style';

const messageAvatars = list => {
  const avatarList = list.slice(0, 5);

  return avatarList.map(participant =>
    <Avatar
      size={32}
      isOnline={participant.isOnline}
      link={participant.username ? `/users/${participant.username}` : null}
      src={participant.profilePhoto}
      role="presentation"
      key={participant.id}
    />
  );
};

const FacePile = props => {
  const { data: { creator, participants } } = props;
  const participantList = participants.filter(
    participant => participant.id !== creator.id
  );
  const participantCount = participants.length;

  return (
    <ParticipantHeads>
      <Creator role="presentation">
        <Avatar
          size={32}
          isOnline={creator.isOnline}
          link={creator.username ? `/users/${creator.username}` : null}
          src={creator.profilePhoto}
          role="presentation"
          key={creator.id}
        />
      </Creator>
      {messageAvatars(participantList)}
      {participantCount > 6 &&
        <ParticipantCount>{`+${participantCount - 6}`}</ParticipantCount>}
    </ParticipantHeads>
  );
};

export default FacePile;
