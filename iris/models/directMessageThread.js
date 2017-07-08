//@flow
const { db } = require('./db');
import { NEW_DOCUMENTS } from './utils';

const getDirectMessageThread = (
  directMessageThreadId: String
): Promise<Object> => {
  return db.table('directMessageThreads').get(directMessageThreadId).run();
};

const getDirectMessageThreadsByUser = (
  userId: String
): Promise<Array<Object>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(userId, { index: 'userId' })
    .eqJoin('threadId', db.table('directMessageThreads'))
    .without({
      left: ['id', 'createdAt', 'threadId', 'userId', 'lastActive', 'lastSeen'],
    })
    .zip()
    .run();
};

const createDirectMessageThread = (isGroup: boolean): Object => {
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

const setDirectMessageThreadLastActive = (id: string): Object => {
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

module.exports = {
  createDirectMessageThread,
  getDirectMessageThread,
  getDirectMessageThreadsByUser,
  setDirectMessageThreadLastActive,
  listenToUpdatedDirectMessageThreads,
};
