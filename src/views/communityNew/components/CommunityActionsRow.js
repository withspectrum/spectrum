// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { CommunityActionsRowType } from '../types';
import { PrimaryButton, OutlineButton } from './Button';
import { openModal } from 'src/actions/modals';
import Icon from 'src/components/icons';
import JoinCommunity from './JoinCommunity';
import { ActionsRowContainer } from '../style';

export const Component = (props: CommunityActionsRowType) => {
  const { community, dispatch } = props;

  const leaveCommunity = () =>
    dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: community.id,
        entity: 'team-member-leaving-community',
        message: 'Are you sure you want to leave this community?',
        buttonLabel: 'Leave Community',
      })
    );

  const { isMember, isOwner, isModerator } = community.communityPermissions;
  const isTeamMember = isOwner || isModerator;

  if (isMember) {
    return (
      <ActionsRowContainer>
        {isTeamMember && (
          <OutlineButton to={`/${community.slug}/settings`}>
            <Icon glyph={'settings'} size={24} />
            Settings
          </OutlineButton>
        )}

        {!isOwner && (
          <OutlineButton onClick={leaveCommunity}>
            <Icon glyph={'door-leave'} size={24} />
            Leave community
          </OutlineButton>
        )}
      </ActionsRowContainer>
    );
  }

  return (
    <ActionsRowContainer>
      <JoinCommunity
        communityId={community.id}
        render={({ isLoading }) => (
          <PrimaryButton isLoading={isLoading} icon={'door-enter'}>
            {isLoading ? 'Joining...' : 'Join community'}
          </PrimaryButton>
        )}
      />
    </ActionsRowContainer>
  );
};

export const CommunityActionsRow = connect()(Component);
