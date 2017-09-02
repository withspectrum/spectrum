// @flow

// counts for processing
// the thread must have at least # total messages
export const MIN_TOTAL_MESSAGE_COUNT = 1;
// # of the total messages must have been sent in the past week
export const MIN_NEW_MESSAGE_COUNT = 1;
// # only show the top # threads per channel
export const MAX_THREAD_COUNT_PER_CHANNEL = 10;
// don't send the digest if the email will have less than # total threads to show
export const MIN_THREADS_REQUIRED_FOR_DIGEST = 1;
// cap the digest at # threads
export const MAX_THREAD_COUNT_PER_DIGEST = 10;
// upsell communities to join if the user has joined less than # communities
export const COMMUNITY_UPSELL_THRESHOLD = 5;

// generate a score for each thread based on the total number of messages and number of new messages
// new messages rank higher in order to devalue old threads that have a large amount of old messages (like pinned posts)
// the end weekly digest will have threads sorted by the weight of (TOTAL * WEIGHT) + (NEW * WEIGHT)
export const TOTAL_MESSAGE_COUNT_WEIGHT = 0.1;
export const NEW_MESSAGE_COUNT_WEIGHT = 1.5;

/*
  Example weighting:
  A thread with 150 messages, where 5 are new this week: 22.5
  A thread with 10 total messages, where all 10 are new this week: 16
  A thread with 25 total messages, where 10 are old and 15 are new this week: 25
*/

// queues
export const SEND_WEEKLY_DIGEST_EMAIL = 'send weekly digest email';
