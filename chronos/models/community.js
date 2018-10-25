// @flow
const { db } = require('./db');
import type { DBCommunity } from 'shared/types';

export const getCommunityById = (id: string): Promise<Object> => {
  return db
    .table('communities')
    .get(id)
    .run();
};

export const getCommunities = (
  ids: Array<string>
): Promise<Array<DBCommunity>> => {
  return db
    .table('communities')
    .getAll(...ids)
    .run();
};

export const getTopCommunities = (amount: number): Array<Object> => {
  return db
    .table('communities')
    .orderBy('memberCount')
    .filter(community => community.hasFields('deletedAt').not())
    .limit(amount)
    .run();
};

export const getCommunitiesWithMinimumMembers = (
  min: number = 2,
  communityIds: Array<string>
) => {
  return db
    .table('communities')
    .filter(row => row('memberCount').ge(min))
    .filter(community => community.hasFields('deletedAt').not())
    .map(row => row('id'))
    .run();
};
