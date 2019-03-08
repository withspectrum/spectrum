// @flow
import React from 'react';
import { ChannelActions } from './components/channelActions';
import { ChannelMeta } from './components/channelMeta';
import { ChannelCommunityMeta } from './components/channelCommunityMeta';
import { ProfileContainer } from './style';

export const ChannelProfileCard = (props: Props) => {
  const { channel } = props;

  return (
    <ProfileContainer>
      <ChannelCommunityMeta channel={channel} />
      <ChannelMeta channel={channel} />
      <ChannelActions channel={channel} />
    </ProfileContainer>
  );
};
