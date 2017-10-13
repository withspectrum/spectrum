// @flow
const debug = require('debug')('chronos');
const createWorker = require('../shared/bull/create-worker');
import processDataForDigest from './queues/digests';
import processSingleDigestEmail from './queues/digests/processDigestEmail';
import {
  PROCESS_WEEKLY_DIGEST_EMAIL,
  PROCESS_DAILY_DIGEST_EMAIL,
  PROCESS_INDIVIDUAL_DIGEST,
} from './queues/constants';
import { weeklyDigest, dailyDigest } from './jobs';

const PORT = process.env.PORT || 3004;

console.log('\n✉️ Chronos, the cron job worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

const server = createWorker({
  [PROCESS_WEEKLY_DIGEST_EMAIL]: processDataForDigest,
  [PROCESS_DAILY_DIGEST_EMAIL]: processDataForDigest,
  [PROCESS_INDIVIDUAL_DIGEST]: processSingleDigestEmail,
});

// start the jobs
weeklyDigest();
dailyDigest();

// $FlowIssue
console.log(
  `🗄 Crons open for business ${process.env.NODE_ENV === 'production'
    ? 'in production'
    : 'locally'}`
);

server.listen(PORT, 'localhost', () => {
  console.log(
    `💉 Healthcheck server running at ${server.address()
      .address}:${server.address().port}`
  );
});
