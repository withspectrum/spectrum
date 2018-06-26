import React from 'react';
import {
  CommunityInfoContainer,
  AvatarLink,
  CommunityAvatar,
  PillLink,
  PillLinkPinned,
  PillLabel,
  MetaCommunityName,
} from '../style';

export default ({
  thread,
  active,
  activeCommunity,
  activeChannel,
  isPinned,
}) => {
  const { channel, community } = thread;
  const isGeneral = channel.slug === 'general';
  if (activeCommunity && isGeneral && !isPinned) return null;
  if (activeChannel === channel.id) return null;

  return (
    <CommunityInfoContainer active={active}>
      {!activeCommunity && (
        <AvatarLink to={`/${community.slug}`}>
          <CommunityAvatar
            community={community}
            src={`${community.profilePhoto}?w=20&dpr=2`}
          />
        </AvatarLink>
      )}

      {!activeCommunity && (
        <MetaCommunityName to={`/${community.slug}`}>
          {community.name}
        </MetaCommunityName>
      )}

      {!isGeneral && (
        <PillLink className="pill" to={`/${community.slug}/${channel.slug}`}>
          <PillLabel>{channel.name}</PillLabel>
        </PillLink>
      )}
    </CommunityInfoContainer>
  );
};

export const WaterCoolerPill = ({
  thread: { community },
  active,
  activeCommunity,
}) => (
  <CommunityInfoContainer active={active}>
    {!activeCommunity && (
      <AvatarLink to={`/${community.slug}`}>
        <CommunityAvatar
          community={community}
          src={`${community.profilePhoto}?w=20&dpr=2`}
        />
      </AvatarLink>
    )}
    {!activeCommunity && (
      <MetaCommunityName to={`/${community.slug}`}>
        {community.name}
      </MetaCommunityName>
    )}
    <PillLinkPinned>
      <PillLabel>Open chat</PillLabel>
    </PillLinkPinned>
  </CommunityInfoContainer>
);
