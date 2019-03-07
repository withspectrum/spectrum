// @flow
import React from 'react';
import { UserAvatar } from 'src/components/avatar';
import { UserActions } from './components/UserActions';
import { MobileUserActions } from './components/MobileUserActions';
import { UserMeta } from './components/UserMeta';
import { MobileUserMeta } from './components/MobileUserMeta';
import {
  SidebarSection,
  ProfileContainer,
  MobileProfileContainer,
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
          />
        </RoundProfileAvatarContainer>

        <UserMeta user={user} />

        <UserActions user={user} />
      </ProfileContainer>
    </SidebarSection>
  );
};

export const MobileUserProfileCard = (props: Props) => {
  const { user } = props;

  return (
    <MobileProfileContainer>
      <MobileUserMeta user={user} />
      <MobileUserActions user={user} />
    </MobileProfileContainer>
  );
};
