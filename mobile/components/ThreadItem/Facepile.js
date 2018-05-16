// @flow
import * as React from 'react';
import Avatar from '../Avatar';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import { TouchableHighlight } from 'react-native';
import type { Navigation } from '../../utils/types';
import type { UserInfoType } from '../../../shared/graphql/fragments/user/userInfo';
import { FacepileContainer, EmptyParticipantHead } from './style';
const NUM_TO_DISPLAY = 5;

const messageAvatars = (list, navigation) => {
  const avatarList = list.slice(0, NUM_TO_DISPLAY);

  return avatarList.map((participant, i) => {
    if (!participant) {
      return null;
    }
    return (
      <TouchableHighlight
        onPress={() => navigation.navigate(`User`, { id: participant.id })}
        key={participant.id}
      >
        <Avatar src={participant.profilePhoto} size={30} radius={15} />
      </TouchableHighlight>
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
        <Avatar src={creator.profilePhoto} size={30} radius={15} />;
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
      <TouchableHighlight
        onPress={() => navigation.navigate(`User`, { id: creator.id })}
      >
        <Avatar src={creator.profilePhoto} size={30} radius={15} />
      </TouchableHighlight>
      {messageAvatars(participantList, navigation)}
      {hasOverflow && (
        <EmptyParticipantHead adjustsFontSizeToFit>
          {overflowAmount}
        </EmptyParticipantHead>
      )}
    </FacepileContainer>
  );
};

export default compose(withNavigation)(Facepile);
