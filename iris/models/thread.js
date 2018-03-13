// @flow
const { db } = require('./db');
import intersection from 'lodash.intersection';
import {
  processReputationEventQueue,
  sendThreadNotificationQueue,
  _adminProcessToxicThreadQueue,
} from 'shared/bull/queues';
const { NEW_DOCUMENTS, parseRange, eachAsyncNewValue } = require('./utils');
import { deleteMessagesInThread } from '../models/message';
import { turnOffAllThreadNotifications } from '../models/usersThreads';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { DBThread } from 'shared/types';

export const getThread = (threadId: string): Promise<DBThread> => {
  return db
    .table('threads')
    .get(threadId)
    .run();
};

export const getThreads = (
  threadIds: Array<string>
): Promise<Array<DBThread>> => {
  return db
    .table('threads')
    .getAll(...threadIds)
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};

// this is used to get all threads that need to be marked as deleted whenever a channel is deleted
export const getThreadsByChannelToDelete = (channelId: string) => {
  return db
    .table('threads')
    .getAll(channelId, { index: 'channelId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};

export const getThreadsByChannel = (
  channelId: string,
  { first, after }: PaginationOptions
): Promise<Array<DBThread>> => {
  return db
    .table('threads')
    .between(
      [channelId, db.minval],
      [channelId, after ? new Date(after) : db.maxval],
      {
        index: 'channelIdAndLastActive',
        leftBound: 'open',
        rightBound: 'open',
      }
    )
    .orderBy({ index: db.desc('channelIdAndLastActive') })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .limit(first)
    .run();
};

export const getThreadsByChannels = (
  channelIds: Array<string>,
  { first, after }: PaginationOptions
): Promise<Array<DBThread>> => {
  return db
    .table('threads')
    .getAll(...channelIds, { index: 'channelId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first || 999999)
    .run();
};

export const getThreadsByCommunity = (
  communityId: string
): Promise<Array<DBThread>> => {
  return db
    .table('threads')
    .between([communityId, db.minval], [communityId, db.maxval], {
      index: 'communityIdAndLastActive',
      leftBound: 'open',
      rightBound: 'open',
    })
    .orderBy({ index: db.desc('communityIdAndLastActive') })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};

export const getThreadsByCommunityInTimeframe = (
  communityId: string,
  range: string
): Promise<Array<Object>> => {
  const { current } = parseRange(range);
  return db
    .table('threads')
    .getAll(communityId, { index: 'communityId' })
    .filter(db.row('createdAt').during(db.now().sub(current), db.now()))
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};

export const getThreadsInTimeframe = (
  range: string
): Promise<Array<Object>> => {
  const { current } = parseRange(range);
  return db
    .table('threads')
    .filter(db.row('createdAt').during(db.now().sub(current), db.now()))
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};

/*
  When viewing a user profile we have to take two arguments into account:
  1. The user who is being viewed
  2. The user who is doing the viewing

  We need to return only threads that meet the following criteria:
  1. The thread was posted to a public channel
  2. The thread was posted to a private channel and the viewing user is a member
*/
export const getViewableThreadsByUser = async (
  evalUser: string,
  currentUser: string,
  { first, after }: PaginationOptions
): Promise<Array<DBThread>> => {
  // get a list of the channelIds the current user is allowed to see threads
  const getCurrentUsersChannelIds = db
    .table('usersChannels')
    .getAll(currentUser, { index: 'userId' })
    .filter({ isBlocked: false })
    .map(userChannel => userChannel('channelId'))
    .run();

  // get a list of the channels where the user posted a thread
  const getPublishedChannelIds = db
    .table('threads')
    .getAll(evalUser, { index: 'creatorId' })
    .map(thread => thread('channelId'))
    .run();

  const [currentUsersChannelIds, publishedChannelIds] = await Promise.all([
    getCurrentUsersChannelIds,
    getPublishedChannelIds,
  ]);

  // get a list of all the channels that are public
  const publicChannelIds = await db
    .table('channels')
    .getAll(...publishedChannelIds)
    .filter({ isPrivate: false })
    .map(channel => channel('id'))
    .run();

  const allIds = [...currentUsersChannelIds, ...publicChannelIds];
  const distinctIds = allIds.filter((x, i, a) => a.indexOf(x) == i);
  const validIds = intersection(distinctIds, publishedChannelIds);

  // takes ~70ms for a heavy load
  return await db
    .table('threads')
    .getAll(evalUser, { index: 'creatorId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .filter(thread => db.expr(validIds).contains(thread('channelId')))
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first)
    .run()
    .then(res => {
      return res;
    });
};

export const getPublicThreadsByUser = (
  evalUser: string,
  { first, after }: PaginationOptions
): Promise<Array<DBThread>> => {
  return db
    .table('threads')
    .getAll(evalUser, { index: 'creatorId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .eqJoin('channelId', db.table('channels'))
    .filter({ right: { isPrivate: false } })
    .without('right')
    .zip()
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first || 10)
    .run();
};

export const getViewableParticipantThreadsByUser = async (
  evalUser: string,
  currentUser: string,
  { first, after }: PaginationOptions
): Promise<Array<DBThread>> => {
  // get a list of the channelIds the current user is allowed to see threads for
  const getCurrentUsersChannelIds = db
    .table('usersChannels')
    .getAll(currentUser, { index: 'userId' })
    .filter({ isBlocked: false })
    .map(userChannel => userChannel('channelId'))
    .run();

  // get a list of the channels where the user participated in a thread
  const getParticipantChannelIds = db
    .table('usersThreads')
    .getAll(evalUser, { index: 'userId' })
    .filter({ isParticipant: true })
    .eqJoin('threadId', db.table('threads'))
    .zip()
    .pluck('channelId', 'threadId')
    .run();

  const [currentUsersChannelIds, participantChannelIds] = await Promise.all([
    getCurrentUsersChannelIds,
    getParticipantChannelIds,
  ]);

  const participantThreadIds = participantChannelIds.map(c => c.threadId);
  const distinctParticipantChannelIds = participantChannelIds
    .map(c => c.channelId)
    .filter((x, i, a) => a.indexOf(x) == i);

  // get a list of all the channels that are public
  const publicChannelIds = await db
    .table('channels')
    .getAll(...distinctParticipantChannelIds)
    .filter({ isPrivate: false })
    .map(channel => channel('id'))
    .run();

  const allIds = [...currentUsersChannelIds, ...publicChannelIds];
  const distinctIds = allIds.filter((x, i, a) => a.indexOf(x) == i);
  const validIds = intersection(distinctIds, distinctParticipantChannelIds);

  return await db
    .table('threads')
    .getAll(...participantThreadIds)
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .filter(thread => db.expr(validIds).contains(thread('channelId')))
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first)
    .run()
    .then(res => {
      return res;
    });
};

export const getPublicParticipantThreadsByUser = (
  evalUser: string,
  { first, after }: PaginationOptions
): Promise<Array<DBThread>> => {
  return db
    .table('usersThreads')
    .getAll(evalUser, { index: 'userId' })
    .eqJoin('threadId', db.table('threads'))
    .without({
      left: [
        'id',
        'userId',
        'threadId',
        'createdAt',
        'isParticipant',
        'receiveNotifications',
      ],
    })
    .zip()
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .eqJoin('channelId', db.table('channels'))
    .filter({ right: { isPrivate: false } })
    .without('right')
    .zip()
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first || 10)
    .run()
    .then(res => {
      return res;
    });
};

/*
  A thread may receive a field 'filesToUpload' if it contains images. We destructure
  the incoming argument in order to ignore that field and only return the rest
  of the thread fields
*/
export const publishThread = (
  // eslint-disable-next-line
  { filesToUpload, ...thread }: Object,
  userId: string
): Promise<DBThread> => {
  return db
    .table('threads')
    .insert(
      Object.assign({}, thread, {
        creatorId: userId,
        createdAt: new Date(),
        lastActive: new Date(),
        modifiedAt: null,
        isPublished: true,
        isLocked: false,
        edits: [],
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => {
      const thread = result.changes[0].new_val;
      sendThreadNotificationQueue.add({ thread });
      processReputationEventQueue.add({
        userId,
        type: 'thread created',
        entityId: thread.id,
      });
      _adminProcessToxicThreadQueue.add({ thread });

      return thread;
    });
};

export const setThreadLock = (
  threadId: string,
  value: boolean,
  userId: string
): Promise<DBThread> => {
  return (
    db
      .table('threads')
      .get(threadId)
      // Note(@mxstbr): There surely is a better way to toggle a bool
      // with ReQL, I just couldn't find the API for it in a pinch
      .update(
        {
          isLocked: value,
          lockedBy: value === true ? userId : db.literal(),
          lockedAt: value === true ? new Date() : db.literal(),
        },
        { returnChanges: true }
      )
      .run()
      .then(
        result =>
          result.changes.length > 0
            ? result.changes[0].new_val
            : db
                .table('threads')
                .get(threadId)
                .run()
      )
  );
};

export const setThreadLastActive = (threadId: string, value: Date) =>
  db
    .table('threads')
    .get(threadId)
    .update({ lastActive: value })
    .run();

/*
  Non-destructively delete a thread by setting the `deletedAt` field to a date.
  After a thread is deleted, set `receiveNotifications` to false for all users who were participants or had subscribed to notifications.
*/
export const deleteThread = (threadId: string): Promise<Boolean> => {
  return db
    .table('threads')
    .get(threadId)
    .update(
      {
        deletedAt: new Date(),
      },
      {
        returnChanges: true,
        nonAtomic: true,
      }
    )
    .run()
    .then(result =>
      Promise.all([
        result,
        turnOffAllThreadNotifications(threadId),
        deleteMessagesInThread(threadId),
      ])
    )
    .then(([result]) => {
      const thread = result.changes[0].new_val;

      processReputationEventQueue.add({
        userId: thread.creatorId,
        type: 'thread deleted',
        entityId: thread.id,
      });

      return result.replaced >= 1 ? true : false;
    });
};

type File = {
  name: string,
  type: string,
  size: number,
  path: string,
};

type Attachment = {
  attachmentType: string,
  data: string,
};

export type EditThreadInput = {
  threadId: string,
  content: {
    title: string,
    body: ?string,
  },
  attachments?: ?Array<Attachment>,
  filesToUpload?: ?Array<File>,
};
// shouldUpdate arguemnt is used to prevent a thread from being marked as edited when the images are uploaded at publish time
export const editThread = (
  input: EditThreadInput,
  shouldUpdate: boolean = true
): Promise<DBThread> => {
  return db
    .table('threads')
    .get(input.threadId)
    .update(
      {
        content: input.content,
        attachments: input.attachments,
        modifiedAt: shouldUpdate ? new Date() : null,
        edits: db.row('edits').append({
          content: db.row('content'),
          attachments: db.row('attachments'),
          timestamp: new Date(),
        }),
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      // if an update happened
      if (result.replaced === 1) {
        const thread = result.changes[0].new_val;
        return thread;
      }

      // an update was triggered from the client, but no data was changed
      return result.changes[0].old_val;
    });
};

export const updateThreadWithImages = (id: string, body: string) => {
  return db
    .table('threads')
    .get(id)
    .update(
      {
        content: {
          body,
        },
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      // if an update happened
      if (result.replaced === 1) {
        return result.changes[0].new_val;
      }

      // no data was changed
      if (result.unchanged === 1) {
        return result.changes[0].old_val;
      }

      return null;
    });
};

export const moveThread = (id: string, channelId: string) => {
  return db
    .table('threads')
    .get(id)
    .update(
      {
        channelId,
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      if (result.replaced === 1) return result.changes[0].new_val;
      return null;
    });
};

const hasChanged = (field: string) =>
  db
    .row('old_val')(field)
    .ne(db.row('new_val')(field));
const LAST_ACTIVE_CHANGED = hasChanged('lastActive');

export const listenToUpdatedThreads = (cb: Function): Function => {
  return db
    .table('threads')
    .changes({
      includeInitial: false,
    })
    .filter(NEW_DOCUMENTS.or(LAST_ACTIVE_CHANGED))('new_val')
    .run(eachAsyncNewValue(cb));
};
