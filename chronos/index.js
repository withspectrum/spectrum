// $FlowFixMe
const debug = require('debug')('chronos');
const createWorker = require('../shared/bull/create-worker');
import processDigestEmail from './queues/process-digest-email';
import {
  PROCESS_WEEKLY_DIGEST_EMAIL,
  PROCESS_DAILY_DIGEST_EMAIL,
} from './queues/constants';
import { weeklyDigest, dailyDigest } from './jobs';

const PORT = process.env.PORT || 3004;

console.log('\n✉️ Chronos, the cron job worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

const server = createWorker({
  [PROCESS_WEEKLY_DIGEST_EMAIL]: processDigestEmail,
  [PROCESS_DAILY_DIGEST_EMAIL]: processDigestEmail,
});

// start the jobs
weeklyDigest();
dailyDigest();

console.log(
  `🗄 Crons open for business ${(process.env.NODE_ENV === 'production' &&
    `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) ||
    'locally'}`
);

server.listen(PORT, 'localhost', () => {
  console.log(
    `💉 Healthcheck server running at ${server.address()
      .address}:${server.address().port}`
  );
});
