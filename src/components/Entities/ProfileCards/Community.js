// @flow
import React from 'react';
import { CommunityAvatar } from 'src/components/avatar';
import { CommunityActions } from './components/CommunityActions';
import { CommunityMeta } from './components/CommunityMeta';
import {
  SidebarSection,
  ProfileContainer,
  CoverPhoto,
  ProfileAvatarContainer,
} from './style';

export const CommunityProfileCard = (props: Props) => {
  const { community } = props;

  return (
    <SidebarSection>
      <ProfileContainer>
        <CoverPhoto src={community.coverPhoto} />

        <ProfileAvatarContainer>
          <CommunityAvatar
            isClickable={false}
            showHoverProfile={false}
            size={60}
            community={community}
          />
        </ProfileAvatarContainer>

        <CommunityMeta community={community} />

        <CommunityActions community={community} />
      </ProfileContainer>
    </SidebarSection>
  );
};
