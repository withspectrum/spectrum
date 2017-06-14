// @flow
// Our job-processing worker server
import startMessageNotificationQueue from './queues/message-notification';
import startReactionNotificationQueue from './queues/reaction-notification';
import startChannelNotificationQueue from './queues/channel-notification';
import startCommunityNotificationQueue from './queues/community-notification';

console.log('');
startMessageNotificationQueue();
startReactionNotificationQueue();
startChannelNotificationQueue();
startCommunityNotificationQueue();
console.log(
  `\n🗄 Queues open for business ${(process.env.NODE_ENV === 'production' && `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) || 'locally'}`
);
