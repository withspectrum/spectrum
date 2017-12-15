require('now-env');
const initIndex = require('../../shared/algolia');
const searchIndex = initIndex('communities');

exports.up = function(r, conn) {
  return r
    .table('communities')
    .filter(community => community.hasFields('deletedAt').not())
    .run(conn)
    .then(cursor => cursor.toArray())
    .then(communities =>
      communities.map(community => ({
        description: community.description,
        name: community.name,
        slug: community.slug,
        website: community.website ? community.website : null,
        objectID: community.id,
      }))
    )
    .then(searchableCommunities => {
      return;
      // searchIndex.addObjects(searchableCommunities)
    })
    .catch(err => console.log(err));
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.resolve();
};
