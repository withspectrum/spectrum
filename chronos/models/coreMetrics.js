// @flow
const { db } = require('./db');
import intersection from 'lodash.intersection';
import { getActiveThreadsInTimeframe } from './thread';
import { getCommunitiesWithMinimumMembers } from './community';

export const saveCoreMetrics = (data: Object): Promise<Object> => {
  return db
    .table('coreMetrics')
    .insert({
      date: new Date(),
      ...data,
    })
    .run();
};

export const parseRange = (timeframe: string) => {
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
export const getAu = (range: string) => {
  const RANGE = parseRange(range);
  return db
    .table('users')
    .filter(db.row('lastSeen').during(db.now().sub(RANGE), db.now()))
    .count()
    .default(0)
    .run();
};

// dac, wac, mac
export const getAc = async (range: string) => {
  // constants
  const RANGE = parseRange(range);
  const MIN_THREAD_COUNT = 5;
  const MIN_MEMBER_COUNT = 50;

  // get threads posted in the range
  const threadsPostedInRange = await getActiveThreadsInTimeframe(range);

  // we will iterate through each thread and accumulate the counts of threads posted in each community
  const threadCountPerCommunity = {};
  // accumulate threads posted in the last month keyed by communityid
  threadsPostedInRange.map(c => {
    threadCountPerCommunity[c.communityId] = threadCountPerCommunity[
      c.communityId
    ]
      ? threadCountPerCommunity[c.communityId] + 1
      : 1;
  });
  const activeCommunitiesByThreads = Object.keys(
    threadCountPerCommunity
  ).filter(o => threadCountPerCommunity[o] >= MIN_THREAD_COUNT);

  // communities that meet a minimum membership threshold
  let activeCommunitiesByMembership = await getCommunitiesWithMinimumMembers(
    MIN_MEMBER_COUNT
  );
  activeCommunitiesByMembership = activeCommunitiesByMembership.map(c => c.id);

  // find communities that met both thread and membership criteria
  const activeCommunities = intersection(
    activeCommunitiesByThreads,
    activeCommunitiesByMembership
  );

  return activeCommunities.length;
};

export const getCount = (table: string, filter: mixed) => {
  if (filter) {
    return db
      .table(table)
      .filter(filter)
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
export const getPu = async (table: string) => {
  const userCount = await getCount('users');
  const tableCount = await db
    .table(table)
    .filter(row => db.not(row.hasFields('deletedAt')))
    .count()
    .run();

  return parseFloat((tableCount / userCount).toFixed(3));
};
