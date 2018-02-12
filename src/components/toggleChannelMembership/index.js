// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../actions/toasts';
import { track } from '../../helpers/events';
import Link from 'src/components/link';
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
};

type State = { isLoading: boolean };

const SignupHandler = props => {
  if (!props.currentUser) {
    return (
      <Link
        to={`/login?r=spectrum.chat/${props.channel.community.slug}/${
          props.channel.slug
        }`}
      >
        {props.contents}
      </Link>
    );
  }

  return <div onClick={props.func}>{props.contents}</div>;
};

class ToggleChannelMembership extends React.Component<Props, State> {
  state = { isLoading: false };

  init = () => {
    const { channel } = this.props;

    const action = this.toggleSubscription;

    const input = { channelId: channel.id };

    this.setState({
      isLoading: true,
    });

    return action(input);
  };

  terminate = () => {
    this.setState({
      isLoading: false,
    });
  };

  toggleSubscription = (channelId: string) => {
    this.setState({
      isLoading: true,
    });

    this.props
      .toggleChannelSubscription(channelId)
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
    return (
      <SignupHandler
        func={this.init}
        currentUser={this.props.isLoggedIn}
        channel={this.props.channel}
        contents={this.props.render(this.state)}
      />
    );
  }
}

export default compose(connect(), toggleChannelSubscriptionMutation)(
  ToggleChannelMembership
);
