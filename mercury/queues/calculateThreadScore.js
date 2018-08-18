// @flow
// Process jobs to calculate a threads score based on participant count, message count, like count and age.
import {
  getThread,
  getParticipantCount,
  getMessageCount,
  getReactionCount,
  storeThreadScore,
} from '../models/thread';
import type { Job, CalculateThreadScoreJobData } from 'shared/bull/types';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const weigh = {
  participants: p => p * 10,
  messages: m => m * 1,
  reactions: r => r * 0.2,
  // NOTE: We Math.sqrt the days to make the age decay less drastic since we don't really care how old a thread is if it's really active right now
  // It goes from -2.5 on the first day to -25 on the 100th day
  age: days => Math.sqrt(days) * -2.5,
  // NOTE: We use Math.log to aggressively decay based on days sine the last activity initially, but then slow down over time
  // It goes from -35 on the first day to -230 on the 100th day since the last activity
  lastActive: days => Math.log(days + 1) * -50,
};
// NOTE: We use Math.floor to make sure it goes from 0 to 1 once it crosses 24h, not when it crosses 12h
const getAgeInDays = (date: Date) =>
  Math.floor((Date.now() - new Date(date).getTime()) / MS_PER_DAY);

export default async (job: Job<CalculateThreadScoreJobData>) => {
  const { threadId } = job.data;

  const [
    thread,
    participantCount,
    messageCount,
    reactionCount,
  ] = await Promise.all([
    getThread(threadId),
    getParticipantCount(threadId),
    getMessageCount(threadId),
    getReactionCount(threadId),
  ]);

  const score =
    weigh.participants(participantCount) +
    weigh.messages(messageCount) +
    weigh.reactions(reactionCount) +
    weigh.age(getAgeInDays(thread.createdAt)) +
    weigh.lastActive(getAgeInDays(thread.lastActive || thread.createdAt));

  return storeThreadScore(threadId, score);
};
