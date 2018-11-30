// @flow
const { db } = require('shared/db');
import { intersection } from 'lodash';
import {
  getCommunitiesWithMinimumMembers,
  getCommunitiesWithActiveThreadsInTimeframe,
} from './community';
import { getCommunitiesById } from 'shared/db/queries/community';
import type { DBCommunity, DBCoreMetric } from 'shared/types';
import { getRangeFromTimeframe } from './utils';
import type { Timeframe } from 'chronos/types';

export const saveCoreMetrics = (data: DBCoreMetric): Promise<DBCoreMetric> => {
  return db
    .table('coreMetrics')
    .insert(
      {
        date: new Date(),
        ...data,
      },
      {
        returnChanges: true,
      }
    )
    .run()
    .then(result => result.changes[0].new_val);
};

export const getActiveUsersInTimeframe = (
  timeframe: Timeframe
): Promise<number> => {
  const range = getRangeFromTimeframe(timeframe);
  return db
    .table('users')
    .filter(row =>
      row
        .hasFields('lastSeen')
        .and(row('lastSeen').during(db.now().sub(range), db.now()))
    )
    .count()
    .default(0)
    .run();
};

type ACData = {
  count: number,
  communities: Array<DBCommunity>,
};

// prettier-ignore
export const getActiveCommunitiesInTimeframe = async (timeframe: Timeframe): Promise<ACData> => {
  const [
    activeCommunitiesByMemberCount,
    activeCommunitiesByActiveThreads
  ] = await Promise.all([ 
    getCommunitiesWithMinimumMembers(2),
    getCommunitiesWithActiveThreadsInTimeframe(timeframe)
  ])

  const intersectingIds = intersection(activeCommunitiesByActiveThreads, activeCommunitiesByMemberCount)

  return {
    count: intersectingIds.length,
    communities: await getCommunitiesById(intersectingIds),
  };
};

export const getTableRecordCount = (
  table: string,
  filter: mixed
): Promise<number> => {
  if (filter) {
    return db
      .table(table)
      .filter(row => db.not(row.hasFields('deletedAt')))
      .count()
      .run();
  }

  return db
    .table(table)
    .filter(row => db.not(row.hasFields('deletedAt')))
    .count()
    .run();
};

export const getLastTwoCoreMetrics = (): Promise<Array<DBCoreMetric>> => {
  return (
    db
      .table('coreMetrics')
      .orderBy(db.desc('date'))
      .run()
      // send back the most recent 2 records
      .then(results => results.slice(0, 2))
  );
};
