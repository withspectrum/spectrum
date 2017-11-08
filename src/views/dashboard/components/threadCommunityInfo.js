import React from 'react';
import Icon from '../../../components/icons';
import {
  CommunityInfoContainer,
  AvatarLink,
  CommunityAvatar,
  PillLink,
  PillLinkPinned,
  PinIcon,
  PillLabel,
  MetaCommunityName,
  Lock,
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
          <CommunityAvatar src={`${community.profilePhoto}?w=20&dpr=2`} />
        </AvatarLink>
      )}

      {!activeCommunity && (
        <MetaCommunityName to={`/${community.slug}`}>
          {community.name}
        </MetaCommunityName>
      )}

      {!isGeneral && (
        <PillLink className="pill" to={`/${community.slug}/${channel.slug}`}>
          {channel.isPrivate && (
            <Lock>
              <Icon glyph="private" size={12} />
            </Lock>
          )}
          <PillLabel isPrivate={channel.isPrivate}>{channel.name}</PillLabel>
        </PillLink>
      )}

      {isPinned && (
        <PillLinkPinned>
          <PinIcon>
            <Icon glyph="pin-fill" size={12} />
          </PinIcon>
          <PillLabel>Pinned</PillLabel>
        </PillLinkPinned>
      )}
    </CommunityInfoContainer>
  );
};

export const WaterCoolerPill = ({ active }) => (
  <CommunityInfoContainer active={active}>
    <PillLinkPinned>
      <PinIcon>
        <Icon glyph="message" size={12} />
      </PinIcon>
      <PillLabel>Community chat</PillLabel>
    </PillLinkPinned>
  </CommunityInfoContainer>
);
