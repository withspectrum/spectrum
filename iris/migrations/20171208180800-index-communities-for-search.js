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
      communities.map(community => ({
        id: community.id,
        description: community.description,
        name: community.name,
        slug: community.slug,
        website: community.website ? community.website : null,
        objectID: community.id,
      }))
    )
    .then(searchableCommunities => {
      return communitiesSearchIndex.addObjects(searchableCommunities);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.resolve();
};
