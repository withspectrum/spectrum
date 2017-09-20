// @flow
import React from 'react';
// $FlowFixMe
import styled from 'styled-components';
// $FlowFixMe
import { Link } from 'react-router-dom';
import {
  CommunityInfoContainer,
  AvatarLink,
  CommunityAvatar,
  CommunityLink,
  PillLink,
  MetaCommunityName,
} from '../style';

export default ({ thread, active, activeCommunity }) => {
  const { channel } = thread;
  const isGeneral = channel.slug === 'general';
  if (activeCommunity && isGeneral) return null;

  return (
    <CommunityInfoContainer active={active}>
      {!activeCommunity && (
        <AvatarLink to={`/${channel.community.slug}`}>
          <CommunityAvatar
            src={`${channel.community.profilePhoto}?w=20&dpr=2`}
          />
        </AvatarLink>
      )}

      {!activeCommunity && (
        <MetaCommunityName to={`/${channel.community.slug}`}>
          {channel.community.name}
        </MetaCommunityName>
      )}

      {!isGeneral && (
        <PillLink
          className="pill"
          to={`/${channel.community.slug}/${channel.slug}`}
        >
          {channel.name}
        </PillLink>
      )}
    </CommunityInfoContainer>
  );
};
