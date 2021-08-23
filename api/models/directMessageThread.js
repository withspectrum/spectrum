//@flow
const { db } = require('shared/db');

export type DBDirectMessageThread = {
  createdAt: Date,
  id: string,
  name?: string,
  threadLastActive: Date,
};

// prettier-ignore
const getDirectMessageThread = (directMessageThreadId: string): Promise<DBDirectMessageThread> => {
  return db
    .table('directMessageThreads')
    .get(directMessageThreadId)
    .run()
    .then(res => res && !res.deletedAt ? res : null);
};

// prettier-ignore
const getDirectMessageThreads = (ids: Array<string>): Promise<Array<DBDirectMessageThread>> => {
  return db
    .table('directMessageThreads')
    .getAll(...ids)
    .filter(row => row.hasFields('deletedAt').not())
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
    .filter(row => row.hasFields('deletedAt').not())
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

module.exports = {
  getDirectMessageThread,
  getDirectMessageThreads,
  getDirectMessageThreadsByUser,
};
