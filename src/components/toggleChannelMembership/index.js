// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../actions/toasts';
import { track } from '../../helpers/events';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import toggleChannelSubscriptionMutation from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import type { ToggleChannelSubscriptionType } from 'shared/graphql/mutations/channel/toggleChannelSubscription';

type Props = {
  channel: {
    ...$Exact<GetChannelType>,
  },
  toggleSubscription: Function,
  dispatch: Function,
  render: Function,
  onJoin?: Function,
  onLeave?: Function,
  toggleChannelSubscription: Function,
};

type State = { isLoading: boolean };

class ToggleChannelMembership extends React.Component<Props, State> {
  state = { isLoading: false };

  init = () => {
    this.setState({
      isLoading: true,
    });

    return this.toggleSubscription();
  };

  terminate = () => {
    this.setState({
      isLoading: false,
    });
  };

  toggleSubscription = () => {
    const { channel } = this.props;

    this.setState({
      isLoading: true,
    });

    this.props
      .toggleChannelSubscription({ channelId: channel.id })
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
          track('channel', 'requested to join', null);
          str = `Requested to join ${toggleChannelSubscription.name} in ${
            toggleChannelSubscription.community.name
          }`;
        }

        if (!isPending && isMember) {
          track('channel', 'joined', null);
          str = `Joined ${toggleChannelSubscription.name} in ${
            toggleChannelSubscription.community.name
          }!`;
        }

        if (!isPending && !isMember) {
          track('channel', 'unjoined', null);
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
    return <div onClick={this.init}>{this.props.render(this.state)}</div>;
  }
}

export default compose(connect(), toggleChannelSubscriptionMutation)(
  ToggleChannelMembership
);
