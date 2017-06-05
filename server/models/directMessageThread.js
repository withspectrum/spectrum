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
    .eqJoin('threadId', db.table('directMessageThreads'))
    .without({
      left: ['id', 'createdAt', 'threadId', 'userId', 'lastActive', 'lastSeen'],
    })
    .zip()
    .orderBy(db.desc('threadLastActive'))
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

const setThreadLastActive = (id: string): Object => {
  return db
    .table('directMessageThreads')
    .get(id)
    .update({
      threadLastActive: db.now(),
    })
    .run();
};

module.exports = {
  createDirectMessageThread,
  getDirectMessageThread,
  getDirectMessageThreadsByUser,
  setThreadLastActive,
};
