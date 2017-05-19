//@flow
const { db } = require('./db');

export type DirectMessageThreadProps = {
  participants: Array<any>,
  message: Object,
};

const getDirectMessageThread = (
  directMessageThreadId: String
): Promise<Object> => {
  return db.table('directMessageThreads').get(directMessageThreadId).run();
};

const getDirectMessageThreadsByUser = (
  userId: String
): Promise<Array<Object>> => {
  return db
    .table('directMessageThreads')
    .getAll(userId, { index: 'participants' })
    .orderBy(db.desc('lastActivity'))
    .run()
    .then(result => result);
};

const createDirectMessageThread = (
  participantsIdsArray: Array<string>,
  currentUserId: Object
): Object => {
  return db
    .table('directMessageThreads')
    .insert(
      {
        creatorId: currentUserId,
        participants: [...participantsIdsArray],
        createdAt: new Date(),
        lastActivity: new Date(),
        status: participantsIdsArray.map(userId => {
          // when we are inserting the current user, we
          // can know that they are currently active and viewing the thread
          if (currentUserId === userId) {
            return {
              userId,
              lastActivity: new Date(),
              lastSeen: new Date(),
            };
          } else {
            return {
              userId,
              lastActivity: null,
              lastSeen: null,
            };
          }
        }),
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
