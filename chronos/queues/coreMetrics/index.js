// @flow
const debug = require('debug')('chronos:queue:process-core-metrics');
import Raven from 'shared/raven';
import {
  saveCoreMetrics,
  getAu,
  getAc,
  getPu,
  getCount,
} from '../../models/coreMetrics';

export default async () => {
  debug('\nprocessing daily core metrics');

  // 1;
  const [
    dau,
    wau,
    mau,
    { count: dac, communities: dacData },
    { count: wac, communities: wacData },
    { count: mac, communities: macData },
    cpu,
    mpu,
    tpu,
    users,
    communities,
    threads,
    dmThreads,
  ] = await Promise.all([
    getAu('daily'),
    getAu('weekly'),
    getAu('month'),
    getAc('daily'),
    getAc('weekly'),
    getAc('monthly'),
    getPu('usersCommunities'),
    getPu('messages'),
    getPu('threads'),
    getCount('users'),
    getCount('communities'),
    getCount('threads'),
    getCount('directMessageThreads'),
  ]);

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

  try {
    return saveCoreMetrics(coreMetrics);
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  }
};
