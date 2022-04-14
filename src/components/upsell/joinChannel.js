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
import { JoinChannelContainer, JoinChannelContent } from './style';
import { Button } from 'src/components/button';

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
  state = { isLoading: false };

  login = () => this.props.dispatch(openModal('LOGIN_MODAL'));

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
    const label = !currentUser
      ? `Join ${community.name} community`
      : community.communityPermissions.isMember
      ? `Join ${channel.name} channel`
      : `Join ${community.name} community`;

    return (
      <JoinChannelContainer>
        <JoinChannelContent>
          <Button
            loading={isLoading}
            onClick={currentUser ? this.toggleSubscription : this.login}
            data-cy={
              currentUser
                ? 'thread-join-channel-upsell-button'
                : 'join-channel-login-upsell'
            }
          >
            {isLoading ? 'Joining...' : label}
          </Button>
        </JoinChannelContent>
      </JoinChannelContainer>
    );
  }
}

export default compose(
  connect(),
  withCurrentUser,
  toggleChannelSubscriptionMutation
)(JoinChannel);
