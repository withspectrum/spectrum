// @flow
// NOTE: This file needs to be CommonJS (require/module.exports) instead of ES modules
// so that import { queueName } from 'queues' works!
const createQueue = require('shared/bull/create-queue.js');
const EventEmitter = require('events');
import type { DBCommunity } from 'shared/types';
import {
  PROCESS_STRIPE_SUBSCRIPTION_WEBHOOK_EVENT,
  PROCESS_STRIPE_SOURCE_WEBHOOK_EVENT,
  PROCESS_STRIPE_CUSTOMER_WEBHOOK_EVENT,
  PROCESS_STRIPE_CHARGE_WEBHOOK_EVENT,
  PROCESS_STRIPE_INVOICE_WEBHOOK_EVENT,
  PROCESS_STRIPE_COMMUNITY_ANALYTICS_ADDED,
  PROCESS_STRIPE_COMMUNITY_ANALYTICS_REMOVED,
  PROCESS_STRIPE_COMMUNITY_MODERATOR_ADDED,
  PROCESS_STRIPE_COMMUNITY_MODERATOR_REMOVED,
  PROCESS_STRIPE_COMMUNITY_PRIORITY_SUPPORT_ADDED,
  PROCESS_STRIPE_COMMUNITY_PRIORITY_SUPPORT_REMOVED,
  PROCESS_STRIPE_COMMUNITY_PRIVATE_CHANNEL_ADDED,
  PROCESS_STRIPE_COMMUNITY_PRIVATE_CHANNEL_REMOVED,
  PROCESS_STRIPE_COMMUNITY_ADMINISTRATOR_EMAIL_CHANGED,
  PROCESS_STRIPE_COMMUNITY_CREATED,
  PROCESS_STRIPE_COMMUNITY_DELETED,
  PROCESS_STRIPE_COMMUNITY_EDITED,
} from 'pluto/queues/constants';

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
  sendAdministratorEmailValidationEmailQueue: BullQueue<{
    email: string,
    userId: string,
    communityId: string,
    community: DBCommunity,
  }>,
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
  stripeChargeWebhookEventQueue: BullQueue<{ record: Object }>,
  stripeCustomerWebhookEventQueue: BullQueue<{ record: Object }>,
  stripeSourceWebhookEventQueue: BullQueue<{ record: Object }>,
  stripeInvoiceWebhookEventQueue: BullQueue<{ record: Object }>,
  stripeSubscriptionWebhookEventQueue: BullQueue<{ record: Object }>,

  stripeCommunityAdministratorEmailChangedQueue: BullQueue<{
    communityId: string,
  }>,
  stripeCommunityAnalyticsAddedQueue: BullQueue<{ communityId: string }>,
  stripeCommunityAnalyticsRemovedQueue: BullQueue<{ communityId: string }>,
  stripeCommunityCreatedQueue: BullQueue<{ communityId: string }>,
  stripeCommunityDeletedQueue: BullQueue<{ communityId: string }>,
  stripeCommunityEditedQueue: BullQueue<{ communityId: string }>,
  stripeCommunityModeratorAddedQueue: BullQueue<{ communityId: string }>,
  stripeCommunityModeratorRemovedQueue: BullQueue<{ communityId: string }>,
  stripeCommunityPrioritySupportAddedQueue: BullQueue<{ communityId: string }>,
  stripeCommunityPrioritySupportRemovedQueue: BullQueue<{
    communityId: string,
  }>,
  stripeCommunityPrivateChannelAddedQueue: BullQueue<{ communityId: string }>,
  stripeCommunityPrivateChannelRemovedQueue: BullQueue<{ communityId: string }>,

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
  sendAdministratorEmailValidationEmailQueue:
    'send administrator email validation email',
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

  stripeChargeWebhookEventQueue: PROCESS_STRIPE_CHARGE_WEBHOOK_EVENT,
  stripeCustomerWebhookEventQueue: PROCESS_STRIPE_CUSTOMER_WEBHOOK_EVENT,
  stripeSubscriptionWebhookEventQueue: PROCESS_STRIPE_SUBSCRIPTION_WEBHOOK_EVENT,
  stripeInvoiceWebhookEventQueue: PROCESS_STRIPE_INVOICE_WEBHOOK_EVENT,
  stripeSourceWebhookEventQueue: PROCESS_STRIPE_SOURCE_WEBHOOK_EVENT,
  stripeCommunityAdministratorEmailChangedQueue: PROCESS_STRIPE_COMMUNITY_ADMINISTRATOR_EMAIL_CHANGED,
  stripeCommunityAnalyticsAddedQueue: PROCESS_STRIPE_COMMUNITY_ANALYTICS_ADDED,
  stripeCommunityAnalyticsRemovedQueue: PROCESS_STRIPE_COMMUNITY_ANALYTICS_REMOVED,
  stripeCommunityCreatedQueue: PROCESS_STRIPE_COMMUNITY_CREATED,
  stripeCommunityDeletedQueue: PROCESS_STRIPE_COMMUNITY_DELETED,
  stripeCommunityEditedQueue: PROCESS_STRIPE_COMMUNITY_EDITED,
  stripeCommunityModeratorAddedQueue: PROCESS_STRIPE_COMMUNITY_MODERATOR_ADDED,
  stripeCommunityModeratorRemovedQueue: PROCESS_STRIPE_COMMUNITY_MODERATOR_REMOVED,
  stripeCommunityPrioritySupportAddedQueue: PROCESS_STRIPE_COMMUNITY_PRIORITY_SUPPORT_ADDED,
  stripeCommunityPrioritySupportRemovedQueue: PROCESS_STRIPE_COMMUNITY_PRIORITY_SUPPORT_REMOVED,
  stripeCommunityPrivateChannelAddedQueue: PROCESS_STRIPE_COMMUNITY_PRIVATE_CHANNEL_ADDED,
  stripeCommunityPrivateChannelRemovedQueue: PROCESS_STRIPE_COMMUNITY_PRIVATE_CHANNEL_REMOVED,

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
