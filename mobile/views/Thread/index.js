// @flow
import * as React from 'react';
import { View, ScrollView, Image } from 'react-native';
import compose from 'recompose/compose';
import connect from 'react-redux';
import { Query } from 'react-apollo';
import { getThreadById } from '../../../shared/graphql/queries/thread/getThread';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';
import Text from '../../components/Text';
import ThreadContent from '../../components/ThreadContent';
import Messages from '../../components/Messages';
import ChatInput from '../../components/ChatInput';
import getThreadMessageConnection from '../../../shared/graphql/queries/thread/getThreadMessageConnection';
import { getCurrentUserQuery } from '../../../shared/graphql/queries/user/getUser';
import sendMessageMutation, {
  type SendMessageType,
} from '../../../shared/graphql/mutations/message/sendMessage';
import {
  getLinkPreviewFromUrl,
  timeDifference,
  convertTimestampToDate,
} from '../../../src/helpers/utils';

import CommunityHeader from './components/CommunityHeader';
import Byline from './components/Byline';

import type { GetThreadType } from '../../../shared/graphql/queries/thread/getThread';

import { Wrapper, ThreadMargin } from './style';

const ThreadMessages = getThreadMessageConnection(Messages);

type Props = {
  isLoading: boolean,
  hasError: boolean,
  sendMessage: Function,
  data: {
    thread?: GetThreadType,
  },
};
class Thread extends React.Component<Props> {
  sendMessage = (body: string, user: Object) => {
    const { thread } = this.props.data;
    if (!thread) return;
    this.props
      .sendMessage(
        {
          threadId: thread.id,
          threadType: 'story',
          messageType: 'text',
          content: {
            body,
          },
        },
        user
      )
      .then(() => {
        console.log('message sent successfully');
      });
  };

  render() {
    const { data, isLoading, hasError } = this.props;

    if (data.thread) {
      const createdAt = new Date(data.thread.createdAt).getTime();
      // NOTE(@mxstbr): For some reason this is necessary to make flow understand that the thread is defined
      // not sure why, but the new Date() call above breaks its inference and it thinks data.thread could be
      // undefined below
      const thread = ((data.thread: any): GetThreadType);
      return (
        <Wrapper>
          <ScrollView style={{ flex: 1, width: '100%' }} testID="e2e-thread">
            <CommunityHeader community={thread.community} />
            <ThreadMargin>
              <Byline author={thread.author} />
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
            <ThreadMessages id={thread.id} />
          </ScrollView>
          <Query query={getCurrentUserQuery}>
            {({ data: { user } }) =>
              user ? (
                <ChatInput onSubmit={text => this.sendMessage(text, user)} />
              ) : null
            }
          </Query>
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

export default compose(
  withSafeView,
  getThreadById,
  sendMessageMutation,
  ViewNetworkHandler
)(Thread);
