// @flow
const { db } = require('./db');
import type { DBCommunitySettings } from 'shared/types';

export const getCommunitiesSettings = (
  communityIds: Array<string>
): Promise<?DBCommunitySettings> => {
  return db
    .table('communitySettings')
    .getAll(...communityIds, { index: 'communityId' })
    .group('communityId')
    .run();
};
