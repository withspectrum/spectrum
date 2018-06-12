// @flow
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import idx from 'idx';
import { getThreadById } from '../../../shared/graphql/queries/thread/getThread';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';
import Text from '../../components/Text';
import ThreadContent from '../../components/ThreadContent';
import Messages from '../../components/Messages';
import ChatInput from '../../components/ChatInput';
import getThreadMessageConnection from '../../../shared/graphql/queries/thread/getThreadMessageConnection';
import sendMessageMutation from '../../../shared/graphql/mutations/message/sendMessage';
import { convertTimestampToDate } from '../../../shared/time-formatting';
import { withCurrentUser } from '../../components/WithCurrentUser';
import CommunityHeader from './components/CommunityHeader';
import Byline from './components/Byline';
import ActionBar from './components/ActionBar';
import type { GetThreadType } from '../../../shared/graphql/queries/thread/getThread';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';
import { Wrapper, ThreadMargin } from './style';
import type { NavigationProps } from 'react-navigation';
import Loading from '../../components/Loading';
import ErrorBoundary from '../../components/ErrorBoundary';
import { FullscreenNullState } from '../../components/NullStates';
import { track, events, transformations } from '../../utils/analytics';

const ThreadMessages = getThreadMessageConnection(Messages);

type Props = {
  isLoading: boolean,
  hasError: boolean,
  sendMessage: Function,
  quotedMessage: ?string,
  currentUser: GetUserType,
  navigation: NavigationProps,
  data: {
    thread?: GetThreadType,
  },
};

class Thread extends Component<Props> {
  trackView = () => {
    const { data: { thread } } = this.props;
    if (!thread) return;
    track(events.THREAD_VIEWED, {
      thread: transformations.analyticsThread(thread),
      channel: transformations.analyticsChannel(thread.channel),
      community: transformations.analyticsCommunity(thread.community),
    });
  };

  setTitle = () => {
    const { data: { thread }, navigation } = this.props;
    let title;
    if (thread) {
      title = thread.content.title;
    } else {
      title = 'Loading thread...';
    }
    const oldTitle = idx(navigation, _ => _.state.params.title);
    if (oldTitle && oldTitle === title) return;
    navigation.setParams({ title });
  };

  componentDidMount() {
    this.trackView();
    this.setTitle();
  }

  componentDidUpdate(prev) {
    const curr = this.props;
    const first = !prev.data.thread && curr.data.thread;
    const changed =
      prev.data.thread &&
      curr.data.thread &&
      prev.data.thread.id !== curr.data.thread.id;
    if (first || changed) {
      this.trackView();
    }

    this.setTitle();
  }

  sendMessage = (body: string, user: Object) => {
    const { quotedMessage, data: { thread } } = this.props;
    if (!thread) return;
    this.props.sendMessage(
      {
        threadId: thread.id,
        threadType: 'story',
        messageType: 'text',
        parentId: quotedMessage,
        content: {
          body,
        },
      },
      user
    );
  };

  render() {
    const { data, isLoading, hasError, currentUser, navigation } = this.props;

    if (data.thread) {
      const createdAt = new Date(data.thread.createdAt).getTime();
      // NOTE(@mxstbr): For some reason this is necessary to make flow understand that the thread is defined
      // not sure why, but the new Date() call above breaks its inference and it thinks data.thread could be
      // undefined below
      const thread = ((data.thread: any): GetThreadType);
      return (
        <Wrapper>
          <ScrollView style={{ flex: 1, width: '100%' }} testID="e2e-thread">
            <ErrorBoundary fallbackComponent={null}>
              <CommunityHeader thread={thread} />
            </ErrorBoundary>

            <ThreadMargin>
              <ErrorBoundary fallbackComponent={null}>
                <Byline navigation={navigation} author={thread.author} />
              </ErrorBoundary>

              <Text bold type="title1">
                {thread.content.title}
              </Text>

              <Text color={props => props.theme.text.alt} type="subhead">
                {convertTimestampToDate(createdAt)}
              </Text>

              {thread.content.body && (
                <ThreadContent
                  rawContentState={JSON.parse(thread.content.body)}
                />
              )}
            </ThreadMargin>

            <ErrorBoundary fallbackComponent={null}>
              <ActionBar
                content={{
                  url: `https://spectrum.chat/thread/${thread.id}`,
                  message: `https://spectrum.chat/thread/${thread.id}`,
                  title: 'Look at this thread I found on Spectrum',
                }}
              />
            </ErrorBoundary>

            <ErrorBoundary>
              <ThreadMessages navigation={navigation} id={thread.id} />
            </ErrorBoundary>
          </ScrollView>

          {currentUser && (
            <ErrorBoundary>
              <ChatInput
                onSubmit={text => this.sendMessage(text, currentUser)}
              />
            </ErrorBoundary>
          )}
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }

    if (hasError) {
      return <FullscreenNullState />;
    }

    return null;
  }
}

const map = (state, ownProps): * => ({
  quotedMessage:
    ownProps.data.thread && state.message.quotedMessage
      ? state.message.quotedMessage[ownProps.data.thread.id]
      : null,
});

export default compose(
  withSafeView,
  getThreadById,
  connect(map),
  sendMessageMutation,
  withCurrentUser,
  ViewNetworkHandler
)(Thread);
