// @flow
import React from 'react';
import type { CommunityActionsRowType } from '../types';
import Icon from 'src/components/icons';
import { WhiteIconButton, SmallPrimaryButton } from './Button';
import getComposerLink from 'src/helpers/get-composer-link';
import JoinCommunity from './JoinCommunity';
import { MobileActionsRowContainer } from '../style';

export const MobileCommunityActionsRow = (props: CommunityActionsRowType) => {
  const { community } = props;
  const { isMember } = community.communityPermissions;
  const { pathname, search } = getComposerLink({ communityId: community.id });

  if (isMember) {
    return (
      <MobileActionsRowContainer>
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
