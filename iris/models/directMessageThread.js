//@flow
const { db } = require('./db');
import { NEW_DOCUMENTS } from './utils';

export type DBDirectMessageThread = {
  createdAt: Date,
  id: string,
  name?: string,
  threadLastActive: Date,
};

const getDirectMessageThread = (
  directMessageThreadId: string
): Promise<DBDirectMessageThread> => {
  return db
    .table('directMessageThreads')
    .get(directMessageThreadId)
    .run();
};

const getDirectMessageThreads = (
  ids: Array<string>
): Promise<Array<DBDirectMessageThread>> => {
  return db
    .table('directMessageThreads')
    .getAll(...ids)
    .run();
};

const getDirectMessageThreadsByUser = (
  userId: string,
  // $FlowFixMe
  { first, after }
): Promise<Array<DBDirectMessageThread>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(userId, { index: 'userId' })
    .eqJoin('threadId', db.table('directMessageThreads'))
    .without({
      left: ['id', 'createdAt', 'threadId', 'userId', 'lastActive', 'lastSeen'],
    })
    .zip()
    .orderBy(db.desc('threadLastActive'))
    .skip(after || 0)
    .limit(first)
    .run();
};

const createDirectMessageThread = (isGroup: boolean): DBDirectMessageThread => {
  return db
    .table('directMessageThreads')
    .insert(
      {
        createdAt: new Date(),
        name: null,
        isGroup,
        threadLastActive: new Date(),
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

const setDirectMessageThreadLastActive = (
  id: string
): DBDirectMessageThread => {
  return db
    .table('directMessageThreads')
    .get(id)
    .update({
      threadLastActive: db.now(),
    })
    .run();
};

const hasChanged = (field: string) =>
  db.row('old_val')(field).ne(db.row('new_val')(field));
const THREAD_LAST_ACTIVE_CHANGED = hasChanged('threadLastActive');

const listenToUpdatedDirectMessageThreads = (cb: Function): Function => {
  return db
    .table('directMessageThreads')
    .changes({
      includeInitial: false,
    })
    .filter(NEW_DOCUMENTS.or(THREAD_LAST_ACTIVE_CHANGED))('new_val')
    .eqJoin('id', db.table('usersDirectMessageThreads'), { index: 'threadId' })
    .without({
      right: ['id', 'createdAt', 'threadId', 'lastActive', 'lastSeen'],
    })
    .zip()
    .run({ cursor: true }, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the notification
        cb(data);
      });
    });
};

const checkForExistingDMThread = (
  participants: Array<string>
): Promise<Array<any>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(...participants, { index: 'userId' })
    .group('threadId')
    .map(row => row('userId'))
    .ungroup()
    .filter(row =>
      row('reduction')
        .count()
        .eq(participants.length)
    )
    .pluck('group')
    .run();
};

module.exports = {
  createDirectMessageThread,
  getDirectMessageThread,
  getDirectMessageThreads,
  getDirectMessageThreadsByUser,
  setDirectMessageThreadLastActive,
  listenToUpdatedDirectMessageThreads,
  checkForExistingDMThread,
};
