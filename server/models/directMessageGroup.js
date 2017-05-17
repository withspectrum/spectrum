//@flow

/**
 * Storing and retrieving directMessageGroups
 */
const { db } = require('./db');

export type DirectMessageGroupProps = {
  users: Array<any>,
  message: Object,
};

const getDirectMessageGroup = (id: String): Object => {
  return db.table('directMessageGroups').get(id).run();
};

const getDirectMessageGroupsByUser = (uid: String) => {
  return db
    .table('directMessageGroups')
    .getAll(uid, { index: 'users' })
    .orderBy(db.desc('lastActivity'))
    .run()
    .then(result => result);
};

const createDirectMessageGroup = (users, user) => {
  return db
    .table('directMessageGroups')
    .insert(
      {
        creator: user.uid,
        users: [...users],
        createdAt: new Date(),
        lastActivity: new Date(),
        status: users.map(user => {
          return {
            uid: user,
            lastActivity: null,
            lastSeen: null,
          };
        }),
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

module.exports = {
  createDirectMessageGroup,
  getDirectMessageGroup,
  getDirectMessageGroupsByUser,
};
