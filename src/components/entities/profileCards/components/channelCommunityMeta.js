// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import { CommunityAvatar } from 'src/components/avatar';
import { ChannelCommunityMetaRow, ChannelCommunityName } from '../style';

type Props = {
  channel: ChannelInfoType,
};

export const ChannelCommunityMeta = (props: Props) => {
  const { channel } = props;
  const { community } = channel;

  return (
    <Link to={`/${community.slug}`}>
      <ChannelCommunityMetaRow>
        <CommunityAvatar isClickable={false} size={24} community={community} />
        <ChannelCommunityName>{community.name}</ChannelCommunityName>
      </ChannelCommunityMetaRow>
    </Link>
  );
};
