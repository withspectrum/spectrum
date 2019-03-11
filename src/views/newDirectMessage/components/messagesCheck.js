// @flow
import React from 'react';
import compose from 'recompose/compose';
import getDirectMessageThreadByUserIds from 'shared/graphql/queries/directMessageThread/getDirectMessageThreadByUserIds';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { withCurrentUser } from 'src/components/withCurrentUser';
import MessagesSubscriber from './messagesSubscriber';

const MessagesCheck = (props: Props) => {
  const { data, currentUser } = props;
  const { directMessageThreadByUserIds: thread } = data;
  if (!thread) return null;
  return (
    <MessagesSubscriber
      id={thread.id}
      currentUser={currentUser}
      thread={thread}
    />
  );
};

export default compose(
  getDirectMessageThreadByUserIds,
  viewNetworkHandler,
  withCurrentUser
)(MessagesCheck);
