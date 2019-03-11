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

type Props = {
  title: string,
  menuAction: 'menu' | 'view-back',
  titleIcon?: any,
  rightAction?: any,
  forceHistoryBack?: string,
  previousHistoryBackFallback?: string,
};

export const MobileTitlebar = (props: Props) => (
  <BaseTitlebar
    style={{ borderBottom: `1px solid ${theme.bg.border}` }}
    {...props}
  />
);

export const DesktopTitlebar = (props: Props) => (
  <BaseTitlebar
    desktop
    style={{ borderBottom: `1px solid ${theme.bg.border}` }}
    {...props}
  />
);

export const MobileCommunityTitlebar = (props: Props) => {
  const { community } = props;
  return (
    <BaseTitlebar
      title={community.name}
      menuAction={'menu'}
      titleIcon={
        <CommunityAvatar isClickable={false} community={community} size={24} />
      }
      rightAction={<MobileCommunityAction community={community} />}
    />
  );
};

export const MobileChannelTitlebar = (props: Props) => {
  const { channel } = props;

  return (
    <BaseTitlebar
      title={`# ${channel.name}`}
      menuAction={'view-back'}
      titleIcon={
        <CommunityAvatar
          isClickable={false}
          community={channel.community}
          size={24}
        />
      }
      rightAction={<MobileChannelAction channel={channel} />}
    />
  );
};

export const MobileUserTitlebar = (props: Props) => {
  const { user } = props;
  return (
    <BaseTitlebar
      title={user.name}
      menuAction={'view-back'}
      titleIcon={
        <UserAvatar
          isClickable={false}
          showOnlineStatus={false}
          user={user}
          size={24}
        />
      }
      rightAction={<MobileUserAction user={user} />}
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
      menuAction={'view-back'}
    />
  );
};
