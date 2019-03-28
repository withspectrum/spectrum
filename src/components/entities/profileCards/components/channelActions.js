// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import {
  OutlineButton,
  PrimaryOutlineButton,
  HoverWarnOutlineButton,
} from 'src/components/button';
import JoinChannel from 'src/components/joinChannelWrapper';
import LeaveChannel from 'src/components/leaveChannelWrapper';
import { ActionsRowContainer } from '../style';

type Props = {
  channel: ChannelInfoType,
};

export const UnconnectedChannelActions = (props: Props) => {
  const { channel } = props;
  const { community } = channel;
  const { isOwner, isModerator } = community.communityPermissions;
  const isTeamMember = isOwner || isModerator;
  const { channelPermissions } = channel;

  if (channelPermissions.isMember) {
    return (
      <ActionsRowContainer>
        {isTeamMember && (
          <OutlineButton
            data-cy="channel-settings-button"
            to={`/${community.slug}/${channel.slug}/settings`}
          >
            Settings
          </OutlineButton>
        )}

        <LeaveChannel
          channel={channel}
          render={({ isLoading, isHovering }) => (
            <HoverWarnOutlineButton isLoading={isLoading} icon={'door-enter'}>
              {isLoading
                ? 'Leaving...'
                : isHovering
                ? 'Leave channel'
                : 'Member'}
            </HoverWarnOutlineButton>
          )}
        />
      </ActionsRowContainer>
    );
  }

  return (
    <ActionsRowContainer>
      {isTeamMember && (
        <OutlineButton to={`/${community.slug}/${channel.slug}/settings`}>
          Settings
        </OutlineButton>
      )}

      <JoinChannel
        channel={channel}
        render={({ isLoading }) => (
          <PrimaryOutlineButton isLoading={isLoading} icon={'door-enter'}>
            {isLoading ? 'Joining...' : 'Join channel'}
          </PrimaryOutlineButton>
        )}
      />
    </ActionsRowContainer>
  );
};

export const ChannelActions = connect()(UnconnectedChannelActions);
