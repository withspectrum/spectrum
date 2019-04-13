// @flow
// Process jobs to calculate a threads score based on participant count, message count, like count and age.
import {
  getThread,
  getParticipantCount,
  getMessageCount,
  storeThreadScore,
  getParticipantCountByTime,
  getReactionCountByTime,
} from '../models/thread';
import type { Job, CalculateThreadScoreJobData } from 'shared/bull/types';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
// NOTE: We use Math.floor to make sure it goes from 0 to 1 once it crosses 24h, not when it crosses 12h
const getAgeInDays = (date: Date) =>
  Math.floor((Date.now() - new Date(date).getTime()) / MS_PER_DAY);

const timeRanges = {
  hourly: { start: 3600, end: 0 },
  daily: { start: 86400, end: 3600 },
  weekly: { start: 604800, end: 86400 },
  rest: { start: Date.now(), end: 604800 },
};
const weighTimeRange = {
  hourly: num => num * 10,
  daily: num => num * 5,
  weekly: num => num * 2,
  rest: num => num * 1,
};

export default async (job: Job<CalculateThreadScoreJobData>) => {
  const { threadId } = job.data;

  const [
    thread,
    hourlyParticipantCount,
    dailyParticipantCount,
    weeklyParticipantCount,
    remainingParticipantCount,
    hourlyReactionCount,
    dailyReactionCount,
    weeklyReactionCount,
    remainingReactionCount,
    messageCount,
  ] = await Promise.all([
    getThread(threadId),
    getParticipantCountByTime(threadId, 'hourly'),
    getParticipantCountByTime(threadId, 'daily'),
    getParticipantCountByTime(threadId, 'weekly'),
    getParticipantCountByTime(threadId, 'rest'),
    getReactionCountByTime(threadId, 'hourly'),
    getReactionCountByTime(threadId, 'daily'),
    getReactionCountByTime(threadId, 'weekly'),
    getReactionCountByTime(threadId, 'rest'),
    getMessageCount(threadId),
  ]);

  const score =
    // We use Math.exp(+1) * 5 on the hourly participant count so that threads
    // that have active conversations right now will rise to the top.
    // It goes: 36 (1st participant), 100 (2nd participant), 272 (3rd participant), 742 (4th participant), etc.
    // That way as soon as 2+ people start talking in a thread right now it shoots to the top +1
    Math.exp(hourlyParticipantCount + 1) * 5 +
    // We Math.exp * 2 the daily participant count so that threads that were active over a day rise to the top
    // This goes: 5, 14, 40, 109, etc.
    Math.exp(dailyParticipantCount) * 2 +
    // We * 10 the weekly and * 5 the remaining participant count because participants should carry more weight than messages or likes
    weeklyParticipantCount * 10 +
    remainingParticipantCount * 5 +
    // We use Math.exp on the hourly reaction count so that threads that are liked a ton right now (5+ likes in the last hour) shoot to the top
    // This will go 2, 7, 20, 54, 148, 403, 1096,...
    Math.exp(hourlyReactionCount) +
    // We use Math.exp(-10) on the daily reaction count so that threads that have been liked 15+ times in the past day shoot to the top
    Math.exp(dailyReactionCount - 10) +
    // We use Math.exp(-30) on the daily reaction count so that threads that have been liked 35+ times in the past  week shoot to the top
    Math.exp(weeklyReactionCount - 35) +
    // We *1 the message count since they act as the "baseline" of activity,
    // and * 0.2 the reactionCount since likes shouldn't matter as much as
    // messages
    messageCount * 1 +
    remainingReactionCount * 0.2 +
    // A thread that's old should have a harder time shooting to the top,
    // so we subtract the age in days * 10
    getAgeInDays(thread.createdAt) * -10;

  return storeThreadScore(threadId, score);
};
