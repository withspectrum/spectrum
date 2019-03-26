// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import toggleChannelSubscriptionMutation, {
  type ToggleChannelSubscriptionType,
} from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import { addToastWithTimeout } from 'src/actions/toasts';
import { openModal } from 'src/actions/modals';
import { withCurrentUser } from 'src/components/withCurrentUser';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';

type Props = {
  channel: ChannelInfoType,
  render: Function,
  children: any,
  toggleChannelSubscription: Function,
  dispatch: Dispatch<Object>,
  currentUser: ?GetUserType,
};

const JoinChannel = (props: Props) => {
  const {
    channel,
    toggleChannelSubscription,
    currentUser,
    dispatch,
    render,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const join = (e: any) => {
    e && e.preventDefault() && e.stopPropogation();

    if (!currentUser || !currentUser.id) {
      return dispatch(openModal('LOGIN_MODAL'));
    }

    setIsLoading(true);

    return toggleChannelSubscription({ channelId: channel.id })
      .then(({ data }: ToggleChannelSubscriptionType) => {
        const { toggleChannelSubscription: channel } = data;
        dispatch(
          addToastWithTimeout('success', `Joined the ${channel.name} channel!`)
        );

        return setIsLoading(false);
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
        return setIsLoading(false);
      });
  };

  const { channelPermissions } = channel;
  const { isMember } = channelPermissions;
  const cy = currentUser
    ? isMember
      ? null
      : 'channel-join-button'
    : 'channel-login-join-button';

  return (
    <span data-cy={cy} style={{ display: 'flex' }} onClick={join}>
      {render({ isLoading })}
    </span>
  );
};

export default compose(
  connect(),
  toggleChannelSubscriptionMutation,
  withCurrentUser
)(JoinChannel);
