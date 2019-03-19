// @flow
import React from 'react';
import compose from 'recompose/compose';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { PrimaryOutlineButton, OutlineButton } from 'src/components/button';
import InitDirectMessageWrapper from 'src/components/initDirectMessageWrapper';
import { ActionsRowContainer } from '../style';

type Props = {
  user: UserInfoType,
  currentUser: ?UserInfoType,
};

export const UnconnectedUserActions = (props: Props) => {
  const { user, currentUser } = props;

  if (!user) return null;

  return (
    <ActionsRowContainer>
      {currentUser && currentUser.id === user.id && (
        <OutlineButton to={`/users/${user.username}/settings`}>
          Settings
        </OutlineButton>
      )}

      <InitDirectMessageWrapper
        user={user}
        render={<PrimaryOutlineButton>Message</PrimaryOutlineButton>}
      />
    </ActionsRowContainer>
  );
};

export const UserActions = compose(withCurrentUser)(UnconnectedUserActions);
