// @flow

// upsell communities to join if the user has joined less than # communities
export const COMMUNITY_UPSELL_THRESHOLD = 5;

// generate a score for each thread based on the total number of messages and number of new messages
// new messages rank higher in order to devalue old threads that have a large amount of old messages (like pinned posts)
// the end weekly digest will have threads sorted by the weight of (TOTAL * WEIGHT) + (NEW * WEIGHT)
export const TOTAL_MESSAGE_COUNT_WEIGHT = 0.1;
export const NEW_MESSAGE_COUNT_WEIGHT = 1.5;
export const WATERCOOLER_WEIGHT_REDUCTION = 0.5;

/*
  Example weighting:
  A thread with 150 messages, where 5 are new this week: 22.5
  A thread with 10 total messages, where all 10 are new this week: 16
  A thread with 25 total messages, where 10 are old and 15 are new this week: 25
*/

// queues
export const PROCESS_INDIVIDUAL_DIGEST = 'send individual digest email';
export const PROCESS_WEEKLY_DIGEST_EMAIL = 'process weekly digest email';
export const PROCESS_DAILY_DIGEST_EMAIL = 'process daily digest email';
export const PROCESS_DAILY_CORE_METRICS = 'process daily core metrics';
export const PROCESS_ACTIVE_COMMUNITY_ADMIN_REPORT =
  'process active community admin report';
export const PROCESS_REMOVE_SEEN_USERS_NOTIFICATIONS =
  'process remove seen usersNotifications';
export const PROCESS_DATABASE_BACKUP = 'process database backup';
export const PROCESS_OFFSITE_BACKUP = 'process offsite backup';
