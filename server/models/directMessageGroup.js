/**
 * Storing and retrieving directMessageGroups
 */
const { db } = require('./db');

const getDirectMessageGroup = id => {
  return db.table('direct_message_groups').get(id).run();
};

const addDirectMessageGroup = directMessageGroup => {
  return db
    .table('direct_message_groups')
    .insert(Object.assign({}, directMessageGroup), { returnChanges: true })
    .run()
    .then(result => result.changes[0].new_val);
};

module.exports = {
  addDirectMessageGroup,
  getDirectMessageGroup,
};
