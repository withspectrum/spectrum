const debug = require('debug')('mercury');
const createWorker = require('../shared/bull/create-worker');
import processReputationEvent from './queues/processReputationEvent';
import calculateThreadScore from './queues/calculateThreadScore';
import { PROCESS_REPUTATION_EVENT, CALCULATE_THREAD_SCORE } from './constants';

const PORT = process.env.PORT || 3005;

debug('\n✉️ Mercury, the reputation worker, is starting...');
debug('Logging with debug enabled!');

const server = createWorker({
  [PROCESS_REPUTATION_EVENT]: processReputationEvent,
  [CALCULATE_THREAD_SCORE]: calculateThreadScore,
});

debug(
  `🗄 Mercury open for business ${(process.env.NODE_ENV === 'production' &&
    `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) ||
    'locally'}`
);

server.listen(PORT, 'localhost', () => {
  debug(
    `💉 Healthcheck server running at ${server.address().address}:${
      server.address().port
    }`
  );
});
