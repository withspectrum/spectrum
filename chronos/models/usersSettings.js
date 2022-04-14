// @flow
const { db } = require('shared/db');
import type { Timeframe } from 'chronos/types';

// prettier-ignore
export const getUserIdsForDigest = (timeframe: Timeframe, after: number, limit: number): Promise<Array<string>> => {
  let range = timeframe === 'daily' ? 'dailyDigest' : 'weeklyDigest';

  return db
    .table('usersSettings')
    .getAll(true, { index: `${range}Email` })
    .skip(after)
    .limit(limit)
    .map(row => row('userId'))
    .run()
};
