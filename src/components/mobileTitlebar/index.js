// @flow
import React from 'react';
import theme from 'shared/theme';
import BaseTitlebar from './base';
import {
  MobileCommunityAction,
  MobileChannelAction,
  MobileUserAction,
} from './actions';
import { UserAvatar, CommunityAvatar } from 'src/components/avatar';

export const MobileCommunityTitlebar = (props: Props) => {
  const { community } = props;
  return (
    <BaseTitlebar
      title={community.name}
      titlebarMenuAction={'menu'}
      titlebarIcon={
        <CommunityAvatar isClickable={false} community={community} size={24} />
      }
      titlebarAction={<MobileCommunityAction community={community} />}
    />
  );
};

export const MobileChannelTitlebar = (props: Props) => {
  const { channel } = props;

  return (
    <BaseTitlebar
      title={`# ${channel.name}`}
      titlebarMenuAction={'view-back'}
      titlebarIcon={
        <CommunityAvatar
          isClickable={false}
          community={channel.community}
          size={24}
        />
      }
      titlebarAction={<MobileChannelAction channel={channel} />}
    />
  );
};

export const MobileUserTitlebar = (props: Props) => {
  const { user } = props;
  return (
    <BaseTitlebar
      title={user.name}
      titlebarMenuAction={'view-back'}
      titlebarIcon={
        <UserAvatar
          isClickable={false}
          showOnlineStatus={false}
          user={user}
          size={24}
        />
      }
      titlebarAction={<MobileUserAction user={user} />}
    />
  );
};

export const LoadingTitlebar = () => {
  return (
    <BaseTitlebar
      style={{
        borderBottom: `1px solid ${theme.bg.border}`,
        padding: '28px',
      }}
    />
  );
};

export const ErrorTitlebar = () => {
  return (
    <BaseTitlebar
      style={{
        borderBottom: `1px solid ${theme.bg.border}`,
        padding: '12px',
      }}
      title="Error"
      titlebarMenuAction={'view-back'}
    />
  );
};
