// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  PrimaryButton,
  OutlineButton,
} from 'src/views/Community/components/Button';
import InitDirectMessageWrapper from 'src/components/initDirectMessageWrapper';
import { ActionsRowContainer } from '../style';

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
        render={<PrimaryButton>Message</PrimaryButton>}
      />
    </ActionsRowContainer>
  );
};

export const UserActions = compose(withCurrentUser)(UnconnectedUserActions);
