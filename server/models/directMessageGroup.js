//@flow

/**
 * Storing and retrieving directMessageGroups
 */
const { db } = require('./db');

export type DirectMessageGroupProps = {
  users: Array<any>,
  creator: String,
};

const getDirectMessageGroup = (id: String): Object => {
  return db.table('direct_message_groups').get(id).run();
};

const addDirectMessageGroup = (
  directMessageGroup: DirectMessageGroupProps
): Object => {
  return db
    .table('direct_message_groups')
    .insert(
      Object.assign({}, directMessageGroup, {
        lastActivity: new Date(),
        messages: [],
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

module.exports = {
  addDirectMessageGroup,
  getDirectMessageGroup,
};
