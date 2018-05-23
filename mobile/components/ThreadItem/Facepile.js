// @flow
import * as React from 'react';
import Avatar from '../Avatar';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import type { Navigation } from '../../utils/types';
import type { UserInfoType } from '../../../shared/graphql/fragments/user/userInfo';
import {
  FacepileContainer,
  StackedEmptyParticipantHead,
  StackedAvatar,
} from './style';
const NUM_TO_DISPLAY = 5;

const messageAvatars = (list, navigation) => {
  const avatarList = list.slice(0, NUM_TO_DISPLAY);

  return avatarList.map((participant, i) => {
    if (!participant) {
      return null;
    }
    return (
      <StackedAvatar
        key={participant.id}
        src={participant.profilePhoto}
        size={30}
        radius={15}
        onPress={() => navigation.navigate(`User`, { id: participant.id })}
        key={participant.id}
      />
    );
  });
};

type FacepileProps = {
  participants: Array<?UserInfoType>,
  creator: UserInfoType,
  navigation: Navigation,
};

const Facepile = ({ participants, creator, navigation }: FacepileProps) => {
  if (!participants || participants.length === 0) {
    return (
      <FacepileContainer>
        <Avatar
          onPress={() => navigation.navigate(`User`, { id: creator.id })}
          src={creator.profilePhoto}
          size={30}
          radius={15}
        />;
      </FacepileContainer>
    );
  }

  const participantList = participants.filter(
    participant => participant && participant.id !== creator.id
  );
  const participantCount = participants.length;

  const hasOverflow = participantCount > NUM_TO_DISPLAY;
  const overflowAmount =
    participantCount - NUM_TO_DISPLAY > 9
      ? '···'
      : `+${participantCount - NUM_TO_DISPLAY}`;

  return (
    <FacepileContainer>
      <StackedAvatar onPress={() => navigation.navigate(`User`, { id: creator.id })} src={creator.profilePhoto} size={30} radius={15} />
      {messageAvatars(participantList, navigation)}
      {hasOverflow && (
        <StackedEmptyParticipantHead size={30} adjustsFontSizeToFit>
          {overflowAmount}
        </StackedEmptyParticipantHead>
      )}
    </FacepileContainer>
  );
};

export default compose(withNavigation)(Facepile);
