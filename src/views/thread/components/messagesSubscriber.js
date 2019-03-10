// @flow
import React, { useState, useEffect } from 'react';
import compose from 'recompose/compose';
import getThreadMessages from 'shared/graphql/queries/thread/getThreadMessageConnection';
import { sortAndGroupMessages } from 'shared/clients/group-messages';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ChatMessages from 'src/components/messageGroup';
import { Loading } from 'src/components/loading';
import NullMessages from './nullMessages';

const Messages = (props: Props) => {
  const { subscribeToNewMessages, data, isLoading, hasError } = props;
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    setSubscription({ subscription: subscribeToNewMessages() });
    return () => subscription && Promise.resolve(subscription());
  }, []);

  if (isLoading) return <Loading style={{ padding: '32px' }} />;

  const { thread } = data;
  if (!thread || hasError) return null;

  const { messageConnection } = thread;
  const { edges } = messageConnection;

  if (edges.length === 0) return <NullMessages />;

  const unsortedMessages = edges.map(message => message && message.node);
  const sortedMessages = sortAndGroupMessages(unsortedMessages);

  if (!sortedMessages || sortedMessages.length === 0) return <NullMessages />;

  return (
    <ChatMessages
      thread={thread}
      uniqueMessageCount={unsortedMessages.length}
      messages={sortedMessages}
      threadType={'story'}
    />
  );
};

export default compose(
  getThreadMessages,
  viewNetworkHandler
)(Messages);
