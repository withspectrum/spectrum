// @flow
import React from 'react';
import { ChannelActions } from './components/channelActions';
import { ChannelMeta } from './components/channelMeta';
import { ChannelCommunityMeta } from './components/channelCommunityMeta';
import { ProfileContainer, ActionsRowContainer } from './style';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';

type Props = {
  channel: ChannelInfoType,
  hideActions?: boolean,
  hideCommunityMeta?: boolean,
};

export const ChannelProfileCard = (props: Props) => {
  const { channel, hideActions, hideCommunityMeta } = props;

  return (
    <ProfileContainer>
      {!hideCommunityMeta && <ChannelCommunityMeta channel={channel} />}
      <ChannelMeta channel={channel} />
      {!hideActions ? (
        <ChannelActions channel={channel} />
      ) : (
        <div style={{ paddingBottom: '18px' }} />
      )}
    </ProfileContainer>
  );
};
