// @flow
import React from 'react';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import { ChannelActions } from './components/channelActions';
import { ChannelMeta } from './components/channelMeta';
import { ChannelCommunityMeta } from './components/channelCommunityMeta';
import { ProfileContainer } from './style';

type Props = {
  channel: ChannelInfoType,
  hideActions?: boolean,
  hideCommunityMeta?: boolean,
};

export const ChannelProfileCard = (props: Props) => {
  const { channel, hideActions, hideCommunityMeta } = props;

  return (
    <ProfileContainer data-cy="channel-profile-card">
      {!hideCommunityMeta && <ChannelCommunityMeta channel={channel} />}
      <ChannelMeta channel={channel} />
      {!hideActions ? (
        <ChannelActions channel={channel} />
      ) : (
        <div style={{ paddingBottom: '12px' }} />
      )}
    </ProfileContainer>
  );
};
