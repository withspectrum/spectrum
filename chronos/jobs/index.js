// @flow
import { createJob } from './utils';
import { PROCESS_WEEKLY_DIGEST_EMAIL } from '../queues/constants';

// weekly digest
const weeklyDigest = () =>
  createJob(
    PROCESS_WEEKLY_DIGEST_EMAIL,
    '0 6 * * 1' // run at 9am every Monday
  );

module.exports = {
  weeklyDigest,
};
