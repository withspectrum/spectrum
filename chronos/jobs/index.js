// @flow
import { createJob } from './utils';
import {
  PROCESS_WEEKLY_DIGEST_EMAIL,
  PROCESS_DAILY_DIGEST_EMAIL,
  PROCESS_DAILY_CORE_METRICS,
} from '../queues/constants';

// weekly digest
const weeklyDigest = () =>
  createJob(
    PROCESS_WEEKLY_DIGEST_EMAIL,
    '0 6 * * 1', // run at 6am on Monday
    // '* * * * *',
    'weekly'
  );

// daily digest
const dailyDigest = () =>
  createJob(
    PROCESS_DAILY_DIGEST_EMAIL,
    // '0 18 * * *', // run at 6pm every day
    '* * * * *',
    'daily'
  );

// daily coreMetrics collection
const dailyCoreMetrics = () =>
  createJob(
    PROCESS_DAILY_CORE_METRICS,
    '0 0 * * *', // run at midnight every day
    // '* * * * *',
    'daily'
  );

module.exports = {
  weeklyDigest,
  dailyDigest,
  dailyCoreMetrics,
};
