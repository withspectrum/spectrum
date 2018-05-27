// @flow
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import Sentry from 'sentry-expo';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { getThreadById } from '../../../shared/graphql/queries/thread/getThread';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';
import Text from '../../components/Text';
import ThreadContent from '../../components/ThreadContent';
import Messages from '../../components/Messages';
import ChatInput from '../../components/ChatInput';
import Loading from '../../components/Loading';
import getThreadMessageConnection from '../../../shared/graphql/queries/thread/getThreadMessageConnection';
import { convertTimestampToDate } from '../../../src/helpers/utils';
import { withCurrentUser } from '../../components/WithCurrentUser';
import CommunityHeader from './components/CommunityHeader';
import Byline from './components/Byline';
import ActionBar from './components/ActionBar';
import sendMessageMutation, {
  type SendMessageMutationFunc,
} from '../../../shared/graphql/mutations/message/sendMessage';
import type { GetThreadType } from '../../../shared/graphql/queries/thread/getThread';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';
import { Wrapper, ThreadMargin } from './style';
import type { ReduxState } from '../../reducers';

const ThreadMessages = getThreadMessageConnection(Messages);

type StateProps = {|
  quotedMessage: ?string,
|};

type OwnProps = {
  ...$Exact<ViewNetworkHandlerProps>,
  sendMessage: SendMessageMutationFunc,
  currentUser: GetUserType,
  data: {
    thread: ?GetThreadType,
  },
};

type Props = StateProps & OwnProps;

class Thread extends Component<Props> {
  sendMessage = (body: string, user: GetUserType) => {
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
    const { data, isLoading, hasError, currentUser } = this.props;

    if (isLoading) return <Loading />;

    if (hasError) {
      return (
        <Wrapper>
          <View testID="e2e-thread">
            <Text type="body">Error!</Text>
          </View>
        </Wrapper>
      );
    }

    if (data.thread) {
      const thread: GetThreadType = data.thread;
      const createdAt = new Date(thread.createdAt).getTime();

      return (
        <Wrapper>
          <ScrollView style={{ flex: 1, width: '100%' }} testID="e2e-thread">
            <CommunityHeader thread={thread} />
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
            <ActionBar
              content={{
                url: `https://spectrum.chat/thread/${thread.id}`,
                message: `https://spectrum.chat/thread/${thread.id}`,
                title: 'Look at this thread I found on Spectrum',
              }}
            />
            <ThreadMessages id={thread.id} />
          </ScrollView>

          {currentUser && (
            <ChatInput onSubmit={text => this.sendMessage(text, currentUser)} />
          )}
        </Wrapper>
      );
    }

    return null;
  }
}

const map = (state: ReduxState, ownProps: OwnProps): StateProps => ({
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
