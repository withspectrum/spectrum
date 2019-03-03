// @flow
import React from 'react';
import type { CommunityProfileHeaderType } from '../types';
import { MobileCommunityActionsRow } from './MobileCommunityActionsRow';
import { MobileCommunityMeta } from './MobileCommunityMeta';
import { MobileProfileContainer } from '../style';

export const MobileCommunityProfileHeader = (
  props: CommunityProfileHeaderType
) => {
  const { community } = props;

  return (
    <MobileProfileContainer>
      <MobileCommunityMeta community={community} />
      <MobileCommunityActionsRow community={community} />
    </MobileProfileContainer>
  );
};
