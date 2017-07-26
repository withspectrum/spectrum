// @flow
const debug = require('debug')('athena');
// Our job-processing worker server
import startMessageNotificationQueue from './queues/message-notification';
import startReactionNotificationQueue from './queues/reaction-notification';
import startChannelNotificationQueue from './queues/channel-notification';
import startCommunityNotificationQueue from './queues/community-notification';
import startThreadNotificationQueue from './queues/thread-notification';
import startSlackImportQueue from './queues/slack-import';
import startCommunityInviteQueue from './queues/community-invite';
// import startCommunityInvoicePaidQueue from './queues/community-invoice-paid';

console.log('\n🛠 Athena, the processing worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

startMessageNotificationQueue();
startReactionNotificationQueue();
startChannelNotificationQueue();
startCommunityNotificationQueue();
startThreadNotificationQueue();
startSlackImportQueue();
startCommunityInviteQueue();
// startCommunityInvoicePaidQueue();

console.log(
  `\n🗄 Queues open for business ${(process.env.NODE_ENV === 'production' &&
    `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) ||
    'locally'}`
);
