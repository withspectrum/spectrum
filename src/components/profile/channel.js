// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import replace from 'string-replace-to-array';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import toggleChannelSubscriptionMutation from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import type { ToggleChannelSubscriptionType } from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import { addToastWithTimeout } from '../../actions/toasts';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import { NullCard } from '../upsell';
import {
  ChannelListItem,
  ChannelListItemLi,
  CommunityListItem,
} from '../listItems';
import Icon from '../icons';
import { Button } from '../buttons';
import { LoadingListItem } from '../loading';
import type { Dispatch } from 'redux';
import { FullTitle, FullDescription, ProfileCard, FullProfile } from './style';

type State = {
  isLoading: boolean,
};

type Props = {
  dispatch: Dispatch<Object>,
  toggleChannelSubscription: Function,
  profileSize: string,
  currentUser: Object,
  data: {
    channel: GetChannelType,
    loading: boolean,
    error: boolean,
  },
};

class ChannelWithData extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  toggleSubscription = (channelId: string) => {
    this.setState({
      isLoading: true,
    });

    this.props
      .toggleChannelSubscription({ channelId })
      .then(({ data }: ToggleChannelSubscriptionType) => {
        this.setState({
          isLoading: false,
        });

        const { toggleChannelSubscription } = data;

        const isMember = toggleChannelSubscription.channelPermissions.isMember;
        const isPending =
          toggleChannelSubscription.channelPermissions.isPending;
        let str = '';
        if (isPending) {
          str = `Requested to join ${toggleChannelSubscription.name} in ${
            toggleChannelSubscription.community.name
          }`;
        }

        if (!isPending && isMember) {
          str = `Joined ${toggleChannelSubscription.name} in ${
            toggleChannelSubscription.community.name
          }!`;
        }

        if (!isPending && !isMember) {
          str = `Left the channel ${toggleChannelSubscription.name} in ${
            toggleChannelSubscription.community.name
          }.`;
        }

        const type = isMember || isPending ? 'success' : 'neutral';
        this.props.dispatch(addToastWithTimeout(type, str));
        return;
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

    const MARKDOWN_LINK = /(?:\[(.*?)\]\((.*?)\))/g;

    const renderDescriptionWithLinks = text => {
      return replace(text, MARKDOWN_LINK, (fullLink, text, url) => (
        <a href={url} target="_blank" rel="noopener nofollower" key={url}>
          {text}
        </a>
      ));
    };

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

    const member = channel.channelPermissions.isMember;

    if (componentSize === 'full') {
      return (
        <FullProfile data-cy="channel-profile-full">
          <Link to={`/${channel.community.slug}`}>
            <CommunityListItem community={channel.community} />
          </Link>
          <FullTitle>
            {channel.name}
            {channel.isArchived && ' (Archived)'}
          </FullTitle>
          <FullDescription>
            {renderDescriptionWithLinks(channel.description)}
          </FullDescription>
        </FullProfile>
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

const Channel = compose(toggleChannelSubscriptionMutation)(ChannelWithData);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

// $FlowIssue
export default connect(mapStateToProps)(Channel);
