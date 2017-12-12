// @flow
const debug = require('debug')('vulcan');
const PORT = process.env.PORT || 3007;
import {
  newThreads,
  deletedThreads,
  movedChannelThreads,
  changedThreadContent,
} from './models/thread';
import createServer from './server';

console.log('\n✉️ Vulcan, the search worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

console.log(
  `🗄 Vulcan open for business ${(process.env.NODE_ENV === 'production' &&
    // $FlowIssue
    `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) ||
    'locally'}`
);

newThreads();
deletedThreads();
movedChannelThreads();
changedThreadContent();

const server = createServer();
server.listen(PORT, 'localhost', () => {
  console.log(
    `💉 Healthcheck server running at ${server.address()
      .address}:${server.address().port}`
  );
});
