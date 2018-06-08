// @flow
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { getThreadById } from '../../../shared/graphql/queries/thread/getThread';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';
import Text from '../../components/Text';
import ThreadContent from '../../components/ThreadContent';
import Messages from '../../components/Messages';
import ChatInput from '../../components/ChatInput';
import getThreadMessageConnection from '../../../shared/graphql/queries/thread/getThreadMessageConnection';
import sendMessageMutation from '../../../shared/graphql/mutations/message/sendMessage';
import { convertTimestampToDate } from '../../../src/helpers/utils';
import { withCurrentUser } from '../../components/WithCurrentUser';
import CommunityHeader from './components/CommunityHeader';
import Byline from './components/Byline';
import ActionBar from './components/ActionBar';
import type { GetThreadType } from '../../../shared/graphql/queries/thread/getThread';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';
import { Wrapper, ThreadMargin } from './style';
import type { NavigationProps } from 'react-navigation';

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
            <CommunityHeader thread={thread} />
            <ThreadMargin>
              <Byline navigation={navigation} author={thread.author} />
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
            <ActionBar
              content={{
                url: `https://spectrum.chat/thread/${thread.id}`,
                message: `https://spectrum.chat/thread/${thread.id}`,
                title: 'Look at this thread I found on Spectrum',
              }}
            />
            <ThreadMessages navigation={navigation} id={thread.id} />
          </ScrollView>

          {currentUser && (
            <ChatInput onSubmit={text => this.sendMessage(text, currentUser)} />
          )}
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <View testID="e2e-thread">
            <Text type="body">Loading...</Text>
          </View>
        </Wrapper>
      );
    }

    if (hasError) {
      return (
        <Wrapper>
          <View testID="e2e-thread">
            <Text type="body">Error!</Text>
          </View>
        </Wrapper>
      );
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
