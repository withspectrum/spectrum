// @flow
/**
 * Getting notifications from the database
 */

const { db } = require('./db');
const { getParticipants } = require('./story');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';

const UNIQUE = (v, i, a) => a.indexOf(v) === i;

const getNotification = (id: string) => {
  return db.table('notifications').get(id).run();
};

const markNotificationsRead = (story: string) => {
  return db
    .table('notifications')
    .filter({ story })
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
  return db
    .table('stories')
    .get(data.story)
    .run()
    .then(story =>
      Promise.all([
        story,
        db.table('frequencies').get(story.frequency).run(),
        getParticipants(story.id),
      ])
    )
    .then(([story, frequency, participants]) =>
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
  getNotification,
  storeMessageNotification,
  markNotificationsRead,
  getNotificationsByUser,
  storeNotification,
};
