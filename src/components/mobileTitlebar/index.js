// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import BaseTitlebar from './base';
import {
  MobileCommunityAction,
  MobileChannelAction,
  MobileUserAction,
} from './actions';
import { UserAvatar, CommunityAvatar } from 'src/components/avatar';

const Community = (props: Props) => {
  const { community, history } = props;
  return (
    <BaseTitlebar
      history={history}
      title={community.name}
      titlebarMenuAction={'menu'}
      titlebarIcon={
        <CommunityAvatar isClickable={false} community={community} size={24} />
      }
      titlebarAction={<MobileCommunityAction community={community} />}
    />
  );
};

export const MobileCommunityTitlebar = compose(withRouter)(Community);

const Channel = (props: Props) => {
  const { channel, history } = props;
  return (
    <BaseTitlebar
      history={history}
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

export const MobileChannelTitlebar = compose(withRouter)(Channel);

const User = (props: Props) => {
  const { user, history } = props;
  return (
    <BaseTitlebar
      history={history}
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

export const MobileUserTitlebar = compose(withRouter)(User);
