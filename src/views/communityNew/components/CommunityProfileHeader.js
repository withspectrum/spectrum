// @flow
import React from 'react';
import type { CommunityProfileHeaderType } from '../types';
import { CommunityAvatar } from 'src/components/avatar';
import { CommunityActionsRow } from './CommunityActionsRow';
import { CommunityMeta } from './CommunityMeta';
import {
  ProfileContainer,
  CoverPhoto,
  CoverPhotoFallback,
  ProfileAvatarContainer,
} from '../style';

export const CommunityProfileHeader = (props: CommunityProfileHeaderType) => {
  const { community } = props;

  return (
    <ProfileContainer>
      <CoverPhotoFallback src={community.coverPhoto} />

      <ProfileAvatarContainer>
        <CommunityAvatar
          isClickable={false}
          showHoverProfile={false}
          size={60}
          community={community}
        />
      </ProfileAvatarContainer>

      <CommunityMeta community={community} />

      <CommunityActionsRow community={community} />
    </ProfileContainer>
  );
};
