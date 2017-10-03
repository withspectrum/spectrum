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

export default ({ thread, active, activeCommunity, isPinned }) => {
  const { channel } = thread;
  const isGeneral = channel.slug === 'general';
  if (activeCommunity && isGeneral && !isPinned) return null;

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
