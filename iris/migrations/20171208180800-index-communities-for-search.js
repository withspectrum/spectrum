const env = require('node-env-file');
const path = require('path');
env(path.resolve(__dirname, '../.env'), { raise: false });
const IS_PROD = process.env.NODE_ENV === 'production';
let ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
let ALGOLIA_API_SECRET = process.env.ALGOLIA_API_SECRET;
const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_SECRET);
const communitiesSearchIndex = algolia.initIndex(
  IS_PROD ? 'communities' : 'dev_communities'
);

exports.up = function(r, conn) {
  return r
    .table('communities')
    .filter(community => community.hasFields('deletedAt').not())
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(communities =>
      communities.map(community => {
        const {
          createdAt,
          pinnedThreadId,
          watercoolerId,
          modifiedAt,
          ...rest
        } = community;
        const searchableCommunity = {
          ...rest,
          objectID: community.id,
        };
        return searchableCommunity;
      })
    )
    .then(searchableCommunities => {
      return communitiesSearchIndex.addObjects(
        searchableCommunities,
        (err, obj) => {
          if (err) {
            console.log('error indexing communities', err);
          }
          console.log('stored communities in search');
        }
      );
    });
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.resolve();
};
