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
import JoinChannel from './JoinCommunityWrapper';
import { ActionsRowContainer } from '../style';

export const UnconnectedChannelActions = (props: ChannelActionsRowType) => {
  const { channel, dispatch } = props;
  const { isMember, isOwner, isModerator } = channel.channelPermissions;
  const isTeamMember = isOwner || isModerator;

  if (isMember) {
    return (
      <ActionsRowContainer>
        {isTeamMember && (
          <OutlineButton to={`/${channel.slug}/settings`}>
            Settings
          </OutlineButton>
        )}

        {!isOwner && (
          <HoverWarnOutlineButton>Leave channel</HoverWarnOutlineButton>
        )}
      </ActionsRowContainer>
    );
  }

  return (
    <ActionsRowContainer>
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
