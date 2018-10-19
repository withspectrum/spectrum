// @flow
// A constant time buffer that determines the range in which we bundle notifications
export const TIME_BUFFER = 1800000; // 30 minutes
// A list of queue IDs so we don't accidentally mismatch the string constant

// user generated notifications
export const MESSAGE_NOTIFICATION = 'message notification';
export const MENTION_NOTIFICATION = 'mention notification';
export const DIRECT_MESSAGE_NOTIFICATION = 'direct message notification';
export const REACTION_NOTIFICATION = 'reaction notification';
export const THREAD_REACTION_NOTIFICATION = 'thread reaction notification';
export const CHANNEL_NOTIFICATION = 'channel notification';
export const COMMUNITY_NOTIFICATION = 'community notification';
export const THREAD_NOTIFICATION = 'thread notification';
export const COMMUNITY_INVITE_NOTIFICATION = 'community invite notification';
export const SEND_COMMUNITY_INVITE_EMAIL = 'send community invite email';
export const SLACK_IMPORT = 'slack import';
export const SEND_THREAD_CREATED_NOTIFICATION_EMAIL =
  'send thread created notification email';
export const PROCESS_ADMIN_TOXIC_MESSAGE = 'process admin toxic message';
export const PROCESS_ADMIN_TOXIC_THREAD = 'process admin toxic thread';
export const PRIVATE_CHANNEL_REQUEST_SENT = 'private channel request sent';
export const PRIVATE_CHANNEL_REQUEST_APPROVED =
  'private channel request approved';
export const PRIVATE_COMMUNITY_REQUEST_SENT = 'private community request sent';
export const PRIVATE_COMMUNITY_REQUEST_APPROVED =
  'private community request approved';
export const SEND_PUSH_NOTIFICATIONS = 'push notifications';
export const SEND_SLACK_INVITIATIONS = 'send slack invitations';

export const TRACK_USER_LAST_SEEN = 'track user thread last seen';
