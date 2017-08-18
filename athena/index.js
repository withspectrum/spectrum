// @flow
const debug = require('debug')('athena');
import createWorker from '../shared/bull/create-worker';
// Our job-processing worker server
import processThreadMessageNotification from './queues/thread-message-notification';
import processDirectMessageNotification from './queues/direct-message-notification';
import processReactionNotification from './queues/reaction-notification';
import processChannelNotification from './queues/channel-notification';
import processCommunityNotification from './queues/community-notification';
import processThreadNotification from './queues/thread-notification';
import processSlackImport from './queues/slack-import';
import processCommunityInvite from './queues/community-invite';
import processCommunityInvoicePaid from './queues/community-invoice-paid';
import {
  THREAD_MESSAGE_NOTIFICATION,
  DIRECT_MESSAGE_NOTIFICATION,
  REACTION_NOTIFICATION,
  CHANNEL_NOTIFICATION,
  COMMUNITY_NOTIFICATION,
  THREAD_NOTIFICATION,
  SLACK_IMPORT,
  COMMUNITY_INVITE_NOTIFICATION,
  COMMUNITY_INVOICE_PAID_NOTIFICATION,
} from './queues/constants';

const PORT = process.env.PORT || 3003;

console.log('\n🛠 Athena, the processing worker, is starting...');
debug('Logging with debug enabled!');
console.log('');

const server = createWorker({
  [THREAD_MESSAGE_NOTIFICATION]: processThreadMessageNotification,
  [DIRECT_MESSAGE_NOTIFICATION]: processDirectMessageNotification,
  [REACTION_NOTIFICATION]: processReactionNotification,
  [CHANNEL_NOTIFICATION]: processChannelNotification,
  [COMMUNITY_NOTIFICATION]: processCommunityNotification,
  [THREAD_NOTIFICATION]: processThreadNotification,
  [SLACK_IMPORT]: processSlackImport,
  [COMMUNITY_INVITE_NOTIFICATION]: processCommunityInvite,
  [COMMUNITY_INVOICE_PAID_NOTIFICATION]: processCommunityInvoicePaid,
});

console.log(
  `🗄 Queues open for business ${(process.env.NODE_ENV === 'production' &&
    `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) ||
    'locally'}`
);

server.listen(PORT, 'localhost', () => {
  console.log(
    `💉 Healthcheck server running at ${server.address()
      .address}:${server.address().port}`
  );
});
