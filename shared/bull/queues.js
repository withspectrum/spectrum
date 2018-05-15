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
  PROCESS_STRIPE_CARD_EXPIRING_WARNING,
} from 'pluto/queues/constants';

import {
  SEND_COMMUNITY_PAYMENT_SUCCEEDED_EMAIL,
  SEND_COMMUNITY_PAYMENT_FAILED_EMAIL,
  SEND_COMMUNITY_CARD_EXPIRING_WARNING_EMAIL,
  SEND_NEW_DIRECT_MESSAGE_EMAIL,
  SEND_NEW_MESSAGE_EMAIL,
  SEND_NEW_MENTION_MESSAGE_EMAIL,
  SEND_NEW_MENTION_THREAD_EMAIL,
  SEND_PRIVATE_CHANNEL_REQUEST_SENT_EMAIL,
  SEND_PRIVATE_CHANNEL_REQUEST_APPROVED_EMAIL,
  SEND_THREAD_CREATED_NOTIFICATION_EMAIL,
  SEND_ADMIN_TOXIC_MESSAGE_EMAIL,
  SEND_ADMIN_SLACK_IMPORT_PROCESSED_EMAIL,
  SEND_ADMIN_USER_SPAMMING_THREADS_NOTIFICATION_EMAIL,
  SEND_ADMIN_COMMUNITY_CREATED_EMAIL,
  SEND_ADMINISTRATOR_EMAIL_VALIDATION_EMAIL,
  SEND_EMAIL_VALIDATION_EMAIL,
  SEND_NEW_COMMUNITY_WELCOME_EMAIL,
  SEND_NEW_USER_WELCOME_EMAIL,
} from 'hermes/queues/constants';

import {
  MENTION_NOTIFICATION,
  THREAD_NOTIFICATION,
  PROCESS_ADMIN_TOXIC_MESSAGE,
  COMMUNITY_NOTIFICATION,
  PROCESS_ADMIN_TOXIC_THREAD,
  TRACK_USER_LAST_SEEN,
  PRO_INVOICE_PAID_NOTIFICATION,
  COMMUNITY_INVOICE_PAID_NOTIFICATION,
  REACTION_NOTIFICATION,
  PRIVATE_CHANNEL_REQUEST_SENT,
  PRIVATE_CHANNEL_REQUEST_APPROVED,
  COMMUNITY_INVITE_NOTIFICATION,
  CHANNEL_NOTIFICATION,
  DIRECT_MESSAGE_NOTIFICATION,
  MESSAGE_NOTIFICATION,
  SEND_PUSH_NOTIFICATIONS,
  SLACK_IMPORT,
  SEND_SLACK_INVITIATIONS,
} from 'athena/queues/constants';

import {
  TRACK_ANALYTICS,
  IDENTIFY_ANALYTICS,
} from 'analytics/queues/constants';

import { PROCESS_REPUTATION_EVENT } from 'mercury/constants';

// Normalize our (inconsistent) queue names to a set of JS compatible names
exports.QUEUE_NAMES = {
  // athena - notifications
  sendThreadNotificationQueue: THREAD_NOTIFICATION,
  sendCommunityNotificationQueue: COMMUNITY_NOTIFICATION,
  trackUserThreadLastSeenQueue: TRACK_USER_LAST_SEEN,
  sendProInvoicePaidNotificationQueue: PRO_INVOICE_PAID_NOTIFICATION,
  sendCommunityInvoicePaidNotificationQueue: COMMUNITY_INVOICE_PAID_NOTIFICATION,
  sendReactionNotificationQueue: REACTION_NOTIFICATION,
  sendPrivateChannelRequestQueue: PRIVATE_CHANNEL_REQUEST_SENT,
  sendPrivateChannelRequestApprovedQueue: PRIVATE_CHANNEL_REQUEST_APPROVED,
  sendPrivateChannelInviteNotificationQueue:
    'private channel invite notification',
  sendCommunityInviteNotificationQueue: COMMUNITY_INVITE_NOTIFICATION,
  sendChannelNotificationQueue: CHANNEL_NOTIFICATION,
  sendDirectMessageNotificationQueue: DIRECT_MESSAGE_NOTIFICATION,
  sendMessageNotificationQueue: MESSAGE_NOTIFICATION,
  sendMentionNotificationQueue: MENTION_NOTIFICATION,
  sendNotificationAsPushQueue: SEND_PUSH_NOTIFICATIONS,
  slackImportQueue: SLACK_IMPORT,
  sendSlackInvitationsQueue: SEND_SLACK_INVITIATIONS,

  // hermes - emails
  sendNewUserWelcomeEmailQueue: SEND_NEW_USER_WELCOME_EMAIL,
  sendNewCommunityWelcomeEmailQueue: SEND_NEW_COMMUNITY_WELCOME_EMAIL,
  sendEmailValidationEmailQueue: SEND_EMAIL_VALIDATION_EMAIL,
  sendAdministratorEmailValidationEmailQueue: SEND_ADMINISTRATOR_EMAIL_VALIDATION_EMAIL,
  sendCommunityPaymentSucceededEmailQueue: SEND_COMMUNITY_PAYMENT_SUCCEEDED_EMAIL,
  sendCommunityPaymentFailedEmailQueue: SEND_COMMUNITY_PAYMENT_FAILED_EMAIL,
  sendCommunityCardExpiringWarningEmailQueue: SEND_COMMUNITY_CARD_EXPIRING_WARNING_EMAIL,
  sendNewMessageEmailQueue: SEND_NEW_MESSAGE_EMAIL,
  bufferNewMessageEmailQueue: 'buffer new message email queue',
  sendNewDirectMessageEmailQueue: SEND_NEW_DIRECT_MESSAGE_EMAIL,
  sendNewMentionMessageEmailQueue: SEND_NEW_MENTION_MESSAGE_EMAIL,
  sendNewMentionThreadEmailQueue: SEND_NEW_MENTION_THREAD_EMAIL,
  sendPrivateChannelRequestEmailQueue: SEND_PRIVATE_CHANNEL_REQUEST_SENT_EMAIL,
  sendPrivateChannelRequestApprovedEmailQueue: SEND_PRIVATE_CHANNEL_REQUEST_APPROVED_EMAIL,
  sendThreadCreatedNotificationEmailQueue: SEND_THREAD_CREATED_NOTIFICATION_EMAIL,

  // mercury - reputation
  processReputationEventQueue: PROCESS_REPUTATION_EVENT,

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
  stripeCardExpiringWarningQueue: PROCESS_STRIPE_CARD_EXPIRING_WARNING,

  // analytics
  trackQueue: TRACK_ANALYTICS,
  identifyQueue: IDENTIFY_ANALYTICS,

  // admin
  _adminSendCommunityCreatedEmailQueue: SEND_ADMIN_COMMUNITY_CREATED_EMAIL,
  _adminProcessToxicMessageQueue: PROCESS_ADMIN_TOXIC_MESSAGE,
  _adminProcessToxicThreadQueue: PROCESS_ADMIN_TOXIC_THREAD,
  _adminProcessSlackImportQueue: SEND_ADMIN_SLACK_IMPORT_PROCESSED_EMAIL,
  _adminSendToxicContentEmailQueue: SEND_ADMIN_TOXIC_MESSAGE_EMAIL,
  _adminProcessUserSpammingThreadsQueue: SEND_ADMIN_USER_SPAMMING_THREADS_NOTIFICATION_EMAIL,
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
