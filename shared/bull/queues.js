// @flow
// NOTE: This file needs to be CommonJS (require/module.exports) instead of ES modules
// so that import { queueName } from 'queues' works!
const createQueue = require('shared/bull/create-queue.js');
const EventEmitter = require('events');

type Job<JobData> = {
  data: JobData,
};

interface BullQueue<JobData> {
  add: (data: JobData) => Promise<any>;
  process: (
    cb: (job: Job<JobData>, done: Function) => void | Promise<any>
  ) => void;
}

type Queues = {
  sendEmailValidationEmailQueue: BullQueue<{ email: string, userId: string }>,
  sendPrivateChannelRequestQueue: BullQueue<{
    userId: string,
    channel: Object,
  }>,
  sendPrivateChannelInviteNotificationQueue: BullQueue<{
    recipient: { email: string, firstName?: ?string, lastName?: ?string },
    channelId: string,
    senderId: string,
    customMessage?: ?string,
  }>,
  sendCommunityInviteNotificationQueue: BullQueue<{
    recipient: { email: string, firstName?: ?string, lastName?: ?string },
    communityId: string,
    senderId: string,
    customMessage?: ?string,
  }>,
  sendChannelNotificationQueue: BullQueue<{ channel: Object, userId: string }>,
  sendDirectMessageNotificationQueue: BullQueue<{
    message: Object,
    userId: string,
  }>,
  sendMessageNotificationQueue: BullQueue<{ message: Object }>,
  sendReactionNotificationQueue: BullQueue<{
    reaction: Object,
    userId: string,
  }>,
  sendNewCommunityWelcomeEmailQueue: BullQueue<{
    user: Object,
    community: Object,
  }>,
  sendCommunityInvoicePaidNotificationQueue: BullQueue<{ invoice: Object }>,
  sendProInvoicePaidNotificationQueue: BullQueue<{ invoice: Object }>,
  processReputationEventQueue: BullQueue<{
    userId: string,
    type: string,
    entityId: string,
  }>,
  trackUserThreadLastSeenQueue: BullQueue<{
    threadId: string,
    userId: string,
    timestamp: number | Date,
  }>,
  sendNewUserWelcomeEmailQueue: BullQueue<{ user: Object }>,
  sendCommunityNotificationQueue: BullQueue<{
    communityId: string,
    userId: string,
  }>,
  sendThreadNotificationQueue: BullQueue<{ thread: Object }>,
  _adminSendCommunityCreatedEmailQueue: BullQueue<{
    user: Object,
    community: Object,
  }>,
  _adminProcessSlackImportQueue: BullQueue<{
    thisUser: Object,
    community: Object,
    invitedCount: number,
    teamName: string,
  }>,
  _adminProcessToxicMessageQueue: BullQueue<{ message: Object }>,
  _adminProcessToxicThreadQueue: BullQueue<{ thread: Object }>,
};

// Normalize our (inconsistent) queue names to a set of JS compatible names
exports.QUEUE_NAMES = {
  sendEmailValidationEmailQueue: 'send email validation email',
  sendPrivateChannelRequestQueue: 'private channel request sent',
  sendPrivateChannelInviteNotificationQueue:
    'private channel invite notification',
  sendCommunityInviteNotificationQueue: 'community invite notification',
  sendChannelNotificationQueue: 'channel notification',
  sendDirectMessageNotificationQueue: 'direct message notification',
  sendMessageNotificationQueue: 'message notification',
  sendReactionNotificationQueue: 'reaction notification',
  sendNewCommunityWelcomeEmailQueue: 'send new community welcome email',
  sendCommunityInvoicePaidNotificationQueue:
    'community invoice paid notification',
  sendProInvoicePaidNotificationQueue: 'pro invoice paid notification',
  processReputationEventQueue: 'process reputation event',
  trackUserThreadLastSeenQueue: 'track user thread last seen',
  sendNewUserWelcomeEmailQueue: 'send new user welcome email',
  sendCommunityNotificationQueue: 'community notification',
  sendThreadNotificationQueue: 'thread notification',
  _adminSendCommunityCreatedEmailQueue: 'admin community created',
  _adminProcessToxicMessageQueue: 'process admin toxic message',
  _adminProcessSlackImportQueue: 'admin slack import process email',
  _adminProcessToxicThreadQueue: 'process admin toxic thread',
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
