const env = require('node-env-file');
const path = require('path');
env(path.resolve(__dirname, '../.env'), { raise: false });
const IS_PROD = process.env.NODE_ENV === 'production';
let ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
let ALGOLIA_API_SECRET = process.env.ALGOLIA_API_SECRET;
const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_SECRET);
const usersSearchIndex = algolia.initIndex(IS_PROD ? 'users' : 'dev_users');

exports.up = function(r, conn) {
  return r
    .table('users')
    .filter(user => user.hasFields('username'))
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(users =>
      users.map(user => {
        const {
          email,
          lastSeen,
          providerId,
          fbProviderId,
          googleProviderId,
          createdAt,
          isOnline,
          githubProviderId,
          timezone,
          ...rest
        } = user;
        const searchableUser = {
          ...rest,
          objectID: user.id,
        };
        return searchableUser;
      })
    )
    .then(searchableUsers => {
      return usersSearchIndex.addObjects(searchableUsers, (err, obj) => {
        if (err) {
          console.log('error indexing users', err);
        }
        console.log('stored users in search');
      });
    });
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.resolve();
};
