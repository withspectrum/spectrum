// @flow
// NOTE: This file needs to be CommonJS (require/module.exports) instead of ES modules
// so that import { queueName } from 'queues' works!
const createQueue = require('shared/bull/create-queue.js');
const EventEmitter = require('events');
import type { Queues } from './types';

// Normalize our (inconsistent) queue names to a set of JS compatible names
exports.QUEUE_NAMES = {
  // athena - notifications
  sendThreadNotificationQueue: 'thread notification',
  sendCommunityNotificationQueue: 'community notification',
  trackUserThreadLastSeenQueue: 'track user thread last seen',
  sendProInvoicePaidNotificationQueue: 'pro invoice paid notification',
  sendCommunityInvoicePaidNotificationQueue:
    'community invoice paid notification',
  sendReactionNotificationQueue: 'reaction notification',
  sendPrivateChannelRequestQueue: 'private channel request sent',
  sendPrivateChannelInviteNotificationQueue:
    'private channel invite notification',
  sendCommunityInviteNotificationQueue: 'community invite notification',
  sendChannelNotificationQueue: 'channel notification',
  sendDirectMessageNotificationQueue: 'direct message notification',
  sendMessageNotificationQueue: 'message notification',
  sendNotificationAsPushQueue: 'push notifications',
  slackImportQueue: 'slack import',

  // hermes - emails
  sendNewUserWelcomeEmailQueue: 'send new user welcome email',
  sendNewCommunityWelcomeEmailQueue: 'send new community welcome email',
  sendEmailValidationEmailQueue: 'send email validation email',

  // mercury - reputation
  processReputationEventQueue: 'process reputation event',

  // admin queues - multiple workers
  _adminSendCommunityCreatedEmailQueue: 'admin community created',
  _adminProcessToxicMessageQueue: 'process admin toxic message',
  _adminProcessToxicThreadQueue: 'process admin toxic thread',
  _adminProcessSlackImportQueue: 'admin slack import process email',
};

// We add one error listener per queue, so we have to set the max listeners
// to whatever it is set to + the amount of queues passed in
// $FlowIssue
EventEmitter.defaultMaxListeners =
  // $FlowIssue
  Object.keys(exports.QUEUE_NAMES).length + EventEmitter.defaultMaxListeners;

// Create all the queues, export an object with all the queues
const queues: Queues = Object.keys(exports.QUEUE_NAMES).reduce(
  (queues, name) => {
    queues[name] = createQueue(exports.QUEUE_NAMES[name]);
    return queues;
  },
  {}
);

// Needs to be module.exports so import { sendEmailValidationEmailQueue } from 'queues' works
// it wouldn't work with export default queues and for some reason export { ...queues } doesn't either
module.exports = queues;
