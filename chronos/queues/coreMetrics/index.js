// @flow
const debug = require('debug')('chronos:queue:process-core-metrics');
import {
  saveCoreMetrics,
  getAu,
  getAc,
  getPu,
  getCount,
} from '../../models/coreMetrics';

/*
  1. Daily active users
  2. Weekly active users
  3. Monthly active users
  4. Daily active communities
  5. Weekly active communities
  6. Monthly active communities
  7. Communities per user
  8. Messages per user
  9. Threads per user
  10. Total users
  11. Total communities
  12. Total threads
  13. Total DM threads
  14. Total thread messages
  15. Total DM messages
*/

export default async () => {
  debug(`\nprocessing daily core metrics`);

  // 1
  const dau = await getAu('daily');

  // 2
  const wau = await getAu('weekly');

  // 3
  const mau = await getAu('monthly');

  // 4
  const dac = await getAc('daily');

  // 5
  const wac = await getAc('weekly');

  // 6
  const mac = await getAc('monthly');

  // 7
  const cpu = await getPu('usersCommunities');

  // 8
  const mpu = await getPu('messages');

  // 9
  const tpu = await getPu('threads');

  // 10
  const users = await getCount('users');

  // 11
  const communities = await getCount('communities');

  // 12
  const threads = await getCount('threads');

  // 13
  const dmThreads = await getCount('directMessageThreads');

  // 14
  const threadMessages = await getCount('messages', { threadType: 'story' });

  // 15
  const dmMessages = await getCount('messages', {
    threadType: 'directMessageThread',
  });

  const coreMetrics = {
    dau,
    wau,
    mau,
    dac,
    wac,
    mac,
    cpu,
    mpu,
    tpu,
    users,
    communities,
    threads,
    dmThreads,
    threadMessages,
    dmMessages,
  };

  try {
    return saveCoreMetrics(coreMetrics);
  } catch (err) {
    console.log(err);
  }
};
