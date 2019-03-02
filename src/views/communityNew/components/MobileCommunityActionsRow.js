// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { CommunityActionsRowType } from '../types';
import Icon from 'src/components/icons';
import { WhiteIconButton, SmallPrimaryButton } from './Button';
import { openModal } from 'src/actions/modals';
import getComposerLink from 'src/helpers/get-composer-link';
import JoinCommunity from './JoinCommunity';
import { MobileActionsRowContainer } from '../style';

export const Component = (props: CommunityActionsRowType) => {
  const { community, dispatch } = props;
  const open = () => dispatch(openComposer());
  const leaveCommunity = () =>
    dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: community.id,
        entity: 'team-member-leaving-community',
        message: 'Are you sure you want to leave this community?',
        buttonLabel: 'Leave Community',
      })
    );

  const { isMember } = community.communityPermissions;
  const { pathname, search } = getComposerLink({ communityId: community.id });

  if (isMember) {
    return (
      <MobileActionsRowContainer>
        <WhiteIconButton>
          <Icon onClick={leaveCommunity} glyph={'settings'} size={32} />
        </WhiteIconButton>

        <span style={{ width: '8px' }} />

        <WhiteIconButton
          to={{
            pathname,
            search,
          }}
        >
          <Icon glyph={'post'} size={32} />
        </WhiteIconButton>
      </MobileActionsRowContainer>
    );
  }

  return (
    <MobileActionsRowContainer>
      <JoinCommunity
        communityId={community.id}
        render={({ isLoading }) => (
          <SmallPrimaryButton isLoading={isLoading} icon={'door-enter'}>
            {isLoading ? 'Joining...' : 'Join'}
          </SmallPrimaryButton>
        )}
      />
    </MobileActionsRowContainer>
  );
};

export const MobileCommunityActionsRow = connect()(Component);
