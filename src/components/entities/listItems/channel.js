// @flow
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Icon from 'src/components/icon';
import JoinChannelWrapper from 'src/components/joinChannelWrapper';
import LeaveChannelWrapper from 'src/components/leaveChannelWrapper';
import ToggleChannelNotifications from 'src/components/toggleChannelNotifications';
import { OutlineButton, PrimaryOutlineButton } from 'src/components/button';
import Tooltip from 'src/components/tooltip';
import {
  ChannelRow,
  ChannelContent,
  Label,
  Description,
  ChannelActions,
} from './style';

type Props = {
  channel: ?ChannelInfoType,
  id: string,
  name?: string,
  description?: ?string,
  currentUser: ?Object,
  children?: React$Node,
  isActive?: boolean,
};

const Channel = (props: Props) => {
  const {
    channel,
    name,
    description,
    children,
    currentUser,
    isActive = false,
  } = props;
  const [isHoveringNotifications, setIsHoveringNotifications] = useState(false);
  if (!channel) return null;

  const renderAction = () => {
    const chevron = <Icon glyph="view-forward" size={24} />;
    if (!currentUser) return chevron;

    const { community, channelPermissions } = channel;
    const { communityPermissions } = community;

    const isCommunityMember = communityPermissions.isMember;
    if (!isCommunityMember) return chevron;

    if (
      communityPermissions.isModerator ||
      communityPermissions.isOwner ||
      channelPermissions.isModerator ||
      channelPermissions.isOwner
    ) {
      const { isMember } = channelPermissions;
      return (
        <React.Fragment>
          <Tooltip content="Go to settings">
            <span style={{ marginLeft: '8px', display: 'flex' }}>
              <OutlineButton
                to={`/${community.slug}/${channel.slug}/settings`}
                size={'small'}
                style={{ padding: '4px' }}
              >
                <Icon
                  style={{ marginTop: '-1px' }}
                  glyph="settings"
                  size={24}
                />
              </OutlineButton>
            </span>
          </Tooltip>
          {!isMember && (
            <React.Fragment>
              <span style={{ padding: '4px' }} />
              <JoinChannelWrapper
                channel={channel}
                render={({ isLoading }) => (
                  <PrimaryOutlineButton
                    size={'small'}
                    style={{ width: '100px' }}
                  >
                    {isLoading ? 'Joining...' : 'Join'}
                  </PrimaryOutlineButton>
                )}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }

    const { isMember } = channelPermissions;

    if (isMember)
      return (
        <LeaveChannelWrapper
          channel={channel}
          render={({ isLoading, isHovering }) => (
            <OutlineButton size={'small'} style={{ width: '100px' }}>
              {isLoading ? 'Leaving...' : isHovering ? 'Leave' : 'Member'}
            </OutlineButton>
          )}
        />
      );

    return (
      <JoinChannelWrapper
        channel={channel}
        render={({ isLoading }) => (
          <PrimaryOutlineButton size={'small'} style={{ width: '100px' }}>
            {isLoading ? 'Joining...' : 'Join'}
          </PrimaryOutlineButton>
        )}
      />
    );
  };

  const renderNotificationPreferences = () => {
    if (!currentUser) return null;

    const { community, channelPermissions } = channel;
    const { communityPermissions } = community;

    const isCommunityMember = communityPermissions.isMember;
    if (!isCommunityMember) return null;

    const { receiveNotifications, isMember } = channelPermissions;
    if (!isMember) return null;

    const tipText = receiveNotifications
      ? 'Mute notifications'
      : 'Enable channel notifications';
    const glyph = receiveNotifications
      ? isHoveringNotifications
        ? 'mute'
        : 'notification'
      : isHoveringNotifications
      ? 'notification'
      : 'mute';

    return (
      <ToggleChannelNotifications
        channel={channel}
        render={({ isLoading }) => (
          <Tooltip content={tipText}>
            <span style={{ marginLeft: '8px', display: 'flex' }}>
              <OutlineButton
                disabled={isLoading}
                onMouseEnter={() => setIsHoveringNotifications(true)}
                onMouseLeave={() => setIsHoveringNotifications(false)}
                style={{ padding: '4px' }}
                size={'small'}
              >
                <Icon
                  style={{
                    marginTop: '-1px',
                  }}
                  glyph={glyph}
                  size={24}
                />
              </OutlineButton>
            </span>
          </Tooltip>
        )}
      />
    );
  };

  return (
    <ErrorBoundary>
      <ChannelRow isActive={isActive}>
        <Link to={`/${channel.community.slug}/${channel.slug}?tab=posts`}>
          <ChannelContent>
            {name && (
              <Label title={name}>
                {channel.isPrivate && (
                  <Icon glyph="private-outline" size={14} />
                )}
                # {name}
              </Label>
            )}

            {description && <Description>{description}</Description>}
          </ChannelContent>
        </Link>

        <ChannelActions>
          {renderAction()}
          {renderNotificationPreferences()}
          {children}
        </ChannelActions>
      </ChannelRow>
    </ErrorBoundary>
  );
};

export const ChannelListItem = compose(withCurrentUser)(Channel);
