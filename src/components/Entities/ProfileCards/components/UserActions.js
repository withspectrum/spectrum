// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withCurrentUser } from 'src/components/withCurrentUser';
import type { UserActionsRowType } from '../types';
import {
  PrimaryButton,
  OutlineButton,
  HoverWarnOutlineButton,
} from 'src/views/Community/components/Button';
import { openModal } from 'src/actions/modals';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import JoinUser from './JoinCommunityWrapper';
import { ActionsRowContainer } from '../style';

export const UnconnectedUserActions = (props: UserActionsRowType) => {
  const { user, currentUser, dispatch } = props;

  const initMessage = () => {
    dispatch(initNewThreadWithUser(user));
  };

  return (
    <ActionsRowContainer>
      {currentUser && currentUser.id === user.id && (
        <OutlineButton to={`/users/${user.username}/settings`}>
          Settings
        </OutlineButton>
      )}

      <PrimaryButton to={'/messages/new'} onClick={initMessage}>
        Message
      </PrimaryButton>
    </ActionsRowContainer>
  );
};

export const UserActions = compose(
  withCurrentUser,
  connect()
)(UnconnectedUserActions);
