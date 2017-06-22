// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { getThreadById } from '../../../api/thread';
import { sortByDate } from '../../../helpers/utils';
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

const sortThreads = (entities, currentUser) => {
  // filter out the current user's threads
  let threads = entities.filter(
    thread => thread.payload.creatorId !== currentUser.id
  );

  // create an array of payloads
  threads = threads && threads.map(thread => thread.payload);

  // sort the threads by created at date
  threads = threads && sortByDate(threads, 'createdAt', 'desc');

  return threads;
};

const ThreadCreatedComponent = ({ data }) => {
  return <ThreadProfile profileSize="mini" data={data} />;
};

const ThreadCreated = compose(getThreadById, displayLoadingCard, pure)(
  ThreadCreatedComponent
);

export const NewThreadNotification = ({ notification, currentUser }) => {
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);

  // sort and order the threads
  const threads = sortThreads(notification.entities, currentUser);

  const newThreadCount = threads.length > 1
    ? `New threads were`
    : 'A new thread was';

  if (threads && threads.length > 0) {
    return (
      <SegmentedNotificationCard>
        <ThreadContext>
          <Icon glyph="post-fill" />
          <TextContent pointer={true}>
            {newThreadCount} published in {context.asString} {date}
          </TextContent>
        </ThreadContext>
        <ContentWash>
          <AttachmentsWash>
            {threads.map(thread => {
              return <ThreadCreated key={thread.id} id={thread.id} />;
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

  // sort and order the threads
  const threads = sortThreads(notification.entities, currentUser);

  const newThreadCount = threads.length > 1
    ? `New threads were`
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
            {threads.map(thread => {
              return <ThreadCreated key={thread.id} id={thread.id} />;
            })}
          </AttachmentsWash>
        </ContentWash>
      </SegmentedNotificationListRow>
    );
  } else {
    return null;
  }
};
