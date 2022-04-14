// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { addToastWithTimeout } from 'src/actions/toasts';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import toggleChannelNotificationsMutation, {
  type ToggleChannelNotificationsType,
} from 'shared/graphql/mutations/channel/toggleChannelNotifications';
import type { Dispatch } from 'redux';

type Props = {
  channel: {
    ...$Exact<GetChannelType>,
  },
  toggleChannelNotifications: Function,
  dispatch: Dispatch<Object>,
  render: Function,
};

type State = { isLoading: boolean };

class ToggleChannelNotifications extends React.Component<Props, State> {
  state = { isLoading: false };

  init = e => {
    e && e.preventDefault() && e.stopPropogation();

    this.setState({
      isLoading: true,
    });

    return this.toggleNotifications();
  };

  terminate = () => {
    this.setState({
      isLoading: false,
    });
  };

  toggleNotifications = () => {
    const { channel } = this.props;

    this.setState({
      isLoading: true,
    });

    this.props
      .toggleChannelNotifications(channel.id)
      .then(({ data }: ToggleChannelNotificationsType) => {
        this.setState({
          isLoading: false,
        });

        const { toggleChannelNotifications } = data;

        const value =
          toggleChannelNotifications.channelPermissions.receiveNotifications;
        const type = value ? 'success' : 'neutral';
        const str = value
          ? 'Channel notifications enabled!'
          : 'Channel notifications disabled.';
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
    const { channel } = this.props;
    const { channelPermissions } = channel;
    const { receiveNotifications } = channelPermissions;

    return (
      <div
        data-cy={
          receiveNotifications
            ? 'channel-notifications-enabled'
            : 'channel-notifications-muted'
        }
        onClick={this.init}
      >
        {this.props.render(this.state)}
      </div>
    );
  }
}

export default compose(
  connect(),
  toggleChannelNotificationsMutation
)(ToggleChannelNotifications);
