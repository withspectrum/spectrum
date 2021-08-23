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
  SEND_ACTIVE_COMMUNITY_ADMIN_REPORT_EMAIL,
  SENDGRID_WEBHOOK_EVENT,
} from 'hermes/queues/constants';

import { SEARCH_INDEXING_EVENT } from 'vulcan/queues/constants';

// Normalize our (inconsistent) queue names to a set of JS compatible names
exports.QUEUE_NAMES = {
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
  sendgridEventQueue: SENDGRID_WEBHOOK_EVENT,

  // vulcan
  searchQueue: SEARCH_INDEXING_EVENT,

  // admin
  _adminSendCommunityCreatedEmailQueue: SEND_ADMIN_COMMUNITY_CREATED_EMAIL,
  _adminProcessSlackImportQueue: SEND_ADMIN_SLACK_IMPORT_PROCESSED_EMAIL,
  _adminSendToxicContentEmailQueue: SEND_ADMIN_TOXIC_MESSAGE_EMAIL,
  _adminProcessUserSpammingThreadsQueue: SEND_ADMIN_USER_SPAMMING_THREADS_NOTIFICATION_EMAIL,
  _adminProcessUserReportedQueue: SEND_ADMIN_USER_REPORTED_EMAIL,
  _adminSendActiveCommunityReportEmailQueue: SEND_ACTIVE_COMMUNITY_ADMIN_REPORT_EMAIL,
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
