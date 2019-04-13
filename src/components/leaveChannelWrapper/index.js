// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import toggleChannelSubscriptionMutation, {
  type ToggleChannelSubscriptionType,
} from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import { addToastWithTimeout } from 'src/actions/toasts';

type Props = {
  channel: ChannelInfoType,
  render: Function,
  children: any,
  toggleChannelSubscription: Function,
  dispatch: Dispatch<Object>,
};

const LeaveChannel = (props: Props) => {
  const { channel, toggleChannelSubscription, dispatch, render } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const [isHovering, setHover] = React.useState(false);

  const onMouseEnter = () => setHover(true);
  const onMouseLeave = () => setHover(false);

  const leave = (e: any) => {
    e && e.preventDefault() && e.stopPropogation();

    setIsLoading(true);

    return toggleChannelSubscription({ channelId: channel.id })
      .then(({ data }: ToggleChannelSubscriptionType) => {
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
    <span
      data-cy="channel-leave-button"
      style={{ display: 'flex' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={leave}
    >
      {render({ isLoading, isHovering })}
    </span>
  );
};

export default compose(
  connect(),
  toggleChannelSubscriptionMutation
)(LeaveChannel);
