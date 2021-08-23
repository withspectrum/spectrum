// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import { openModal } from 'src/actions/modals';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { HoverWarnOutlineButton, OutlineButton } from 'src/components/button';
import { ActionsRowContainer } from '../style';
import { isAdmin } from 'src/helpers/is-admin';

type Props = {
  user: UserInfoType,
  currentUser: ?UserInfoType,
  dispatch: Dispatch<Object>,
};

export const UnconnectedUserActions = (props: Props) => {
  const { user, currentUser, dispatch } = props;

  if (!user) return null;

  const initBan = () => {
    return dispatch(openModal('BAN_USER_MODAL', { user }));
  };

  return (
    <ActionsRowContainer>
      {currentUser && currentUser.id === user.id && (
        <OutlineButton to={`/users/${user.username}/settings`}>
          Settings
        </OutlineButton>
      )}

      {currentUser && user.id !== currentUser.id && isAdmin(currentUser.id) && (
        <HoverWarnOutlineButton onClick={initBan}>Ban</HoverWarnOutlineButton>
      )}
    </ActionsRowContainer>
  );
};

export const UserActions = compose(
  withCurrentUser,
  connect()
)(UnconnectedUserActions);
