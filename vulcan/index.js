// @flow
const debug = require('debug')('vulcan');
const createWorker = require('shared/bull/create-worker');
import searchEvent from 'vulcan/queues';
import { SEARCH_INDEXING_EVENT } from 'vulcan/queues/constants';

const PORT = process.env.PORT || 3005;

debug('\n✉️ Vulcan, the search indexing worker, is starting...');
debug('Logging with debug enabled!');

const server = createWorker({
  [SEARCH_INDEXING_EVENT]: searchEvent,
});

// $FlowIssue
server.listen(PORT, 'localhost', () => {
  debug(
    `💉 Healthcheck server running at ${server.address().address}:${
      server.address().port
    }`
  );
});
