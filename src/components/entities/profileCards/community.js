// @flow
import React from 'react';
import { CommunityAvatar } from 'src/components/avatar';
import { CommunityActions } from './components/communityActions';
import { CommunityMeta } from './components/communityMeta';
import { ProfileContainer, CoverPhoto, ProfileAvatarContainer } from './style';

export const CommunityProfileCard = (props: Props) => {
  const { community } = props;

  return (
    <ProfileContainer>
      <CoverPhoto src={community.coverPhoto} />

      <ProfileAvatarContainer>
        <CommunityAvatar
          showHoverProfile={false}
          size={60}
          community={community}
        />
      </ProfileAvatarContainer>

      <CommunityMeta community={community} />

      <CommunityActions community={community} />
    </ProfileContainer>
  );
};
