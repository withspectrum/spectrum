// @flow
import React from 'react';
import { timeDifference } from 'shared/time-difference';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import {
  CommunityInfoContainer,
  AvatarLink,
  CommunityAvatar,
  PillLink,
  PillLinkPinned,
  PillLabel,
  MetaCommunityName,
  LastActiveTimestamp,
} from '../style';

type Props = {
  thread: GetThreadType,
  active: boolean,
  activeCommunity: ?Object,
  activeChannel: ?Object,
  isPinned?: boolean,
};

export default ({
  thread,
  active,
  activeCommunity,
  activeChannel,
  isPinned,
}: Props) => {
  const { channel, community } = thread;
  const isGeneral = channel.slug === 'general';
  if (activeCommunity && isGeneral) return null;
  if (activeChannel === channel.id) return null;

  const now = new Date().getTime();
  const then = thread.lastActive || thread.createdAt;
  const timestamp = timeDifference(now, new Date(then).getTime());

  return (
    <CommunityInfoContainer active={active}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
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
      </span>

      <LastActiveTimestamp active={active}>{timestamp}</LastActiveTimestamp>
    </CommunityInfoContainer>
  );
};

export const WaterCoolerPill = ({
  thread: { community },
  active,
  activeCommunity,
}: Props) => (
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
