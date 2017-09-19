// @flow
import React from 'react';
import { Avatar } from '../../../components/avatar';
import {
  FacepileContainer,
  ParticipantHead,
  EmptyParticipantHead,
} from '../style';
const NUM_TO_DISPLAY = 8;

const messageAvatars = (list, active) => {
  const avatarList = list.slice(0, NUM_TO_DISPLAY);

  return avatarList.map((participant, i) => (
    <ParticipantHead offset={i + 1} active={active}>
      <Avatar
        size={24}
        isOnline={false}
        link={participant.username ? `/users/${participant.username}` : null}
        src={`${participant.profilePhoto}`}
        role="presentation"
        key={participant.id}
      />
    </ParticipantHead>
  ));
};

const Facepile = ({ participants, creator, active }) => {
  const participantList = participants.filter(
    participant => participant.id !== creator.id
  );
  const participantCount = participants.length;

  return (
    <FacepileContainer>
      <ParticipantHead active={active} offset={0} role="presentation">
        <Avatar
          size={24}
          isOnline={creator.isOnline}
          link={creator.username ? `/users/${creator.username}` : null}
          src={creator.profilePhoto}
          role="presentation"
          key={creator.id}
        />
      </ParticipantHead>
      {messageAvatars(participantList, active)}
      {participantCount > NUM_TO_DISPLAY && (
        <EmptyParticipantHead
          offset={NUM_TO_DISPLAY + 1}
        >{`+${participantCount - NUM_TO_DISPLAY}`}</EmptyParticipantHead>
      )}
    </FacepileContainer>
  );
};

export default Facepile;
