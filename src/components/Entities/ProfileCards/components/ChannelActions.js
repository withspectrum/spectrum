// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { ChannelActionsRowType } from '../types';
import {
  PrimaryButton,
  OutlineButton,
  HoverWarnOutlineButton,
} from 'src/views/Community/components/Button';
import { openModal } from 'src/actions/modals';
import JoinChannel from './JoinChannelWrapper';
import LeaveChannel from './LeaveChannelWrapper';
import { ActionsRowContainer } from '../style';

export const UnconnectedChannelActions = (props: ChannelActionsRowType) => {
  const { channel, dispatch } = props;
  const { community } = channel;
  const { isMember, isOwner, isModerator } = community.communityPermissions;
  const isTeamMember = isOwner || isModerator;

  const { channelPermissions } = channel;

  if (channelPermissions.isMember) {
    return (
      <ActionsRowContainer>
        {isTeamMember && (
          <OutlineButton to={`/${community.slug}/${channel.slug}/settings`}>
            Settings
          </OutlineButton>
        )}

        <LeaveChannel
          channelId={channel.id}
          render={({ isLoading }) => (
            <HoverWarnOutlineButton isLoading={isLoading} icon={'door-enter'}>
              {isLoading ? 'Leaving...' : 'Leave channel'}
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
        channelId={channel.id}
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
