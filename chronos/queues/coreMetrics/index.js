// @flow
const debug = require('debug')('chronos:queue:save-core-metrics');
import Raven from 'shared/raven';
import {
  saveCoreMetrics,
  getActiveUsersInTimeframe,
  getActiveCommunitiesInTimeframe,
  getTableRecordCount,
} from 'chronos/models/coreMetrics';

const processJob = async () => {
  debug('Processing daily core metrics');

  const [
    dau,
    wau,
    mau,
    { count: dac, communities: dacData },
    { count: wac, communities: wacData },
    { count: mac, communities: macData },
    usersCommunitiesCount,
    messagesCount,
    threadsCount,
    users,
    communities,
    threads,
    dmThreads,
  ] = await Promise.all([
    getActiveUsersInTimeframe('daily'),
    getActiveUsersInTimeframe('weekly'),
    getActiveUsersInTimeframe('monthly'),
    getActiveCommunitiesInTimeframe('daily'),
    getActiveCommunitiesInTimeframe('weekly'),
    getActiveCommunitiesInTimeframe('monthly'),
    getTableRecordCount('usersCommunities'),
    getTableRecordCount('messages'),
    getTableRecordCount('threads'),
    getTableRecordCount('users'),
    getTableRecordCount('communities'),
    getTableRecordCount('threads'),
    getTableRecordCount('directMessageThreads'),
  ]);

  const cpu = parseFloat((usersCommunitiesCount / users).toFixed(3));
  const mpu = parseFloat((messagesCount / users).toFixed(3));
  const tpu = parseFloat((threadsCount / users).toFixed(3));

  const dacSlugs = dacData.map(c => c.slug);
  const wacSlugs = wacData.map(c => c.slug);
  const macSlugs = macData.map(c => c.slug);

  const coreMetrics = {
    dau,
    wau,
    mau,
    dac,
    dacSlugs,
    wac,
    wacSlugs,
    mac,
    macSlugs,
    cpu,
    mpu,
    tpu,
    users,
    communities,
    threads,
    dmThreads,
  };

  return saveCoreMetrics(coreMetrics);
};

export default async () => {
  try {
    await processJob();
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
