// @flow
// Our job-processing worker server
import startMessageNotificationQueue from './queues/message-notification';
import startReactionNotificationQueue from './queues/reaction-notification';

startMessageNotificationQueue();
startReactionNotificationQueue();
console.log('Queues open for business 💪');
