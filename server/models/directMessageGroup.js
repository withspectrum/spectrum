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

const createDirectMessageGroup = (
  usersArray: Array<string>,
  currentUser: Object
) => {
  return db
    .table('directMessageGroups')
    .insert(
      {
        creator: currentUser.uid,
        users: [...usersArray],
        createdAt: new Date(),
        lastActivity: new Date(),
        status: usersArray.map(user => {
          // when we are inserting the current user, we
          // can know that they are currently active and viewing the thread
          if (currentUser.uid === user) {
            return {
              uid: user,
              lastActivity: new Date(),
              lastSeen: new Date(),
            };
          } else {
            return {
              uid: user,
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
  createDirectMessageGroup,
  getDirectMessageGroup,
  getDirectMessageGroupsByUser,
};
