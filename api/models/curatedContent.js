//@flow
const { db } = require('shared/db');
import type { DBCommunity } from 'shared/types';
import { getCommunitiesBySlug } from './community';

// prettier-ignore
export const getCuratedCommunities = (type: string): Promise<Array<DBCommunity>> => {
  return db
    .table('curatedContent')
    .filter({ type })
    .run()
    .then(results => (results && results.length > 0 ? results[0] : null))
    .then(result => result && getCommunitiesBySlug(result.data));
};
