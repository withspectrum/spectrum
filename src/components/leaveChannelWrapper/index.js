// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import toggleChannelSubscriptionMutation from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import { addToastWithTimeout } from 'src/actions/toasts';

type Props = {
  channelId: string,
  render: Function,
  children: any,
  toggleChannelSubscription: Function,
  dispatch: Dispatch<Object>,
};

const LeaveChannel = (props: Props) => {
  const { channelId, toggleChannelSubscription, dispatch, render } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const leave = () => {
    const input = { channelId };

    setIsLoading(true);

    return toggleChannelSubscription({ channelId })
      .then(({ data }: Props) => {
        const { toggleChannelSubscription: channel } = data;
        dispatch(
          addToastWithTimeout('neutral', `Left the ${channel.name} channel!`)
        );

        return setIsLoading(false);
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
        return setIsLoading(false);
      });
  };

  return (
    <span style={{ display: 'flex' }} onClick={leave}>
      {render({ isLoading })}
    </span>
  );
};

export default compose(
  connect(),
  toggleChannelSubscriptionMutation
)(LeaveChannel);
