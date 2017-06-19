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
  const newThreadCount = notification.entities.length > 1
    ? `${notification.entities.length} new threads were`
    : 'A new thread was';

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
          {notification.entities.map(thread => {
            return (
              <ThreadCreated key={thread.payload.id} id={thread.payload.id} />
            );
          })}
        </AttachmentsWash>
      </ContentWash>
    </SegmentedNotificationCard>
  );
};

export const MiniNewThreadNotification = ({
  notification,
  currentUser,
  history,
}) => {
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const newThreadCount = notification.entities.length > 1
    ? `${notification.entities.length} new threads were`
    : 'A new thread was';

  return (
    <SegmentedNotificationListRow>
      <ThreadContext>
        <Icon glyph="post" />
        <TextContent pointer={false}>
          {newThreadCount} published in {context.asString} {date}
        </TextContent>
      </ThreadContext>
      <ContentWash mini>
        <AttachmentsWash>
          {notification.entities.map(thread => {
            return (
              <ThreadCreated key={thread.payload.id} id={thread.payload.id} />
            );
          })}
        </AttachmentsWash>
      </ContentWash>
    </SegmentedNotificationListRow>
  );
};
