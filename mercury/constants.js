// @flow

// queues
export const PROCESS_REPUTATION_EVENT = 'process reputation event';

// reputation event types
export const THREAD_CREATED = 'thread created';
export const THREAD_DELETED = 'thread deleted';
export const THREAD_DELETED_BY_MODERATION = 'thread deleted by moderation';
export const MESSAGE_CREATED = 'message created';
export const MESSAGE_CREATED_POST_AUTHOR_BONUS =
  'message created post author bonus';
export const MESSAGE_DELETED = 'message deleted';
export const MESSAGE_DELETED_POST_AUTHOR_BONUS =
  'message deleted post author bonus';
export const REACTION_CREATED = 'reaction created';
export const REACTION_CREATED_POST_AUTHOR_BONUS =
  'reaction created post author bonus';
export const REACTION_DELETED = 'reaction deleted';
export const REACTION_DELETED_POST_AUTHOR_BONUS =
  'reaction deleted post author bonus';

// scores
export const THREAD_CREATED_SCORE = 20;
export const THREAD_DELETED_SCORE = -20;
export const THREAD_DELETED_BY_MODERATION_SCORE = 20;
export const MESSAGE_CREATED_SCORE = 2;
export const MESSAGE_CREATED_POST_AUTHOR_SCORE = 2;
export const MESSAGE_DELETED_POST_AUTHOR_SCORE = -2;
// occurs when a post is deleted - we treat each child message as being deleted
export const MESSAGE_DELETED_SCORE = -2;
export const REACTION_CREATED_SCORE = 30;
export const REACTION_CREATED_POST_AUTHOR_SCORE = 2;
export const REACTION_DELETED_SCORE = -30;
export const REACTION_DELETED_POST_AUTHOR_SCORE = -2;
