// @flow
// A constant time buffer that determines the range in which we bundle notifications
export const TIME_BUFFER = 1800000; // 30 minutes
// A list of queue IDs so we don't accidentally mismatch the string constant
export const MESSAGE_NOTIFICATION = 'message notification';
export const REACTION_NOTIFICATION = 'reaction notification';
export const CHANNEL_NOTIFICATION = 'channel notification';
export const COMMUNITY_NOTIFICATION = 'community notification';
export const THREAD_NOTIFICATION = 'thread notification';
export const SLACK_IMPORT = 'slack import';
