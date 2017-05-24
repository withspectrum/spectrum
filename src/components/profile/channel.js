// @flow
import React from 'react';
import Card from '../card';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
import { toggleChannelSubscriptionMutation } from '../../api/channel';
import { addToastWithTimeout } from '../../actions/toasts';
import { LoadingCard } from '../loading';
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
import { MetaData } from './metaData';
import type { ProfileSizeProps } from './index';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

type ChannelProps = {
  id: String,
  name: String,
  slug: String,
  description: String,
  community: {
    slug: String,
    name: String,
  },
  metaData: {
    threads: Number,
    subscribers: Number,
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
            <Title>{channel.name}</Title>
          </ProfileHeaderLink>
          <Link to={`/${channel.community.slug}`}>
            <Subtitle>{channel.community.name}</Subtitle>
          </Link>
        </ProfileHeaderMeta>

        {componentSize !== 'mini' &&
          (currentUser && channel.isMember) &&
          <ProfileHeaderAction
            glyph="minus"
            color="text.placeholder"
            hoverColor="warn.default"
            tipText={`Leave ~${channel.name}`}
            tipLocation="top-left"
          />}

        {componentSize !== 'mini' &&
          (currentUser && (channel.isOwner || channel.community.isOwner)) &&
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
        currentUser &&
        <Actions>
          {// user is not a member and doesn't own the channel
          !channel.channelPermissions.isMember &&
            (!channel.channelPermissions.isOwner &&
              !channel.community.communityPermissions.isOwner) &&
            <Action onClick={() => toggleSubscription(channel.id)}>
              Join {channel.name}
            </Action>}
        </Actions>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={channel.metaData} />}
    </Card>
  );
};

const Channel = compose(
  toggleChannelSubscriptionMutation,
  displayLoadingState,
  pure
)(ChannelWithData);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(Channel);
