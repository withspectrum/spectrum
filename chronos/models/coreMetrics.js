// @flow
const { db } = require('shared/db');
import { getCoreMetricsActiveThreads } from './thread';
import { getCommunitiesWithMinimumMembers, getCommunities } from './community';
import type { DBCommunity } from 'shared/types';

type CoreMetricsType = {
  dau: number,
  wau: number,
  mau: number,
  dac: number,
  dacSlugs: Array<string>,
  wac: number,
  wacSlugs: Array<string>,
  mac: number,
  macSlugs: Array<string>,
  cpu: number,
  mpu: number,
  tpu: number,
  users: number,
  communities: number,
  threads: number,
  dmThreads: number,
};

export const saveCoreMetrics = (data: CoreMetricsType): Promise<Object> => {
  return db
    .table('coreMetrics')
    .insert({
      date: new Date(),
      ...data,
    })
    .run();
};

export const parseRange = (timeframe: string): number => {
  switch (timeframe) {
    case 'daily': {
      return 60 * 60 * 24;
    }
    case 'weekly': {
      return 60 * 60 * 24 * 7;
    }
    case 'monthly': {
      return 60 * 60 * 24 * 30;
    }
    case 'quarterly': {
      return 60 * 60 * 24 * 90;
    }
    default: {
      return 60 * 60 * 24 * 30;
    }
  }
};

// dau, wau, mau
export const getAu = (range: string): Promise<number> => {
  const RANGE = parseRange(range);
  return db
    .table('users')
    .filter(row =>
      row
        .hasFields('lastSeen')
        .and(row('lastSeen').during(db.now().sub(RANGE), db.now()))
    )
    .count()
    .default(0)
    .run();
};

// dac, wac, mac
type ACData = {
  count: number,
  communities: Array<DBCommunity>,
};
export const getAc = async (range: string): Promise<ACData> => {
  // constants
  const RANGE = parseRange(range);
  const MIN_THREAD_COUNT = 1;

  // get threads posted in the range
  const threadsPostedInRange = await getCoreMetricsActiveThreads(RANGE);
  // returns an array of community ids
  const activeCommunitiesByThreads = threadsPostedInRange
    .filter(t => t.reduction.length > MIN_THREAD_COUNT)
    .map(t => t.group);

  // for each active community by thread count, only return communities with at least 2 members
  const activeCommunitiesByMember = await getCommunitiesWithMinimumMembers(
    2,
    activeCommunitiesByThreads
  );

  return {
    count: activeCommunitiesByMember.length,
    communities: await getCommunities(activeCommunitiesByMember),
  };
};

export const getCount = (table: string, filter: mixed): Promise<number> => {
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

// cpu, tpu, mpu
export const getPu = async (table: string): Promise<number> => {
  const userCount = await getCount('users');
  const tableCount = await db
    .table(table)
    .filter(row => db.not(row.hasFields('deletedAt')))
    .count()
    .run();

  return parseFloat((tableCount / userCount).toFixed(3));
};

export const getLastTwoCoreMetrics = (): Promise<Array<CoreMetricsType>> => {
  return (
    db
      .table('coreMetrics')
      .orderBy(db.desc('date'))
      .run()
      // send back the most recent 2 records
      .then(results => results.slice(0, 2))
  );
};
