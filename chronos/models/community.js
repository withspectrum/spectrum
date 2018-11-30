// @flow
const { db } = require('shared/db');
import type { Timeframe } from 'chronos/types';
import { getRangeFromTimeframe } from 'chronos/models/utils';

// prettier-ignore
export const getCommunitiesWithMinimumMembers = (min: number = 2): Promise<Array<string>> => {
  return db
    .table('communities')
    .between(min, db.maxval, { index: 'memberCount' })
    .filter(community => community.hasFields('deletedAt').not())
    .map(row => row('id'))
    .run();
};

export const getCommunitiesWithActiveThreadsInTimeframe = async (
  timeframe: Timeframe
): Promise<Array<string>> => {
  const range = getRangeFromTimeframe(timeframe);

  return db
    .table('threads')
    .between(db.now().sub(range), db.now(), {
      index: 'lastActive',
      leftBound: 'open',
      rightBound: 'open',
    })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .group('communityId')
    .ungroup()
    .map(row => row('group'))
    .run();
};
