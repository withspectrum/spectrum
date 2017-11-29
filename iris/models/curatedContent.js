//@flow
const { db } = require('./db');
import type { DBCommunity } from 'shared/types';
import { getCommunitiesBySlug } from './community';

export const getCuratedCommunities = (
  type: string
): Promise<Array<DBCommunity>> => {
  return db
    .table('curatedContent')
    .filter({ type })
    .run()
    .then(results => (results && results.length > 0 ? results[0] : null))
    .then(result => result && getCommunitiesBySlug(result.data));
};

export const getTopCommunities = (): Promise<Array<DBCommunity>> => {
  return db
    .table('curatedContent')
    .filter({ type: 'top-communities-by-members' })
    .map(community => community('id'))
    .run()
    .then(communities => getCommunitiesBySlug(communities));
};
