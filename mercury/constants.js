// @flow

// queues
export const PROCESS_REPUTATION_EVENT = 'process reputation event';

// reputation event types
export const THREAD_CREATED = 'thread created';
export const THREAD_DELETED = 'thread deleted';
export const THREAD_DELETED_BY_MODERATION = 'thread deleted by moderation';
export const MESSAGE_CREATED = 'message created';
export const REACTION_CREATED = 'reaction created';
export const REACTION_DELETED = 'reaction deleted';

// scores
export const THREAD_CREATED_SCORE = 100;
export const THREAD_DELETED_SCORE = -100;
export const THREAD_DELETED_BY_MODERATION_SCORE = 50;
export const MESSAGE_CREATED_SCORE = 5;
export const MESSAGE_CREATED_POST_AUTHOR_SCORE = 2;
export const REACTION_CREATED_SCORE = 10;
export const REACTION_CREATED_POST_AUTHOR_SCORE = 1;
export const REACTION_DELETED_SCORE = -10;
export const REACTION_DELETED_POST_AUTHOR_SCORE = -1;
