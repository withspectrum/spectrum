// @flow
import React from 'react';
import { UserAvatar } from 'src/components/avatar';
import { UserActions } from './components/UserActions';
import { UserMeta } from './components/UserMeta';
import {
  SidebarSection,
  ProfileContainer,
  CoverPhoto,
  RoundProfileAvatarContainer,
} from './style';

export const UserProfileCard = (props: Props) => {
  const { user } = props;

  return (
    <SidebarSection>
      <ProfileContainer>
        <CoverPhoto src={user.coverPhoto} />

        <RoundProfileAvatarContainer>
          <UserAvatar
            isClickable={false}
            showHoverProfile={false}
            size={60}
            user={user}
            showOnlineStatus={false}
          />
        </RoundProfileAvatarContainer>

        <UserMeta user={user} />

        <UserActions user={user} />
      </ProfileContainer>
    </SidebarSection>
  );
};
