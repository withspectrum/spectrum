// @flow
// Our job-processing worker server
import startMessageNotificationQueue from './queues/message-notification';

startMessageNotificationQueue();
console.log('Queues open for business 💪');
