require('now-env');
const initIndex = require('../../shared/algolia');
const searchIndex = initIndex('users');

exports.up = function(r, conn) {
  return r
    .table('users')
    .filter(user => user.hasFields('username'))
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(users =>
      users.map(user => ({
        name: user.name,
        username: user.username,
        description: user.description,
        website: user.website,
        objectID: user.id,
      }))
    )
    .then(searchableUsers => {
      return;
      // return searchIndex.addObjects(searchableUsers)
    })
    .catch(err => console.log(err));
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.resolve();
};
