import React from 'react';
import Avatar from '../../../components/avatar';
import {
  FacepileContainer,
  ParticipantHead,
  EmptyParticipantHead,
} from '../style';
const NUM_TO_DISPLAY = 5;

const messageAvatars = (list, active) => {
  const avatarList = list.slice(0, NUM_TO_DISPLAY);

  return avatarList.map((participant, i) => (
    <ParticipantHead
      offset={i + 1}
      active={active}
      key={participant.id}
      tipText={participant.name}
      tipLocation={'top-right'}
    >
      <Avatar
        user={participant}
        size={24}
        isOnline={false}
        link={participant.username ? `/users/${participant.username}` : null}
        src={`${participant.profilePhoto}`}
        role="presentation"
      />
    </ParticipantHead>
  ));
};

const Facepile = ({ participants, author, active }) => {
  if (!participants || participants.length === 0) {
    return (
      <FacepileContainer>
        <ParticipantHead
          active={active}
          offset={0}
          role="presentation"
          key={author.id}
          tipText={`Posted by ${author.name}`}
          tipLocation={'top-right'}
        >
          <Avatar
            user={author}
            size={24}
            isOnline={false}
            link={author.username ? `/users/${author.username}` : null}
            src={author.profilePhoto}
            role="presentation"
          />
        </ParticipantHead>
      </FacepileContainer>
    );
  }

  const participantList = participants
    .filter(participant => participant.id !== author.id)
    .sort((a, b) => (a.username <= b.username ? -1 : 1));
  const participantCount = participants.length;

  const hasOverflow = participantCount > NUM_TO_DISPLAY;
  const overflowAmount =
    participantCount - NUM_TO_DISPLAY > 9
      ? '···'
      : `+${participantCount - NUM_TO_DISPLAY}`;

  return (
    <FacepileContainer>
      <ParticipantHead
        active={active}
        offset={0}
        role="presentation"
        key={author.id}
        tipText={`Posted by ${author.name}`}
        tipLocation={'top-right'}
      >
        <Avatar
          user={author}
          size={24}
          isOnline={false}
          link={author.username ? `/users/${author.username}` : null}
          src={author.profilePhoto}
          role="presentation"
        />
      </ParticipantHead>
      {messageAvatars(participantList, active)}
      {hasOverflow && (
        <EmptyParticipantHead active={active} offset={NUM_TO_DISPLAY + 1}>
          {overflowAmount}
        </EmptyParticipantHead>
      )}
    </FacepileContainer>
  );
};

export default Facepile;
