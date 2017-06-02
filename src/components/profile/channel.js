// @flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
import { track } from '../../helpers/events';
import { toggleChannelSubscriptionMutation } from '../../api/channel';
import { addToastWithTimeout } from '../../actions/toasts';

import { NullCard } from '../upsell';
import { ChannelListItem } from '../listItems';
import Icon from '../icons';
import { Button } from '../buttons';
import { LoadingListItem } from '../loading';
import { MetaData } from './metaData';

import { ProfileHeaderAction, ProfileCard } from './style';

const ChannelWithData = props => {
  const {
    data: { channel, loading, error },
    profileSize,
    toggleChannelSubscription,
    dispatch,
    currentUser,
  } = props;

  const communityOwner = channel.community.communityPermissions.isOwner;
  const channelOwner = channel.channelPermissions.isOwner;
  const member = channel.channelPermissions.isMember;

  const componentSize = profileSize || 'mini';

  const toggleSubscription = (channelId: string) => {
    toggleChannelSubscription({ channelId })
      .then(({ data: { toggleChannelSubscription } }) => {
        const isMember = toggleChannelSubscription.channelPermissions.isMember;
        const isPending =
          toggleChannelSubscription.channelPermissions.isPending;
        let str;
        if (isPending) {
          track('channel', 'requested to join', null);
          str = `Requested to join ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}`;
        }

        if (!isPending && isMember) {
          track('channel', 'joined', null);
          str = `Joined ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}!`;
        }

        if (!isPending && !isMember) {
          track('channel', 'unjoined', null);
          str = `Left the channel ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}.`;
        }

        const type = isMember || isPending ? 'success' : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  const communityLink = () => {
    return (
      <Link to={`/${channel.community.slug}`}>
        {channel.community.name}
      </Link>
    );
  };

  const returnAction = () => {
    if (communityOwner || channelOwner) {
      return (
        <Link to={`/${channel.community.slug}/${channel.slug}/settings`}>
          <ProfileHeaderAction
            glyph="settings"
            tipText={`Channel settings`}
            tipLocation="top-left"
          />
        </Link>
      );
    } else if (member) {
      return (
        <ProfileHeaderAction
          glyph="minus"
          color="text.placeholder"
          hoverColor="warn.default"
          tipText="Leave channel"
          tipLocation="top-left"
          onClick={() => toggleSubscription(channel.id)}
        />
      );
    } else if (currentUser && !member) {
      return (
        <ProfileHeaderAction
          glyph="plus-fill"
          color="brand.alt"
          hoverColor="brand.alt"
          tipText="Join channel"
          tipLocation="top-left"
          onClick={() => toggleSubscription(channel.id)}
        />
      );
    } else {
      return (
        <Link to={`/${channel.community.slug}/${channel.slug}`}>
          <ProfileHeaderAction glyph="view-forward" />
        </Link>
      );
    }
  };

  if (loading) {
    return <LoadingListItem />;
  } else if (error || !channel) {
    return (
      <NullCard
        bg="error"
        heading="Whoa there!"
        copy="This is uncharted space. Let's get you safely back home, huh?"
      >
        <Link to={'/home'}>
          <Button>Take me home</Button>
        </Link>
      </NullCard>
    );
  } else if (componentSize === 'full') {
    return (
      <ProfileCard>
        <ChannelListItem
          contents={channel}
          withDescription={true}
          meta={communityLink()}
        >
          {returnAction()}
        </ChannelListItem>
        <MetaData data={channel.metaData} />
      </ProfileCard>
    );
  } else if (componentSize === 'mini') {
    return (
      <ProfileCard>
        <Link to={`/${channel.community.slug}/${channel.slug}`}>
          <ChannelListItem
            clickable
            contents={channel}
            withDescription={false}
            meta={`${channel.community.name} / ${channel.name}`}
          >
            <Icon glyph="view-forward" />
          </ChannelListItem>
        </Link>
      </ProfileCard>
    );
  }
};

const Channel = compose(toggleChannelSubscriptionMutation, pure)(
  ChannelWithData
);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(Channel);
