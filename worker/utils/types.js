// @flow
export type EntityTypes =
  | 'message'
  | 'thread'
  | 'channel'
  | 'community'
  | 'user'
  | 'directMessageThread';

export type EventTypes =
  | 'message_created'
  | 'thread_created'
  | 'channel_created'
  | 'direct_message_thread_created'
  | 'user_joined_community'
  | 'user_requested_to_join_private_channel'
  | 'user_approved_to_join_private_channel'
  | 'thread_locked_by_owner'
  | 'thread_deleted_by_owner';
