// @flow
import React from 'react';
import Card from '../card';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';

import { toggleChannelSubscriptionMutation } from '../../api/channel';
import { addToastWithTimeout } from '../../actions/toasts';

import { displayLoadingCard } from '../loading';
import { MetaData } from './metaData';
import type { ProfileSizeProps } from './index';

import {
  ProfileHeader,
  ProfileHeaderLink,
  ProfileHeaderMeta,
  ProfileHeaderAction,
  Title,
  Subtitle,
  Description,
  Actions,
  Action,
} from './style';

type ChannelProps = {
  id: string,
  name: string,
  slug: string,
  description: string,
  channelPermissions: Object,
  community: {
    slug: string,
    name: string,
    communityPermissions: Object,
  },
  metaData: {
    threads: number,
    subscribers: number,
  },
};

const ChannelWithData = ({
  data: { channel },
  profileSize,
  toggleChannelSubscription,
  dispatch,
  currentUser,
}: {
  data: { channel: ChannelProps },
  profileSize: ProfileSizeProps,
  toggleChannelSubscription: Function,
  dispatch: Function,
  currentUser: Object,
}): React$Element<any> => {
  const componentSize = profileSize || 'mini';

  if (!channel) {
    return <div>No channel to be found!</div>;
  }

  const toggleSubscription = channelId => {
    toggleChannelSubscription({ channelId })
      .then(({ data: { toggleChannelSubscription } }) => {
        const str = toggleChannelSubscription.channelPermissions.isMember
          ? `Joined ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}!`
          : `Left the channel ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}.`;

        const type = toggleChannelSubscription.channelPermissions.isMember
          ? 'success'
          : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  return (
    <Card>
      <ProfileHeader justifyContent={'flex-start'} alignItems={'center'}>
        <ProfileHeaderMeta direction={'column'} justifyContent={'center'}>
          <ProfileHeaderLink to={`/${channel.community.slug}/${channel.slug}`}>
            <Title>~ {channel.name}</Title>
          </ProfileHeaderLink>
          <Link to={`/${channel.community.slug}`}>
            <Subtitle>{channel.community.name}</Subtitle>
          </Link>
        </ProfileHeaderMeta>

        {currentUser &&
          !channel.community.communityPermissions.isOwner &&
          !channel.channelPermissions.isOwner &&
          <ProfileHeaderAction
            glyph={channel.channelPermissions.isMember ? 'minus' : 'plus-fill'}
            color={
              channel.channelPermissions.isMember
                ? 'text.placeholder'
                : 'brand.alt'
            }
            hoverColor={
              channel.channelPermissions.isMember ? 'warn.default' : 'brand.alt'
            }
            tipText={
              channel.channelPermissions.isMember
                ? `Leave channel`
                : 'Join channel'
            }
            tipLocation="top-left"
            onClick={() => toggleSubscription(channel.id)}
          />}

        {currentUser &&
          (channel.channelPermissions.isOwner ||
            channel.community.communityPermissions.isOwner) &&
          <ProfileHeaderAction
            glyph="settings"
            tipText={`Channel settings`}
            tipLocation="top-left"
          />}

      </ProfileHeader>

      {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        <Description>{channel.description}</Description>}

      {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        (currentUser &&
          !channel.channelPermissions.isMember &&
          (!channel.channelPermissions.isOwner &&
            !channel.community.communityPermissions.isOwner)) &&
        <Actions>
          <Action onClick={() => toggleSubscription(channel.id)}>
            Join {channel.name}
          </Action>
        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={channel.metaData} />}
    </Card>
  );
};

const Channel = compose(
  toggleChannelSubscriptionMutation,
  displayLoadingCard,
  pure
)(ChannelWithData);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(Channel);
