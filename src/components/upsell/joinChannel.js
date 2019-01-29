// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import toggleChannelSubscriptionMutation from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import type { ToggleChannelSubscriptionType } from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import { addToastWithTimeout } from 'src/actions/toasts';
import { openModal } from 'src/actions/modals';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  JoinChannelContainer,
  JoinChannelContent,
  JoinChannelTitle,
  JoinChannelSubtitle,
} from './style';
import { Button } from 'src/components/buttons';

type Props = {
  channel: Object,
  community: Object,
  toggleChannelSubscription: Function,
  dispatch: Dispatch<Object>,
  currentUser: ?Object,
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

  login = () => this.props.dispatch(openModal('CHAT_INPUT_LOGIN_MODAL'));

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
    const { channel, community, currentUser } = this.props;

    if (!currentUser) {
      return (
        <JoinChannelContainer data-cy="join-channel-login-upsell">
          <JoinChannelContent>
            <JoinChannelTitle>Log in or sign up to chat</JoinChannelTitle>
          </JoinChannelContent>

          <Button
            loading={isLoading}
            onClick={this.login}
            dataCy="thread-join-channel-upsell-button"
          >
            Log in or sign up
          </Button>
        </JoinChannelContainer>
      );
    }

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
          dataCy="thread-join-channel-upsell-button"
        >
          Join
        </Button>
      </JoinChannelContainer>
    );
  }
}

export default compose(
  connect(),
  withCurrentUser,
  toggleChannelSubscriptionMutation
)(JoinChannel);
