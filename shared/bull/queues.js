// @flow
// NOTE: This file needs to be CommonJS (require/module.exports) instead of ES modules
// so that import { queueName } from 'queues' works!
const createQueue = require('shared/bull/create-queue.js');
import type { Queues } from './types';
const EventEmitter = require('events');

import {
  SEND_NEW_DIRECT_MESSAGE_EMAIL,
  SEND_NEW_MESSAGE_EMAIL,
  SEND_NEW_MENTION_MESSAGE_EMAIL,
  SEND_NEW_MENTION_THREAD_EMAIL,
  SEND_PRIVATE_CHANNEL_REQUEST_SENT_EMAIL,
  SEND_PRIVATE_CHANNEL_REQUEST_APPROVED_EMAIL,
  SEND_PRIVATE_COMMUNITY_REQUEST_SENT_EMAIL,
  SEND_PRIVATE_COMMUNITY_REQUEST_APPROVED_EMAIL,
  SEND_THREAD_CREATED_NOTIFICATION_EMAIL,
  SEND_ADMIN_TOXIC_MESSAGE_EMAIL,
  SEND_ADMIN_SLACK_IMPORT_PROCESSED_EMAIL,
  SEND_ADMIN_USER_SPAMMING_THREADS_NOTIFICATION_EMAIL,
  SEND_ADMIN_COMMUNITY_CREATED_EMAIL,
  SEND_ADMIN_USER_REPORTED_EMAIL,
  SEND_ADMINISTRATOR_EMAIL_VALIDATION_EMAIL,
  SEND_EMAIL_VALIDATION_EMAIL,
  SEND_NEW_COMMUNITY_WELCOME_EMAIL,
  SEND_NEW_USER_WELCOME_EMAIL,
  SEND_DIGEST_EMAIL,
  SEND_ACTIVE_COMMUNITY_ADMIN_REPORT_EMAIL,
  SENDGRID_WEBHOOK_EVENT,
} from 'hermes/queues/constants';

import {
  MENTION_NOTIFICATION,
  THREAD_NOTIFICATION,
  PROCESS_ADMIN_TOXIC_MESSAGE,
  COMMUNITY_NOTIFICATION,
  PROCESS_ADMIN_TOXIC_THREAD,
  TRACK_USER_LAST_SEEN,
  REACTION_NOTIFICATION,
  THREAD_REACTION_NOTIFICATION,
  PRIVATE_CHANNEL_REQUEST_SENT,
  PRIVATE_CHANNEL_REQUEST_APPROVED,
  PRIVATE_COMMUNITY_REQUEST_SENT,
  PRIVATE_COMMUNITY_REQUEST_APPROVED,
  COMMUNITY_INVITE_NOTIFICATION,
  CHANNEL_NOTIFICATION,
  DIRECT_MESSAGE_NOTIFICATION,
  MESSAGE_NOTIFICATION,
  SEND_PUSH_NOTIFICATIONS,
  SLACK_IMPORT,
  SEND_SLACK_INVITIATIONS,
} from 'athena/queues/constants';

import { SEARCH_INDEXING_EVENT } from 'vulcan/queues/constants';

import {
  PROCESS_REPUTATION_EVENT,
  CALCULATE_THREAD_SCORE,
} from 'mercury/constants';

import {
  PROCESS_INDIVIDUAL_DIGEST,
  PROCESS_WEEKLY_DIGEST_EMAIL,
  PROCESS_DAILY_DIGEST_EMAIL,
  PROCESS_DAILY_CORE_METRICS,
  PROCESS_ACTIVE_COMMUNITY_ADMIN_REPORT,
  PROCESS_REMOVE_SEEN_USERS_NOTIFICATIONS,
  PROCESS_DATABASE_BACKUP,
  PROCESS_OFFSITE_BACKUP,
} from 'chronos/queues/constants';

