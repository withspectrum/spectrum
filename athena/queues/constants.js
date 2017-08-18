// @flow
// A constant time buffer that determines the range in which we bundle notifications
export const TIME_BUFFER = 1800000; // 30 minutes
// A list of queue IDs so we don't accidentally mismatch the string constant
export const THREAD_MESSAGE_NOTIFICATION = 'thread message notification';
export const DIRECT_MESSAGE_NOTIFICATION = 'direct message notification';
export const REACTION_NOTIFICATION = 'reaction notification';
export const CHANNEL_NOTIFICATION = 'channel notification';
export const COMMUNITY_NOTIFICATION = 'community notification';
export const THREAD_NOTIFICATION = 'thread notification';
export const COMMUNITY_INVITE_NOTIFICATION = 'community invite notification';
export const SEND_COMMUNITY_INVITE_EMAIL = 'send community invite email';
export const SLACK_IMPORT = 'slack import';
export const SEND_NEW_MESSAGE_EMAIL = 'send new message email';
export const COMMUNITY_INVOICE_PAID_NOTIFICATION =
  'community invoice paid notification';
export const SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL =
  'send community invoice receipt email';
export const SEND_THREAD_CREATED_NOTIFICATION_EMAIL =
  'send thread created notification email';
