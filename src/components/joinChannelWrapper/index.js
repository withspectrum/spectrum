// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import toggleChannelSubscriptionMutation from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import { addToastWithTimeout } from 'src/actions/toasts';
import { openModal } from 'src/actions/modals';
import { withCurrentUser } from 'src/components/withCurrentUser';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';

type Props = {
  channelId: string,
  render: Function,
  children: any,
  toggleChannelSubscription: Function,
  dispatch: Dispatch<Object>,
  currentUser: ?GetUserType,
};

const JoinChannel = (props: Props) => {
  const {
    channelId,
    toggleChannelSubscription,
    currentUser,
    dispatch,
    render,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const join = () => {
    if (!currentUser || !currentUser.id) {
      return dispatch(openModal('LOGIN_MODAL'));
    }

    setIsLoading(true);

    return toggleChannelSubscription({ channelId })
      .then(({ data }: Props) => {
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

  return (
    <span style={{ display: 'flex' }} onClick={join}>
      {render({ isLoading })}
    </span>
  );
};

export default compose(
  connect(),
  toggleChannelSubscriptionMutation,
  withCurrentUser
)(JoinChannel);
