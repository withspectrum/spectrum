// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import { PrimaryButton, OutlineButton } from 'src/components/button';
import { openModal } from 'src/actions/modals';
import JoinCommunity from 'src/components/joinCommunityWrapper';
import { ActionsRowContainer } from '../style';

type Props = {
  community: CommunityInfoType,
  dispatch: Dispatch<Object>,
};

export const UnconnectedCommunityActions = (props: Props) => {
  const { community, dispatch } = props;

  const [isHovering, setHover] = useState(false);
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
            data-cy="leave-community-button"
          >
            {isHovering ? 'Leave community' : 'Member'}
          </OutlineButton>
        )}
      </ActionsRowContainer>
    );
  }

  if (community.redirect) {
    return <div style={{ padding: '8px' }} />;
  }

  return (
    <ActionsRowContainer>
      <JoinCommunity
        community={community}
        render={({ isLoading }) => (
          <PrimaryButton
            data-cy="profile-join-button"
            isLoading={isLoading}
            icon={'door-enter'}
          >
            {isLoading ? 'Joining...' : 'Join community'}
          </PrimaryButton>
        )}
      />
    </ActionsRowContainer>
  );
};

export const CommunityActions = connect()(UnconnectedCommunityActions);
