// @flow
import * as React from 'react';
import { View, ScrollView } from 'react-native';
import compose from 'recompose/compose';
import connect from 'react-redux';
import { getThreadById } from '../../../shared/graphql/queries/thread/getThread';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';
import Text from '../../components/Text';
import ThreadContent from '../../components/ThreadContent';
import Messages from '../../components/Messages';
import ChatInput from '../../components/ChatInput';
import getThreadMessageConnection from '../../../shared/graphql/queries/thread/getThreadMessageConnection';
import sendMessageMutation, {
  type SendMessageType,
} from '../../../shared/graphql/mutations/message/sendMessage';
import type { GetThreadType } from '../../../shared/graphql/queries/thread/getThread';

import { Wrapper } from './style';

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
  sendMessage = (body: string) => {
    const { thread } = this.props.data;
    if (!thread) return;
    this.props
      .sendMessage({
        threadId: thread.id,
        threadType: 'story',
        messageType: 'text',
        // TODO(@mxstbr): Pass current user here
        user: {},
        content: {
          body,
        },
      })
      .then(() => {
        console.log('message sent successfully');
      });
  };

  render() {
    const { data, isLoading, hasError } = this.props;

    if (data.thread) {
      return (
        <Wrapper>
          <ScrollView style={{ flex: 1 }} testID="e2e-thread">
            <Text type="title1">
              {data.thread.content.title} by {data.thread.author.user.name}
            </Text>
            {data.thread.content.body && (
              <ThreadContent
                rawContentState={JSON.parse(data.thread.content.body)}
              />
            )}
            <ThreadMessages id={data.thread.id} />
            <ChatInput onSubmit={this.sendMessage} />
          </ScrollView>
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
