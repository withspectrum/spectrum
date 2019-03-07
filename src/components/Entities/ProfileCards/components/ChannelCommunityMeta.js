// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { CommunityAvatar } from 'src/components/avatar';
import { ChannelCommunityMetaRow, ChannelCommunityName } from '../style';

export const ChannelCommunityMeta = (props: Props) => {
  const { channel } = props;
  const { community } = channel;

  return (
    <Link to={`/${community.slug}`}>
      <ChannelCommunityMetaRow>
        <CommunityAvatar size={24} community={community} />
        <ChannelCommunityName>{community.name}</ChannelCommunityName>
      </ChannelCommunityMetaRow>
    </Link>
  );
};
