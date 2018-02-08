import React from 'react';
import Avatar from '../../components/avatar';
import { ParticipantHeads, ParticipantCount, Author } from './style';

const messageAvatars = list => {
  const avatarList = list.slice(0, 5);

  return avatarList.map(participant => (
    <Avatar
      size={32}
      isOnline={participant.isOnline}
      link={participant.username ? `/users/${participant.username}` : null}
      src={participant.profilePhoto}
      role="presentation"
      key={participant.id}
      user={participant}
    />
  ));
};

const FacePile = props => {
  const { data: { author, participants } } = props;
  const participantList = participants.filter(
    participant => participant.id !== author.user.id
  );
  const participantCount = participants.length;

  return (
    <ParticipantHeads>
      <Author role="presentation">
        <Avatar
          size={32}
          user={author.user}
          isOnline={author.user.isOnline}
          link={author.user.username ? `/users/${author.user.username}` : null}
          src={author.user.profilePhoto}
          role="presentation"
          key={author.user.id}
        />
      </Author>
      {messageAvatars(participantList)}
      {participantCount > 6 && (
        <ParticipantCount>{`+${participantCount - 6}`}</ParticipantCount>
      )}
    </ParticipantHeads>
  );
};

export default FacePile;
