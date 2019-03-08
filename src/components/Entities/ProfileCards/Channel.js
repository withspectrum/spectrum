// @flow
import React from 'react';
import { ChannelActions } from './components/ChannelActions';
import { ChannelMeta } from './components/ChannelMeta';
import { ChannelCommunityMeta } from './components/ChannelCommunityMeta';
import { SidebarSection, ProfileContainer } from './style';

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
