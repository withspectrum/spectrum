// @flow
const debug = require('debug')('hermes');
import startSendNewMessageEmailWorker from './queues/send-new-message-email';

console.log('\n✉️ Hermes, the email worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

startSendNewMessageEmailWorker();
console.log(
  `\n🗄 Queues open for business ${(process.env.NODE_ENV === 'production' && `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) || 'locally'}`
);
