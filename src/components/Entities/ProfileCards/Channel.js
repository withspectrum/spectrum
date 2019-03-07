// @flow
import React from 'react';
import { ChannelAvatar } from 'src/components/avatar';
import { ChannelActions } from './components/ChannelActions';
import { MobileChannelActions } from './components/MobileChannelActions';
import { ChannelMeta } from './components/ChannelMeta';
import { MobileChannelMeta } from './components/MobileChannelMeta';
import { ChannelCommunityMeta } from './components/ChannelCommunityMeta';
import {
  SidebarSection,
  ProfileContainer,
  MobileProfileContainer,
  CoverPhoto,
  ProfileAvatarContainer,
} from './style';

export const ChannelProfileCard = (props: Props) => {
  const { channel } = props;

  return (
    <SidebarSection>
      <ProfileContainer>
        <ChannelCommunityMeta channel={channel} />
        <ChannelMeta channel={channel} />
        <ChannelActions channel={channel} />
      </ProfileContainer>
    </SidebarSection>
  );
};

export const MobileChannelProfileCard = (props: Props) => {
  const { channel } = props;

  return (
    <MobileProfileContainer>
      <MobileChannelMeta channel={channel} />
      <MobileChannelActions channel={channel} />
    </MobileProfileContainer>
  );
};
