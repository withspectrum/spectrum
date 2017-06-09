// @flow
// Our job-processing worker server
import startMessageNotificationQueue from './queues/message-notification';
import startReactionNotificationQueue from './queues/reaction-notification';
import startChannelNotificationQueue from './queues/channel-notification';
import startCommunityNotificationQueue from './queues/community-notification';

startMessageNotificationQueue();
startReactionNotificationQueue();
startChannelNotificationQueue();
startCommunityNotificationQueue();
console.log('Queues open for business 💪');
