// @flow
const debug = require('debug')('hermes');
const createWorker = require('../shared/bull/create-worker');
import processSendWeeklyDigestEmail from './queues/send-weekly-digest-email';
import { SEND_WEEKLY_DIGEST_EMAIL } from './queues/constants';
import { weeklyDigest } from './jobs';

const PORT = process.env.PORT || 3004;

console.log('\n✉️ Chronos, the cron job worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

const server = createWorker({
  [SEND_WEEKLY_DIGEST_EMAIL]: processSendWeeklyDigestEmail,
});

console.log(weeklyDigest);

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
