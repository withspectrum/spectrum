// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { ChannelActionsRowType } from '../types';
import getComposerLink from 'src/helpers/get-composer-link';
import {
  PrimaryButton,
  OutlineButton,
  PrimaryOutlineButton,
  HoverWarnOutlineButton,
} from 'src/views/community/components/button';
import JoinChannel from 'src/components/joinChannelWrapper';
import LeaveChannel from 'src/components/leaveChannelWrapper';
import { ActionsRowContainer } from '../style';

export const UnconnectedChannelActions = (props: ChannelActionsRowType) => {
  const { channel } = props;
  const { community } = channel;
  const { isOwner, isModerator } = community.communityPermissions;
  const isTeamMember = isOwner || isModerator;

  const { channelPermissions } = channel;

  const { pathname, search } = getComposerLink({
    communityId: community.id,
    channelId: channel.id,
  });

  if (channelPermissions.isMember) {
    return (
      <ActionsRowContainer>
        {isTeamMember && (
          <OutlineButton to={`/${community.slug}/${channel.slug}/settings`}>
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

        <PrimaryOutlineButton to={{ pathname, search, state: { modal: true } }}>
          New Post
        </PrimaryOutlineButton>
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
          <PrimaryButton isLoading={isLoading} icon={'door-enter'}>
            {isLoading ? 'Joining...' : 'Join channel'}
          </PrimaryButton>
        )}
      />
    </ActionsRowContainer>
  );
};

export const ChannelActions = connect()(UnconnectedChannelActions);
