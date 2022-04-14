// @flow
import { createReadQuery, db } from 'shared/db';
import type { DBCommunity } from 'shared/types';

export const getCommunityById = createReadQuery((id: string) => ({
  query: db.table('communities').get(id),
  tags: (community: ?DBCommunity) => (community ? [community.id] : []),
}));

export const getCommunitiesById = createReadQuery((ids: Array<string>) => ({
  query: db.table('communities').getAll(...ids),
  tags: (communities: ?Array<DBCommunity>) =>
    communities ? communities.map(({ id }) => id) : [],
}));

export const getTopCommunitiesByMemberCount = createReadQuery(
  (amount: number) => ({
    query: db
      .table('communities')
      .orderBy({ index: db.desc('memberCount') })
      .filter(community => community.hasFields('deletedAt').not())
      .limit(amount),
    tags: (communities: Array<DBCommunity>) =>
      communities ? communities.map(({ id }) => id) : [],
  })
);
