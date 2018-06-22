// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import compose from 'recompose/compose';
import ChatInput from '../../components/ChatInput';
import Messages from '../../components/Messages';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../components/ViewNetworkHandler';
import Loading from '../../components/Loading';
import ErrorBoundary from '../../components/ErrorBoundary';
import { track, events } from '../../utils/analytics';
import { Wrapper } from './style';
import sentencify from '../../../shared/sentencify';
import getDirectMessageThread, {
  type GetDirectMessageThreadType,
} from '../../../shared/graphql/queries/directMessageThread/getDirectMessageThread';
import getDirectMessageThreadMessageConnection from '../../../shared/graphql/queries/directMessageThread/getDirectMessageThreadMessageConnection';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';
import sendDirectMessage from '../../../shared/graphql/mutations/message/sendDirectMessage';
import type { NavigationProps } from 'react-navigation';
import { FullscreenNullState } from '../../components/NullStates';
import { withCurrentUser } from '../../components/WithCurrentUser';
import withSafeAreaView from '../../components/SafeAreaView';

const DirectMessageThreadMessages = getDirectMessageThreadMessageConnection(
  Messages
);

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  id: string,
  sendDirectMessage: Function,
  currentUser: GetUserType,
  navigation: NavigationProps,
  data: {
    directMessageThread?: GetDirectMessageThreadType,
  },
};

class DirectMessageThread extends Component<Props> {
  messagesComponent: any;

  trackView = () => {
    const { data: { directMessageThread } } = this.props;
    if (!directMessageThread) return;
    track(events.DIRECT_MESSAGE_THREAD_VIEWED);
  };

  setTitle = () => {
    const {
      data: { directMessageThread },
      navigation,
      currentUser,
    } = this.props;
    let title = directMessageThread
      ? sentencify(
          directMessageThread.participants
            .filter(user => user.userId !== currentUser.id)
            .map(({ name }) => name)
        )
      : 'Loading thread...';
    const oldTitle = navigation.getParam('title', null);
    if (oldTitle && oldTitle === title) return;
    navigation.setParams({ title });
  };

  componentDidMount() {
    this.trackView();
    this.setTitle();
  }

  componentDidUpdate(prev) {
    const curr = this.props;
    const first =
      !prev.data.directMessageThread && curr.data.directMessageThread;
    const changed =
      prev.data.directMessageThread &&
      curr.data.directMessageThread &&
      prev.data.directMessageThread.id !== curr.data.directMessageThread.id;
    if (first || changed) {
      this.trackView();
    }

    this.setTitle();
  }

  sendMessage = text => {
    if (!this.props.data.directMessageThread) return;
    this.props.sendDirectMessage({
      threadId: this.props.data.directMessageThread.id,
      threadType: 'directMessageThread',
      messageType: 'text',
      content: {
        body: text,
      },
    });
  };

  render() {
    const {
      isLoading,
      hasError,
      data: { directMessageThread },
      navigation,
    } = this.props;

    if (directMessageThread) {
      return (
        <Wrapper>
          <ErrorBoundary alert>
            <View style={{ flex: 1 }}>
              <DirectMessageThreadMessages
                navigation={navigation}
                id={directMessageThread.id}
                inverted={true}
              />

              <ErrorBoundary>
                <ChatInput onSubmit={this.sendMessage} />
              </ErrorBoundary>
            </View>
          </ErrorBoundary>
        </Wrapper>
      );
    }

    if (isLoading) return <Loading />;
    if (hasError) return <FullscreenNullState />;

    return null;
  }
}

export default compose(
  withCurrentUser,
  sendDirectMessage,
  getDirectMessageThread,
  ViewNetworkHandler,
  withSafeAreaView
)(DirectMessageThread);
