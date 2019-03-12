// @flow
import React from 'react';
import compose from 'recompose/compose';
import getDirectMessageThreadByUserIds from 'shared/graphql/queries/directMessageThread/getDirectMessageThreadByUserIds';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import MessagesSubscriber from './messagesSubscriber';
import { LoadingMessagesWrapper, NullMessagesWrapper } from '../style';

const MessagesCheck = (props: Props) => {
  const { data, isLoading, hasError, onExistingThreadId } = props;

  const { directMessageThreadByUserIds: thread } = data;

  if (isLoading) return <LoadingMessagesWrapper />;

  if (!thread || hasError) return <NullMessagesWrapper />;

  if (thread && thread.id) {
    onExistingThreadId(thread.id);
  }

  return <MessagesSubscriber id={thread.id} />;
};

export default compose(
  getDirectMessageThreadByUserIds,
  viewNetworkHandler
)(MessagesCheck);
