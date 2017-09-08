// @flow
const { db } = require('./db');

export const getCommunityById = (id: string): Promise<Object> => {
  return db.table('communities').get(id).run();
};

export const getTopCommunities = (amount: number): Array<Object> => {
  return db
    .table('communities')
    .pluck('id')
    .run()
    .then(communities => communities.map(community => community.id))
    .then(communityIds => {
      return Promise.all(
        communityIds.map(community => {
          return db
            .table('usersCommunities')
            .getAll(community, { index: 'communityId' })
            .filter({ isMember: true })
            .count()
            .run()
            .then(count => {
              return {
                id: community,
                count,
              };
            });
        })
      );
    })
    .then(data => {
      let sortedCommunities = data
        .sort((x, y) => {
          return y.count - x.count;
        })
        .map(community => community.id)
        .slice(0, amount);

      return db
        .table('communities')
        .getAll(...sortedCommunities)
        .filter(community => db.not(community.hasFields('deletedAt')))
        .run();
    });
};
