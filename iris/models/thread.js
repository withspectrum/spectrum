const { db } = require('./db');
// $FlowFixMe
import { addQueue } from '../utils/workerQueue';
const { listenToNewDocumentsIn, NEW_DOCUMENTS } = require('./utils');
import { turnOffAllThreadNotifications } from '../models/usersThreads';

export const getThread = (threadId: string): Promise<Object> => {
  return db
    .table('threads')
    .get(threadId)
    .run();
};

export const getThreads = (
  threadIds: Array<string>
): Promise<Array<Object>> => {
  return db
    .table('threads')
    .getAll(...threadIds)
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};

// this is used to get all threads that need to be marked as deleted whenever a channel is deleted
export const getThreadsByChannelToDelete = channelId => {
  return db
    .table('threads')
    .getAll(channelId, { index: 'channelId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run();
};

export const getThreadsByChannel = (
  channelId: string,
  { first, after }
): Promise<Array<Object>> => {
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
  channelIds: Array<string>
): Promise<Array<Object>> => {
  return db
    .table('threads')
    .getAll(...channelIds, { index: 'channelId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .run();
};

export const getThreadsByCommunity = (
  communityId: string
): Promise<Array<Object>> => {
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

/*
  When viewing a user profile we have to take two arguments into account:
  1. The user who is being viewed
  2. The user who is doing the viewing

  We need to return only threads that meet the following criteria:
  1. The thread was posted to a public channel
  2. The thread was posted to a private channel and the viewing user is a member
*/
export const getViewableThreadsByUser = (
  evalUser: string,
  currentUser: string
): Promise<Array<Object>> => {
  return (
    db
      .table('threads')
      // get the evaluting users threads
      .getAll(evalUser, { index: 'creatorId' })
      // hide any that are deleted
      .filter(thread => db.not(thread.hasFields('deletedAt')))
      // join them with the channels table
      .eqJoin('channelId', db.table('channels'))
      // remove all the info about the community except its privacy
      .without({
        right: [
          'communityId',
          'id',
          'slug',
          'isDefault',
          'createdAt',
          'description',
          'name',
        ],
      })
      // zip the two together - result is a thread object with a channel `isPrivate` field
      .zip()
      // join these threads with the usersChannels to get the permissions of the channel
      .eqJoin('channelId', db.table('usersChannels'), { index: 'channelId' })
      // return only objects where the thread is not in a private channel or is in a channel where the current user is a member
      .filter(row =>
        row('left')('isPrivate')
          .eq(false)
          .or(row('right')('isMember').eq(true))
      )
      // filter down to only threads where the currentUser matches the criteria above
      .filter({
        right: {
          userId: currentUser,
        },
      })
      // get rid of the right side of the eqjoin
      .without('right')
      // combine the tables
      .zip()
      // return the thread object as pure without the isPrivate field from the community join earlier
      .without('isPrivate')
      .orderBy(db.desc('lastActive'), db.desc('createdAt'))
      .run()
  );
};

export const getPublicThreadsByUser = (
  evalUser: string
): Promise<Array<Object>> => {
  return (
    db
      .table('threads')
      // get the evaluting users threads
      .getAll(evalUser, { index: 'creatorId' })
      // hide any that are deleted
      .filter(thread => db.not(thread.hasFields('deletedAt')))
      // join them with the channels table
      .eqJoin('channelId', db.table('channels'))
      // remove all the info about the community except its privacy
      .without({
        right: [
          'communityId',
          'id',
          'slug',
          'isDefault',
          'createdAt',
          'description',
          'name',
        ],
      })
      // zip the two together - result is a thread object with a channel `isPrivate` field
      .zip()
      // return only objects where the thread is not in a private channel
      .filter({ isPrivate: false })
      // return the thread object as pure without the isPrivate field from the community join earlier
      .without('isPrivate')
      .orderBy(db.desc('lastActive'), db.desc('createdAt'))
      .run()
  );
};

/*
  A thread may receive a field 'filesToUpload' if it contains images. We destructure
  the incoming argument in order to ignore that field and only return the rest
  of the thread fields
*/
export const publishThread = (
  { filesToUpload, ...thread }: Object,
  userId: string
): Promise<Object> => {
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

      addQueue('thread notification', { thread, userId });
      addQueue('process reputation event', {
        userId,
        type: 'thread created',
        entityId: thread.id,
      });

      return thread;
    });
};

export const setThreadLock = (
  threadId: string,
  value: Boolean
): Promise<Object> => {
  return (
    db
      .table('threads')
      .get(threadId)
      // Note(@mxstbr): There surely is a better way to toggle a bool
      // with ReQL, I just couldn't find the API for it in a pinch
      .update(
        {
          isLocked: value,
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
      Promise.all([result, turnOffAllThreadNotifications(threadId)])
    )
    .then(([result]) => {
      const thread = result.changes[0].new_val;

      addQueue('process reputation event', {
        userId: thread.creatorId,
        type: 'thread deleted',
        entityId: thread.id,
      });

      return result.replaced >= 1 ? true : false;
    });
};

type EditThreadInput = {
  threadId: string,
  content: {
    title: string,
    body: string,
  },
  attachments: Array<Object>,
};
export const editThread = (input: EditThreadInput): Promise<Object> => {
  return db
    .table('threads')
    .get(input.threadId)
    .update(
      {
        content: input.content,
        attachments: input.attachments,
        modifiedAt: new Date(),
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
        return result.changes[0].new_val;
      }

      // an update was triggered from the client, but no data was changed
      if (result.unchanged === 1) {
        return result.changes[0].old_val;
      }
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
  db.row('old_val')(field).ne(db.row('new_val')(field));
const LAST_ACTIVE_CHANGED = hasChanged('lastActive');

export const listenToUpdatedThreads = (cb: Function): Function => {
  return db
    .table('threads')
    .changes({
      includeInitial: false,
    })
    .filter(NEW_DOCUMENTS.or(LAST_ACTIVE_CHANGED))('new_val').run(
    { cursor: true },
    (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the notification
        cb(data);
      });
    }
  );
};
