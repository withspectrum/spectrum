// @flow
import * as React from 'react';
import Avatar from '../Avatar';
import {
  FacepileContainer,
  ParticipantHead,
  EmptyParticipantHead,
} from './style';
const NUM_TO_DISPLAY = 5;

const messageAvatars = list => {
  const avatarList = list.slice(0, NUM_TO_DISPLAY);

  return avatarList.map((participant, i) => (
    <ParticipantHead
      offset={i + 1}
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

type UserType = {
  profilePhoto: string,
  username: string,
  name: string,
  id: string,
};
type FacepileProps = {
  participants: Array<?UserType>,
  creator: UserType,
};

const Facepile = ({ participants, creator }: FacepileProps) => {
  if (!participants || participants.length === 0) {
    return (
      <FacepileContainer>
        <ParticipantHead
          offset={0}
          role="presentation"
          key={creator.id}
          tipText={`Posted by ${creator.name}`}
          tipLocation={'top-right'}
        >
          <Avatar
            user={creator}
            size={24}
            isOnline={false}
            link={creator.username ? `/users/${creator.username}` : null}
            src={creator.profilePhoto}
            role="presentation"
          />
        </ParticipantHead>
      </FacepileContainer>
    );
  }

  const participantList = participants.filter(
    participant => participant.id !== creator.id
  );
  const participantCount = participants.length;

  const hasOverflow = participantCount > NUM_TO_DISPLAY;
  const overflowAmount =
    participantCount - NUM_TO_DISPLAY > 9
      ? '···'
      : `+${participantCount - NUM_TO_DISPLAY}`;

  return (
    <FacepileContainer>
      <ParticipantHead
        offset={0}
        role="presentation"
        key={creator.id}
        tipText={`Posted by ${creator.name}`}
        tipLocation={'top-right'}
      >
        <Avatar
          user={creator}
          size={24}
          isOnline={false}
          link={creator.username ? `/users/${creator.username}` : null}
          src={creator.profilePhoto}
          role="presentation"
        />
      </ParticipantHead>
      {messageAvatars(participantList)}
      {hasOverflow && (
        <EmptyParticipantHead offset={NUM_TO_DISPLAY + 1}>
          {overflowAmount}
        </EmptyParticipantHead>
      )}
    </FacepileContainer>
  );
};

export default Facepile;
