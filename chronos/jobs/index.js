// @flow
import { createJob } from './utils';
import { PROCESS_DIGEST_EMAIL } from '../queues/constants';

// weekly digest
const weeklyDigest = () =>
  createJob(
    PROCESS_DIGEST_EMAIL,
    '0 6 * * 0', // run at 6am on Sunday
    'weekkly'
  );

// daily digest
const dailyDigest = () =>
  createJob(
    PROCESS_DIGEST_EMAIL,
    '0 6 * * 1-5', // run at 6am every Monday-Friday
    'daily'
  );

module.exports = {
  weeklyDigest,
  dailyDigest,
};
