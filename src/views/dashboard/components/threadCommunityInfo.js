// @flow
import * as React from 'react';
import { timeDifferenceShort } from 'shared/time-difference';
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
  const now = new Date().getTime();
  const then = thread.lastActive || thread.createdAt;
  const timestamp = timeDifferenceShort(now, new Date(then).getTime());

  return (
    <CommunityInfoContainer active={active}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {!activeCommunity &&
          !activeChannel && (
            <React.Fragment>
              <AvatarLink to={`/${community.slug}`}>
                <CommunityAvatar
                  community={community}
                  src={`${community.profilePhoto}?w=20&dpr=2`}
                />
              </AvatarLink>

              <MetaCommunityName to={`/${community.slug}`}>
                {community.name}
              </MetaCommunityName>
            </React.Fragment>
          )}

        <PillLink className="pill" to={`/${community.slug}/${channel.slug}`}>
          <PillLabel>{channel.name}</PillLabel>
        </PillLink>
      </span>

      <LastActiveTimestamp active={active}>{timestamp}</LastActiveTimestamp>
    </CommunityInfoContainer>
  );
};

export const WaterCoolerPill = ({
  thread: { community, lastActive, createdAt },
  active,
  activeCommunity,
  activeChannel,
}: Props) => {
  const now = new Date().getTime();
  const then = lastActive || createdAt;
  const timestamp = timeDifferenceShort(now, new Date(then).getTime());

  if (activeCommunity) {
    return (
      <CommunityInfoContainer active={active}>
        <span>
          <PillLinkPinned>
            <PillLabel>Open chat</PillLabel>
          </PillLinkPinned>
        </span>
        <LastActiveTimestamp active={active}>{timestamp}</LastActiveTimestamp>
      </CommunityInfoContainer>
    );
  }

  return (
    <CommunityInfoContainer active={active}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {!activeCommunity &&
          !activeChannel && (
            <React.Fragment>
              <AvatarLink to={`/${community.slug}`}>
                <CommunityAvatar
                  community={community}
                  src={`${community.profilePhoto}?w=20&dpr=2`}
                />
              </AvatarLink>

              <MetaCommunityName to={`/${community.slug}`}>
                {community.name}
              </MetaCommunityName>
            </React.Fragment>
          )}
        <PillLinkPinned>
          <PillLabel>Open chat</PillLabel>
        </PillLinkPinned>
      </span>

      <LastActiveTimestamp active={active}>{timestamp}</LastActiveTimestamp>
    </CommunityInfoContainer>
  );
};
