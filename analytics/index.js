// @flow
const debug = require('debug')('athena');
import createWorker from '../shared/bull/create-worker';

import trackAnalytics from './queues/track-analytics';
import identifyAnalytics from './queues/identify-analytics';

import { TRACK_ANALYTICS, IDENTIFY_ANALYTICS } from './queues/constants';

const PORT = process.env.PORT || 3009;

debug('\n📈 Analytics worker is starting...');
debug('Logging with debug enabled!');
debug('');

const server = createWorker({
  [TRACK_ANALYTICS]: trackAnalytics,
  [IDENTIFY_ANALYTICS]: identifyAnalytics,
});

debug(
  `🗄 Queues open for business ${(process.env.NODE_ENV === 'production' &&
    // $FlowIssue
    `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) ||
    'locally'}`
);

// $FlowIssue
server.listen(PORT, 'localhost', () => {
  debug(
    `💉 Healthcheck server running at ${server.address().address}:${
      server.address().port
    }`
  );
});
