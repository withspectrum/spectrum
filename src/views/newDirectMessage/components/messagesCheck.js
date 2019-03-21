// @flow
import React from 'react';
import compose from 'recompose/compose';
import getDirectMessageThreadByUserIds, {
  type GetDirectMessageThreadByUserIdsType,
} from 'shared/graphql/queries/directMessageThread/getDirectMessageThreadByUserIds';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import MessagesSubscriber from './messagesSubscriber';
import { LoadingMessagesWrapper, NullMessagesWrapper } from '../style';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    directMessageThreadByUserIds: GetDirectMessageThreadByUserIdsType,
  },
  onExistingThreadId: Function,
};

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
