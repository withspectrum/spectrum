//@flow
const { db } = require('./db');

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
    .orderBy(db.desc('lastActive'))
    .filter({ isBlocked: false })
    .eqJoin('threadId', db.table('directMessageThreads'))
    .without({ left: ['id', 'createdAt', 'threadId', 'userId'] })
    .zip()
    .run();
};

const createDirectMessageThread = (): Object => {
  return db
    .table('directMessageThreads')
    .insert(
      {
        createdAt: new Date(),
        name: null,
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

module.exports = {
  createDirectMessageThread,
  getDirectMessageThread,
  getDirectMessageThreadsByUser,
};
