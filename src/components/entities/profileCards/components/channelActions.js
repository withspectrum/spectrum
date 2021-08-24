// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import { OutlineButton } from 'src/components/button';
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
    </ActionsRowContainer>
  );
};

export const ChannelActions = connect()(UnconnectedChannelActions);
