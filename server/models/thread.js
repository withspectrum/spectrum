// @flow
const { db } = require('./db');
const { listenToNewDocumentsIn } = require('./utils');
const { storeThreadNotification } = require('./notification');

const getThreads = (threadIds: Array<string>): Promise<Array<Object>> => {
  return db
    .table('threads')
    .getAll(...threadIds)
    .filter(thread => db.not(thread.hasFields('isDeleted')))
    .run();
};

const getThreadsByChannel = (channelId: string): Promise<Array<Object>> => {
  return db
    .table('threads')
    .getAll(channelId, { index: 'channelId' })
    .filter(thread => db.not(thread.hasFields('isDeleted')))
    .orderBy(db.desc('createdAt'))
    .run();
};

const getThreadsByCommunity = (communityId: string): Promise<Array<Object>> => {
  return db
    .table('threads')
    .getAll(communityId, { index: 'communityId' })
    .filter(thread => db.not(thread.hasFields('isDeleted')))
    .orderBy(db.desc('createdAt'))
    .run();
};

const getThreadsByUser = (userId: string): Promise<Array<Object>> => {
  return db
    .table('threads')
    .getAll(userId, { index: 'creatorId' })
    .filter(thread => db.not(thread.hasFields('isDeleted')))
    .orderBy(db.desc('createdAt'))
    .run();
};

const publishThread = (thread: Object, userId: string): Promise<Object> => {
  return db
    .table('threads')
    .insert(
      Object.assign({}, thread, {
        creatorId: userId,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isPublished: true,
        isLocked: false,
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(thread => {
      storeThreadNotification({
        threadId: thread.id,
        channelId: thread.channelId,
        senderId: thread.creatorId,
        content: {
          title: thread.content.title,
          // TODO Limit to max characters
          excerpt: thread.content.body,
        },
      });
      return thread;
    });
};

const setThreadLock = (threadId: string, value: Boolean): Promise<Object> => {
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
            : db.table('threads').get(threadId).run()
      )
  );
};

const deleteThread = (threadId: string): Promise<Boolean> => {
  return db
    .table('threads')
    .get(threadId)
    .update(
      {
        isDeleted: true,
      },
      {
        returnChanges: true,
        nonAtomic: true,
      }
    )
    .run()
    .then(result => {
      // update was successful
      return result.replaced >= 1 ? true : false;
    });
};

const editThread = (threadId: string, newContent: Object): Promise<Object> => {
  return db
    .table('threads')
    .get(threadId)
    .update(
      {
        content: newContent,
        modifiedAt: new Date(),
        edits: db.row('edits').append({
          content: newContent,
          timestamp: new Date(),
        }),
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const listenToNewThreads = (cb: Function): Function => {
  return listenToNewDocumentsIn('threads', cb);
};

module.exports = {
  getThreads,
  publishThread,
  editThread,
  setThreadLock,
  deleteThread,
  listenToNewThreads,
  getThreadsByChannel,
  getThreadsByCommunity,
  getThreadsByUser,
};
