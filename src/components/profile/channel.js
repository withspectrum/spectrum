// @flow
import React, { Component } from 'react';
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
import { ChannelListItem, ChannelListItemLi } from '../listItems';
import Icon from '../icons';
import { Button } from '../buttons';
import { LoadingListItem } from '../loading';
import { MetaData } from './metaData';

import { ProfileHeaderAction, ProfileCard } from './style';

class ChannelWithData extends Component {
  state: {
    isLoading: boolean,
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
    };
  }

  toggleSubscription = (channelId: string) => {
    this.setState({
      isLoading: true,
    });

    this.props
      .toggleChannelSubscription({ channelId })
      .then(({ data: { toggleChannelSubscription } }) => {
        this.setState({
          isLoading: false,
        });

        const isMember = toggleChannelSubscription.channelPermissions.isMember;
        const isPending =
          toggleChannelSubscription.channelPermissions.isPending;
        let str;
        if (isPending) {
          track('channel', 'requested to join', null);
          str = `Requested to join ${toggleChannelSubscription.name} in ${toggleChannelSubscription
            .community.name}`;
        }

        if (!isPending && isMember) {
          track('channel', 'joined', null);
          str = `Joined ${toggleChannelSubscription.name} in ${toggleChannelSubscription
            .community.name}!`;
        }

        if (!isPending && !isMember) {
          track('channel', 'unjoined', null);
          str = `Left the channel ${toggleChannelSubscription.name} in ${toggleChannelSubscription
            .community.name}.`;
        }

        const type = isMember || isPending ? 'success' : 'neutral';
        this.props.dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      data: { channel, loading, error },
      profileSize,
      currentUser,
    } = this.props;
    const { isLoading } = this.state;
    const componentSize = profileSize || 'mini';

    if (loading) {
      return <LoadingListItem />;
    }

    if (error || !channel) {
      if (
        componentSize === 'miniWithAction' ||
        componentSize === 'listItemWithAction'
      ) {
        return null;
      } else {
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
      }
    }

    const communityOwner = channel.community.communityPermissions.isOwner;
    const channelOwner = channel.channelPermissions.isOwner;
    const member = channel.channelPermissions.isMember;

    const communityLink = () => {
      return (
        <Link to={`/${channel.community.slug}`}>{channel.community.name}</Link>
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
            onClick={() => this.toggleSubscription(channel.id)}
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
            onClick={() => this.toggleSubscription(channel.id)}
          />
        );
      }
    };

    if (componentSize === 'full') {
      return (
        <ProfileCard>
          <ChannelListItem
            contents={channel}
            withDescription={true}
            meta={communityLink()}
            channelIcon
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
              channelIcon
            >
              <Icon glyph="view-forward" />
            </ChannelListItem>
          </Link>
        </ProfileCard>
      );
    } else if (componentSize === 'miniWithAction') {
      return (
        <ProfileCard>
          <ChannelListItem
            clickable
            contents={channel}
            withDescription={false}
            meta={`${channel.community.name}`}
            channelIcon={false}
          >
            {currentUser &&
            member && (
              <Button
                loading={isLoading}
                icon="checkmark"
                gradientTheme="none"
                color="text.placeholder"
                hoverColor="text.placeholder"
                onClick={() => this.toggleSubscription(channel.id)}
              >
                Joined
              </Button>
            )}
            {currentUser &&
            !member && (
              <Button
                loading={isLoading}
                icon="plus-fill"
                gradientTheme="success"
                onClick={() => this.toggleSubscription(channel.id)}
              >
                Join
              </Button>
            )}
          </ChannelListItem>
        </ProfileCard>
      );
    } else if (componentSize === 'listItemWithAction') {
      return (
        <ChannelListItemLi
          clickable
          contents={channel}
          withDescription={false}
          meta={`${channel.metaData.members} members`}
          channelIcon={false}
        >
          {currentUser &&
          member && (
            <Button
              loading={isLoading}
              icon="checkmark"
              gradientTheme="none"
              color="text.placeholder"
              hoverColor="text.placeholder"
              onClick={() => this.toggleSubscription(channel.id)}
            >
              Joined
            </Button>
          )}
          {currentUser &&
          !member && (
            <Button
              size={'small'}
              loading={isLoading}
              icon="plus-fill"
              color={'success.alt'}
              gradientTheme="success"
              onClick={() => this.toggleSubscription(channel.id)}
            >
              Join
            </Button>
          )}
        </ChannelListItemLi>
      );
    }
  }
}

const Channel = compose(toggleChannelSubscriptionMutation, pure)(
  ChannelWithData
);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(Channel);