// Normalize our (inconsistent) queue names to a set of JS compatible names
exports.QUEUE_NAMES = {
  // athena - notifications
  sendThreadNotificationQueue: THREAD_NOTIFICATION,
  sendCommunityNotificationQueue: COMMUNITY_NOTIFICATION,
  trackUserThreadLastSeenQueue: TRACK_USER_LAST_SEEN,
  sendReactionNotificationQueue: REACTION_NOTIFICATION,
  sendThreadReactionNotificationQueue: THREAD_REACTION_NOTIFICATION,
  sendPrivateChannelRequestQueue: PRIVATE_CHANNEL_REQUEST_SENT,
  sendPrivateChannelRequestApprovedQueue: PRIVATE_CHANNEL_REQUEST_APPROVED,
  sendPrivateCommunityRequestQueue: PRIVATE_COMMUNITY_REQUEST_SENT,
  sendPrivateCommunityRequestApprovedQueue: PRIVATE_COMMUNITY_REQUEST_APPROVED,
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
  sendNewMessageEmailQueue: SEND_NEW_MESSAGE_EMAIL,
  bufferNewMessageEmailQueue: 'buffer new message email queue',
  sendNewDirectMessageEmailQueue: SEND_NEW_DIRECT_MESSAGE_EMAIL,
  sendNewMentionMessageEmailQueue: SEND_NEW_MENTION_MESSAGE_EMAIL,
  sendNewMentionThreadEmailQueue: SEND_NEW_MENTION_THREAD_EMAIL,
  sendPrivateChannelRequestEmailQueue: SEND_PRIVATE_CHANNEL_REQUEST_SENT_EMAIL,
  sendPrivateChannelRequestApprovedEmailQueue: SEND_PRIVATE_CHANNEL_REQUEST_APPROVED_EMAIL,
  sendPrivateCommunityRequestEmailQueue: SEND_PRIVATE_COMMUNITY_REQUEST_SENT_EMAIL,
  sendPrivateCommunityRequestApprovedEmailQueue: SEND_PRIVATE_COMMUNITY_REQUEST_APPROVED_EMAIL,
  sendThreadCreatedNotificationEmailQueue: SEND_THREAD_CREATED_NOTIFICATION_EMAIL,
  sendDigestEmailQueue: SEND_DIGEST_EMAIL,
  sendgridEventQueue: SENDGRID_WEBHOOK_EVENT,

  // mercury - reputation
  processReputationEventQueue: PROCESS_REPUTATION_EVENT,
  calculateThreadScoreQueue: CALCULATE_THREAD_SCORE,

  // vulcan
  searchQueue: SEARCH_INDEXING_EVENT,

  // admin
  _adminSendCommunityCreatedEmailQueue: SEND_ADMIN_COMMUNITY_CREATED_EMAIL,
  _adminProcessToxicMessageQueue: PROCESS_ADMIN_TOXIC_MESSAGE,
  _adminProcessToxicThreadQueue: PROCESS_ADMIN_TOXIC_THREAD,
  _adminProcessSlackImportQueue: SEND_ADMIN_SLACK_IMPORT_PROCESSED_EMAIL,
  _adminSendToxicContentEmailQueue: SEND_ADMIN_TOXIC_MESSAGE_EMAIL,
  _adminProcessUserSpammingThreadsQueue: SEND_ADMIN_USER_SPAMMING_THREADS_NOTIFICATION_EMAIL,
  _adminProcessUserReportedQueue: SEND_ADMIN_USER_REPORTED_EMAIL,
  _adminSendActiveCommunityReportEmailQueue: SEND_ACTIVE_COMMUNITY_ADMIN_REPORT_EMAIL,

  // chronos
  weeklyDigestQueue: PROCESS_WEEKLY_DIGEST_EMAIL,
  dailyDigestQueue: PROCESS_DAILY_DIGEST_EMAIL,
  processIndividualDigestQueue: PROCESS_INDIVIDUAL_DIGEST,
  dailyCoreMetricsQueue: PROCESS_DAILY_CORE_METRICS,
  activeCommunityReportQueue: PROCESS_ACTIVE_COMMUNITY_ADMIN_REPORT,
  removeSeenUsersNotificationsQueue: PROCESS_REMOVE_SEEN_USERS_NOTIFICATIONS,
  databaseBackupQueue: PROCESS_DATABASE_BACKUP,
  offsiteBackupQueue: PROCESS_OFFSITE_BACKUP,
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
