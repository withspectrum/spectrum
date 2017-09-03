// @flow
import { createJob } from './utils';

// weekly digest
const weeklyDigest = createJob(
  'send weekly digest email',
  '01 * * * * *', // run every second
  true
);

module.exports = {
  weeklyDigest,
};
