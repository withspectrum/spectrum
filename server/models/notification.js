// @flow
const { db } = require('./db');
import paginate from '../utils/paginate-arrays';
const { listenToNewDocumentsIn } = require('./utils');
import type { PaginationOptions } from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';

const UNIQUE = (v, i, a) => a.indexOf(v) === i;

const getParticipants = (threadId: string): Promise<Array<string>> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .withFields('senderId')
    .run()
    .then(messages => messages.map(message => message.senderId));
};

const getNotifications = (
  notificationIds: Array<string>
): Promise<Array<Object>> => {
  return db.table('notifications').getAll(...notificationIds).run();
};

const markNotificationsRead = (threadId: string) => {
  return db
    .table('notifications')
    .getAll(threadId, { index: 'threadId' })
    .update({
      read: true,
    })
    .run();
};

type MessageNotificationInput = {
  threadId: string,
  message: string,
  senderId: string,
  content: {
    title?: string,
    excerpt?: string,
  },
};

const storeMessageNotification = (data: MessageNotificationInput) => {
  return db.table('threads').get(data.threadId).run().then(thread => {
    // if there's no thread, break out of the stack
    if (thread === null) {
      return;
    } else {
      return breakOutOfChain(data, thread);
    }
  });
};

const breakOutOfChain = (data, thread) => {
  return Promise.all([
    data,
    thread,
    db.table('channels').get(thread.channelId).run(),
    getParticipants(thread.id),
  ]).then(([data, thread, channel, participants]) =>
    storeNotification({
      ...data,
      users: participants
        .concat([thread.creatorId])
        .filter(id => id !== data.senderId)
        .filter(UNIQUE),
      type: 'NEW_MESSAGE',
      communityId: channel.communityId,
      channelId: thread.channelId,
      content: {
        ...data.content,
        title: thread.content.title,
      },
    })
  );
};

type ThreadNotificationInput = {
  threadId: string,
  channelId: string,
  senderId: string,
  content: {
    title?: string,
    excerpt?: string,
  },
};

const storeThreadNotification = (data: ThreadNotificationInput) => {
  return db.table('channels').get(data.channelId).run().then(channel =>
    storeNotification({
      ...data,
      users: channel.members.filter(id => id !== data.sender).filter(UNIQUE),
      type: 'NEW_THREAD',
      communityId: channel.communityId,
      channelId: data.channelId,
    })
  );
};

type NotificationInput = {
  users: Array<string>,
  type: 'NEW_THREAD' | 'NEW_MESSAGE' | 'REACTION',
  channelId: string,
  communityId: string,
  threadId: string,
  message?: string,
  sender: string,
  content: {
    title?: string,
    excerpt?: string,
  },
};

const storeNotification = (notification: NotificationInput) => {
  return db
    .table('notifications')
    .insert(
      Object.assign({}, notification, {
        createdAt: new Date(),
        users: notification.users.map(id => ({
          id,
          read: false,
        })),
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const getNotificationsByUser = (
  userId: string,
  { first, after }: PaginationOptions
) => {
  const cursor = decode(after);
  return (
    db
      .table('notifications')
      .getAll(userId, { index: 'userId' })
      .orderBy('createdAt')
      .distinct()
      .run()
      // TODO: Move this pagination to the query rather than fetching all notifications
      .then(notifications =>
        paginate(
          notifications,
          { first, after: cursor },
          notification => notification.id === cursor
        )
      )
      .then(result => ({
        pageInfo: {
          hasNextPage: result.hasMoreItems,
        },
        edges: result.list.map(notification => ({
          cursor: encode(notification.id),
          node: notification,
        })),
      }))
  );
};

const listenToNewNotifications = (cb: Function): Function => {
  return listenToNewDocumentsIn('messages', cb);
};

module.exports = {
  getNotifications,
  storeMessageNotification,
  markNotificationsRead,
  getNotificationsByUser,
  storeNotification,
  listenToNewNotifications,
  storeThreadNotification,
};
