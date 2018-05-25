// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import type { Navigation } from '../../utils/types';
import type { UserInfoType } from '../../../shared/graphql/fragments/user/userInfo';
import {
  FacepileContainer,
  StackedEmptyParticipantHead,
  StackedAvatar,
} from './style';

const messageAvatars = (list, navigation, maxCount) => {
  const avatarList = list.slice(0, maxCount);

  return avatarList.map((participant, i) => {
    if (!participant) {
      return null;
    }
    return (
      <StackedAvatar
        key={participant.id}
        src={participant.profilePhoto}
        size={30}
        onPress={() => navigation.navigate(`User`, { id: participant.id })}
      />
    );
  });
};

type FacepileProps = {
  users: Array<?UserInfoType>,
  maxCount: number,
  navigation: Navigation,
};

const Facepile = ({ users, maxCount = 5, navigation }: FacepileProps) => {
  const participantCount = users.length;
  const hasOverflow = participantCount > maxCount;
  const overflowAmount =
    participantCount - maxCount > 9 ? '···' : `+${participantCount - maxCount}`;

  return (
    <FacepileContainer>
      {messageAvatars(users, navigation, maxCount)}

      {hasOverflow && (
        <StackedEmptyParticipantHead size={30} adjustsFontSizeToFit>
          {overflowAmount}
        </StackedEmptyParticipantHead>
      )}
    </FacepileContainer>
  );
};

export default compose(withNavigation)(Facepile);
