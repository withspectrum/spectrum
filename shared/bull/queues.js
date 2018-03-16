// @flow
// NOTE: This file needs to be CommonJS (require/module.exports) instead of ES modules
// so that import { queueName } from 'queues' works!
const createQueue = require('shared/bull/create-queue.js');
import type { Queues } from './types';
const EventEmitter = require('events');
import {
  PROCESS_STRIPE_SUBSCRIPTION_WEBHOOK_EVENT,
  PROCESS_STRIPE_SOURCE_WEBHOOK_EVENT,
  PROCESS_STRIPE_CUSTOMER_WEBHOOK_EVENT,
  PROCESS_STRIPE_CHARGE_WEBHOOK_EVENT,
  PROCESS_STRIPE_INVOICE_WEBHOOK_EVENT,
  PROCESS_STRIPE_DISCOUNT_WEBHOOK_EVENT,
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
  PROCESS_STRIPE_COMMUNITY_OSS_STATUS_ACTIVATED,
  PROCESS_STRIPE_COMMUNITY_OSS_STATUS_ENABLED,
  PROCESS_STRIPE_COMMUNITY_OSS_STATUS_DISABLED,
  PROCESS_STRIPE_PAYMENT_SUCCEEDED,
  PROCESS_STRIPE_PAYMENT_FAILED,
} from 'pluto/queues/constants';

import {
  SEND_COMMUNITY_PAYMENT_SUCCEEDED_EMAIL,
  SEND_COMMUNITY_PAYMENT_FAILED_EMAIL,
  SEND_COMMUNITY_CARD_EXPIRING_WARNING_EMAIL,
} from 'hermes/queues/constants';

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
  sendAdministratorEmailValidationEmailQueue:
    'send administrator email validation email',
  sendCommunityPaymentSucceededEmailQueue: SEND_COMMUNITY_PAYMENT_SUCCEEDED_EMAIL,
  sendCommunityPaymentFailedEmailQueue: SEND_COMMUNITY_PAYMENT_FAILED_EMAIL,
  sendCommunityCardExpiringWarningEmailQueue: SEND_COMMUNITY_CARD_EXPIRING_WARNING_EMAIL,

  // mercury - reputation
  processReputationEventQueue: 'process reputation event',

  stripeChargeWebhookEventQueue: PROCESS_STRIPE_CHARGE_WEBHOOK_EVENT,
  stripeCustomerWebhookEventQueue: PROCESS_STRIPE_CUSTOMER_WEBHOOK_EVENT,
  stripeSubscriptionWebhookEventQueue: PROCESS_STRIPE_SUBSCRIPTION_WEBHOOK_EVENT,
  stripeInvoiceWebhookEventQueue: PROCESS_STRIPE_INVOICE_WEBHOOK_EVENT,
  stripeSourceWebhookEventQueue: PROCESS_STRIPE_SOURCE_WEBHOOK_EVENT,
  stripeDiscountWebhookEventQueue: PROCESS_STRIPE_DISCOUNT_WEBHOOK_EVENT,
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
  stripeCommunityOpenSourceStatusEnabledQueue: PROCESS_STRIPE_COMMUNITY_OSS_STATUS_ENABLED,
  stripeCommunityOpenSourceStatusDisabledQueue: PROCESS_STRIPE_COMMUNITY_OSS_STATUS_DISABLED,
  stripeCommunityOpenSourceStatusActivatedQueue: PROCESS_STRIPE_COMMUNITY_OSS_STATUS_ACTIVATED,
  stripePaymentSucceededQueue: PROCESS_STRIPE_PAYMENT_SUCCEEDED,
  stripePaymentFailedQueue: PROCESS_STRIPE_PAYMENT_FAILED,

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
