// @flow
const debug = require('debug')('vulcan');
const PORT = process.env.PORT || 3007;
import {
  newThread,
  deletedThread,
  movedThread,
  editedThread,
} from './models/thread';
import {
  newCommunity,
  deletedCommunity,
  editedCommunity,
} from './models/community';
import { newMessage } from './models/message';
import { newUser, deletedUser, editedUser } from './models/user';
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

newThread();
deletedThread();
movedThread();
editedThread();

newCommunity();
deletedCommunity();
editedCommunity();

newUser();
deletedUser();
editedUser();

newMessage();

const server = createServer();
server.listen(PORT, 'localhost', () => {
  console.log(
    `💉 Healthcheck server running at ${server.address()
      .address}:${server.address().port}`
  );
});
