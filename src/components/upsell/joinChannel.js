// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import toggleChannelSubscriptionMutation from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import type { ToggleChannelSubscriptionType } from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import { addToastWithTimeout } from '../../actions/toasts';
import type { Dispatch } from 'redux';
import {
  JoinChannelContainer,
  JoinChannelContent,
  JoinChannelTitle,
  JoinChannelSubtitle,
} from './style';
import { Button } from '../buttons';

type Props = {
  channel: Object,
  community: Object,
  toggleChannelSubscription: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  isLoading: boolean,
};

class JoinChannel extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isLoading: false,
    };
  }

  toggleSubscription = () => {
    const { channel, dispatch } = this.props;

    this.setState({
      isLoading: true,
    });

    this.props
      .toggleChannelSubscription({ channelId: channel.id })
      .then(({ data }: ToggleChannelSubscriptionType) => {
        const { toggleChannelSubscription } = data;

        this.setState({
          isLoading: false,
        });

        const {
          isMember,
          isPending,
        } = toggleChannelSubscription.channelPermissions;

        let str = '';
        if (isPending) {
          str = `Requested to join ${toggleChannelSubscription.name} in ${
            toggleChannelSubscription.name
          }`;
        }

        if (!isPending && isMember) {
          str = `Joined ${toggleChannelSubscription.name} in ${
            toggleChannelSubscription.name
          }!`;
        }

        if (!isPending && !isMember) {
          str = `Left the channel ${toggleChannelSubscription.name} in ${
            toggleChannelSubscription.name
          }.`;
        }

        const type = isMember || isPending ? 'success' : 'neutral';
        dispatch(addToastWithTimeout(type, str));
        return;
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { isLoading } = this.state;
    const { channel, community } = this.props;
    return (
      <JoinChannelContainer>
        <JoinChannelContent>
          <JoinChannelTitle>
            Join the {channel.name} channel in the {community.name} community
          </JoinChannelTitle>
          <JoinChannelSubtitle>
            Once you join this channel you’ll be able to post your replies here!
          </JoinChannelSubtitle>
        </JoinChannelContent>

        <Button
          loading={isLoading}
          onClick={this.toggleSubscription}
          icon="plus"
          label
          dataCy="thread-join-channel-upsell-button"
        >
          Join
        </Button>
      </JoinChannelContainer>
    );
  }
}

export default compose(connect(), toggleChannelSubscriptionMutation)(
  JoinChannel
);
