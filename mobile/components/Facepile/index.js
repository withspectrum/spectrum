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
  insertAtFirstPosition: UserInfoType,
  maxCount: number,
  navigation: Navigation,
};

const Facepile = ({
  users,
  insertAtFirstPosition,
  maxCount = 5,
  navigation,
}: FacepileProps) => {
  if (!users || users.length === 0) {
    if (insertAtFirstPosition) {
      return (
        <FacepileContainer>
          <Avatar
            onPress={() =>
              navigation.navigate(`User`, { id: insertAtFirstPosition.id })
            }
            src={insertAtFirstPosition.profilePhoto}
            size={30}
          />;
        </FacepileContainer>
      );
    }

    return null;
  }

  const participantCount = users.length;

  const hasOverflow = participantCount > maxCount;
  const overflowAmount =
    participantCount - maxCount > 9 ? '···' : `+${participantCount - maxCount}`;

  return (
    <FacepileContainer>
      {insertAtFirstPosition && (
        <StackedAvatar
          onPress={() =>
            navigation.navigate(`User`, { id: insertAtFirstPosition.id })
          }
          src={insertAtFirstPosition.profilePhoto}
          size={30}
        />
      )}

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
