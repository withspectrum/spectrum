// @flow
// $FlowFixMe
const debug = require('debug')('mercury');
const createWorker = require('../shared/bull/create-worker');
import processReputationEvent from './queues/processReputationEvent';
import { PROCESS_REPUTATION_EVENT } from './constants';

const PORT = process.env.PORT || 3004;

console.log('\n✉️ Mercury, the reputation worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

const server = createWorker({
  [PROCESS_REPUTATION_EVENT]: processReputationEvent,
});

console.log(
  `🗄 Mercury open for business ${(process.env.NODE_ENV === 'production' &&
    `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) ||
    'locally'}`
);

server.listen(PORT, 'localhost', () => {
  console.log(
    `💉 Healthcheck server running at ${server.address()
      .address}:${server.address().port}`
  );
});
