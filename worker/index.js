// @flow
// Our job-processing worker server
import startMessageNotificationQueue from './queues/message-notification';
import startReactionNotificationQueue from './queues/reaction-notification';
import startChannelNotificationQueue from './queues/channel-notification';

startMessageNotificationQueue();
startReactionNotificationQueue();
startChannelNotificationQueue();
console.log('Queues open for business 💪');
