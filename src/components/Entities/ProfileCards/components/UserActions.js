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
import JoinUser from './JoinCommunityWrapper';
import { ActionsRowContainer } from '../style';

export const UnconnectedUserActions = (props: UserActionsRowType) => {
  const { user, currentUser } = props;

  return (
    <ActionsRowContainer>
      {currentUser && currentUser.id === user.id && (
        <OutlineButton to={`/${user.username}/settings`}>
          Settings
        </OutlineButton>
      )}

      <PrimaryButton>Message</PrimaryButton>
    </ActionsRowContainer>
  );
};

export const UserActions = compose(
  withCurrentUser,
  connect()
)(UnconnectedUserActions);
