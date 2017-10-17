// @flow
import * as React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
import { toggleChannelSubscriptionMutation } from '../../api/channel';
import { addToastWithTimeout } from '../../actions/toasts';
import { track } from '../../helpers/events';
import { NullState } from './index';
import { Title, Subtitle } from './style';
import { Button } from '../buttons';

type Props = {
  channel: Object,
  community: Object,
  toggleChannelSubscription: Function,
  dispatch: Function,
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
    const { channel, dispatch, toggleChannelSubscription } = this.props;

    this.setState({
      isLoading: true,
    });

    toggleChannelSubscription({ channelId: channel.id })
      .then(({ data: { toggleChannelSubscription } }) => {
        this.setState({
          isLoading: false,
        });

        const {
          isMember,
          isPending,
        } = toggleChannelSubscription.channelPermissions;

        let str = '';
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
        dispatch(addToastWithTimeout(type, str));
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
    const { community } = this.props;
    return (
      <NullState bg={null}>
        <Title>Join the {community.name} community</Title>
        <Subtitle>
          Once you join this community you'll be able to post your replies here!
        </Subtitle>
        <Button
          loading={isLoading}
          onClick={this.toggleSubscription}
          icon="plus"
          label
        >
          Join {community.name}
        </Button>
      </NullState>
    );
  }
}

export default compose(connect(), toggleChannelSubscriptionMutation)(
  JoinChannel
);
