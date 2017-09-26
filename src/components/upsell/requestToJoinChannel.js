// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { track } from '../../helpers/events';
import { toggleChannelSubscriptionMutation } from '../../api/channel';
import { addToastWithTimeout } from '../../actions/toasts';
import { Button, OutlineButton } from '../buttons';
import { Actions } from './style';

type Props = {
  isPending: boolean,
  community: Object,
  channel: Object,
  toggleChannelSubscription: Function,
  dispatch: Function,
};

type State = {
  isLoading: boolean,
};

class RequestToJoinChannel extends Component<Props, State> {
  state: {
    isLoading: boolean,
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
    };
  }

  toggleRequest = () => {
    const { toggleChannelSubscription, dispatch, channel } = this.props;
    const channelId = channel.id;

    this.setState({
      isLoading: true,
    });

    toggleChannelSubscription({ channelId })
      .then(({ data: { toggleChannelSubscription } }) => {
        this.setState({
          isLoading: false,
        });

        const { isPending } = toggleChannelSubscription.channelPermissions;

        if (isPending) {
          track('channel', 'requested to join', null);
        } else {
          track('channel', 'cancelled request to join', null);
        }

        const str = isPending
          ? `Requested to join ${toggleChannelSubscription.name} in ${toggleChannelSubscription
              .community.name}!`
          : `Canceled request to join ${toggleChannelSubscription.name} in ${toggleChannelSubscription
              .community.name}.`;

        const type = isPending ? 'success' : 'neutral';
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
    const { isPending, community, channel } = this.props;
    const { isLoading } = this.state;

    return (
      <Actions>
        {isPending && (
          <OutlineButton
            large
            onClick={this.toggleRequest}
            icon="minus"
            loading={isLoading}
            label
          >
            Cancel request
          </OutlineButton>
        )}

        {isPending && (
          <Link to={`/${community.slug}`}>
            <Button large>Back to {community.name}</Button>
          </Link>
        )}

        {!isPending && (
          <Button
            large
            onClick={this.toggleRequest}
            icon="private-unlocked"
            loading={isLoading}
            label
          >
            Request to join {channel.name}
          </Button>
        )}
      </Actions>
    );
  }
}

export default compose(connect(), toggleChannelSubscriptionMutation)(
  RequestToJoinChannel
);
