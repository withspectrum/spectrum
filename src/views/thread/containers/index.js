// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { toggleChannelSubscriptionMutation } from '../../../api/channel';
import { addToastWithTimeout } from '../../../actions/toasts';
import ThreadDetail from '../components/threadDetail';
import Messages from '../components/messages';
import ChatInput from '../../../components/chatInput';
import { Column } from '../../../components/column';
import AppViewWrapper from '../../../components/appViewWrapper';
import { UserProfile, ChannelProfile } from '../../../components/profile';
import { getThread } from '../queries';
import { displayLoadingScreen } from '../../../components/loading';
import { Container } from '../style';
import {
  UpsellSignIn,
  UpsellJoinChannel,
  Upsell404Thread,
} from '../../../components/upsell';

const ThreadContainerPure = ({
  data: { thread, error, loading },
  currentUser,
  dispatch,
  toggleChannelSubscription,
}) => {
  if (error) {
    return <Upsell404Thread />;
  }

  if (!thread || thread.deleted) {
    return <Upsell404Thread />;
  }

  const toggleSubscription = channelId => {
    toggleChannelSubscription({ channelId })
      .then(({ data: { toggleChannelSubscription } }) => {
        const str = toggleChannelSubscription.isMember
          ? `Joined ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}!`
          : `Left the channel ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}.`;

        const type = toggleChannelSubscription.isMember ? 'success' : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  return (
    <AppViewWrapper>
      <Column type="secondary">
        <UserProfile data={{ user: thread.creator }} />
        <ChannelProfile
          data={{ channel: thread.channel }}
          profileSize={'small'}
        />
      </Column>

      <Column type="primary">
        <Container>
          {!currentUser && <UpsellSignIn />}
          <ThreadDetail thread={thread} />
          <Messages id={thread.id} currentUser={currentUser} />
          {// if user exists, and is either the thread creator or a subscriber
          // of the channel the thread was posted in, the user can see the
          // chat input
          currentUser &&
            !thread.isLocked &&
            (thread.isCreator || thread.channel.channelPermissions.isMember) &&
            <ChatInput thread={thread.id} />}

          {// if the user exists but isn't a subscriber to the channel,
          // show an upsell to join the channel
          currentUser &&
            !thread.isLocked &&
            !thread.channel.channelPermissions.isMember &&
            <UpsellJoinChannel
              channel={thread.channel}
              subscribe={toggleSubscription}
            />}
        </Container>
      </Column>
    </AppViewWrapper>
  );
};

const ThreadContainer = compose(
  toggleChannelSubscriptionMutation,
  getThread,
  displayLoadingScreen,
  pure
)(ThreadContainerPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(ThreadContainer);
