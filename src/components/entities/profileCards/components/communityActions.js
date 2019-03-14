// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { CommunityActionsRowType } from '../types';
import getComposerLink from 'src/helpers/get-composer-link';
import {
  PrimaryButton,
  OutlineButton,
} from 'src/views/community/components/button';
import { openModal } from 'src/actions/modals';
import JoinCommunity from 'src/components/joinCommunityWrapper';
import { ActionsRowContainer } from '../style';

export const UnconnectedCommunityActions = (props: CommunityActionsRowType) => {
  const { community, dispatch } = props;

  const [isHovering, setHover] = React.useState(false);
  const onMouseEnter = () => setHover(true);
  const onMouseLeave = () => setHover(false);

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
  const { pathname, search } = getComposerLink({ communityId: community.id });

  if (isMember) {
    return (
      <ActionsRowContainer>
        {isTeamMember && (
          <OutlineButton to={`/${community.slug}/settings`}>
            Settings
          </OutlineButton>
        )}

        {!isOwner && (
          <OutlineButton
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={leaveCommunity}
          >
            {isHovering ? 'Leave community' : 'Member'}
          </OutlineButton>
        )}

        <PrimaryButton to={{ pathname, search, state: { modal: true } }}>
          New Post
        </PrimaryButton>
      </ActionsRowContainer>
    );
  }

  return (
    <ActionsRowContainer>
      <JoinCommunity
        community={community}
        render={({ isLoading }) => (
          <PrimaryButton isLoading={isLoading} icon={'door-enter'}>
            {isLoading ? 'Joining...' : 'Join community'}
          </PrimaryButton>
        )}
      />
    </ActionsRowContainer>
  );
};

export const CommunityActions = connect()(UnconnectedCommunityActions);
