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
} from '../style';

export default ({ thread, active }) => {
  const { channel } = thread;
  const isGeneral = channel.slug === 'general';
  return (
    <CommunityInfoContainer>
      <AvatarLink to={`/${channel.community.slug}`}>
        <CommunityAvatar src={`${channel.community.profilePhoto}?w=20`} />
      </AvatarLink>
      <PillLink active={active} to={`/${channel.community.slug}`}>
        {channel.community.name}
      </PillLink>

      {!isGeneral && (
        <PillLink
          active={active}
          to={`/${channel.community.slug}/${channel.slug}`}
        >
          {channel.name}
        </PillLink>
      )}
    </CommunityInfoContainer>
  );
};
