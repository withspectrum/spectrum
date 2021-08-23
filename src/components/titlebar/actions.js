// @flow
import React from 'react';
import compose from 'recompose/compose';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import { OutlineButton } from 'src/components/button';
import { withCurrentUser } from 'src/components/withCurrentUser';

type UserProps = {
  user: UserInfoType,
  currentUser: ?UserInfoType,
};

const User = (props: UserProps) => {
  const { user, currentUser } = props;

  if (currentUser && currentUser.id === user.id) {
    return (
      <OutlineButton
        size={'small'}
        to={`/users/${currentUser.username}/settings`}
      >
        Settings
      </OutlineButton>
    );
  }

  return null;
};

export const MobileUserAction = compose(withCurrentUser)(User);
