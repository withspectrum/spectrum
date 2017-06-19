// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { getThreadById } from '../../../api/thread';
import { displayLoadingCard } from '../../../components/loading';
import { parseNotificationDate, parseContext } from '../utils';
import Icon from '../../../components/icons';
import { ThreadProfile } from '../../../components/profile';
import {
  SegmentedNotificationCard,
  TextContent,
  SegmentedNotificationListRow,
  AttachmentsWash,
  ThreadContext,
  ContentWash,
} from '../style';

const ThreadCreatedComponent = ({ data }) => {
  return <ThreadProfile profileSize="mini" data={data} />;
};

const ThreadCreated = compose(getThreadById, displayLoadingCard, pure)(
  ThreadCreatedComponent
);

export const NewThreadNotification = ({ notification, currentUser }) => {
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);

  // determine if there are non-currentUser created threads
  const threads = notification.entities.filter(
    thread => thread.payload.creatorId !== currentUser.id
  );

  const newThreadCount = threads.length > 1
    ? `${notification.entities.length} new threads were`
    : 'A new thread was';

  if (threads && threads.length > 0) {
    return (
      <SegmentedNotificationCard>
        <ThreadContext>
          <Icon glyph="post" />
          <TextContent pointer={true}>
            {newThreadCount} published in {context.asString} {date}
          </TextContent>
        </ThreadContext>
        <ContentWash>
          <AttachmentsWash>
            {notification.entities
              .filter(thread => thread.payload.creatorId !== currentUser.id)
              .map(thread => {
                return (
                  <ThreadCreated
                    key={thread.payload.id}
                    id={thread.payload.id}
                  />
                );
              })}
          </AttachmentsWash>
        </ContentWash>
      </SegmentedNotificationCard>
    );
  } else {
    return null;
  }
};

export const MiniNewThreadNotification = ({
  notification,
  currentUser,
  history,
}) => {
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);

  // determine if there are non-currentUser created threads
  const threads = notification.entities.filter(
    thread => thread.payload.creatorId !== currentUser.id
  );

  const newThreadCount = threads.length > 1
    ? `${notification.entities.length} new threads were`
    : 'A new thread was';

  if (threads && threads.length > 0) {
    return (
      <SegmentedNotificationListRow>
        <ThreadContext>
          <Icon glyph="post-fill" />
          <TextContent pointer={false}>
            {newThreadCount} published in {context.asString} {date}
          </TextContent>
        </ThreadContext>
        <ContentWash mini>
          <AttachmentsWash>
            {notification.entities
              .filter(thread => thread.payload.creatorId !== currentUser.id)
              .map(thread => {
                return (
                  <ThreadCreated
                    key={thread.payload.id}
                    id={thread.payload.id}
                  />
                );
              })}
          </AttachmentsWash>
        </ContentWash>
      </SegmentedNotificationListRow>
    );
  } else {
    return null;
  }
};
