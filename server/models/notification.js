// @flow
/**
 * Getting notifications from the database
 */

const { db } = require('./db');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';

const UNIQUE = (v, i, a) => a.indexOf(v) === i;

const getParticipants = (story: string): Array<string> => {
  return db
    .table('messages')
    .getAll(story, { index: 'thread' })
    .withFields('sender')
    .run()
    .then(messages => messages.map(message => message.sender));
};

const getNotifications = (ids: Array<string>) => {
  return db.table('notifications').getAll(...ids).run();
};

const markNotificationsRead = (story: string) => {
  return db
    .table('notifications')
    .getAll(story, { index: 'story' })
    .update({
      read: true,
    })
    .run();
};

type MessageNotificationInput = {
  story: string,
  message: string,
  sender: string,
  content: {
    title?: string,
    excerpt?: string,
  },
};

const storeMessageNotification = (data: MessageNotificationInput) => {
  return db.table('stories').get(data.story).run().then(story => {
    // if there's no story, break out of the stack
    if (story === null) {
      return;
    } else {
      return breakOutOfChain(data, story);
    }
  });
};

const breakOutOfChain = (data, story) => {
  return Promise.all([
    data,
    story,
    db.table('frequencies').get(story.frequency).run(),
    getParticipants(story.id),
  ]).then(([data, story, frequency, participants]) =>
    storeNotification({
      ...data,
      users: participants
        .concat([story.author])
        .filter(uid => uid !== data.sender)
        .filter(UNIQUE),
      type: 'NEW_MESSAGE',
      community: frequency.community,
      frequency: story.frequency,
      content: {
        ...data.content,
        title: story.content.title,
      },
    })
  );
};

type StoryNotificationInput = {
  story: string,
  frequency: string,
  sender: string,
  content: {
    title?: string,
    excerpt?: string,
  },
};

const storeStoryNotification = (data: StoryNotificationInput) => {
  return db.table('frequencies').get(data.frequency).run().then(frequency =>
    storeNotification({
      ...data,
      users: frequency.subscribers
        .filter(uid => uid !== data.sender)
        .filter(UNIQUE),
      type: 'NEW_STORY',
      community: frequency.community,
      frequency: data.frequency,
    })
  );
};

type NotificationInput = {
  users: Array<string>,
  type: 'NEW_STORY' | 'NEW_MESSAGE' | 'REACTION',
  frequency: string,
  community: string,
  story: string,
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
        users: notification.users.map(uid => ({
          uid,
          read: false,
        })),
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const getNotificationsByUser = (
  uid: string,
  { first, after }: PaginationOptions
) => {
  const cursor = decode(after);
  return (
    db
      .table('notifications')
      .getAll(uid, { index: 'user' })
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

module.exports = {
  getNotifications,
  storeMessageNotification,
  markNotificationsRead,
  getNotificationsByUser,
  storeNotification,
  storeStoryNotification,
};
