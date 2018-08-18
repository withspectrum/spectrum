// @flow
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
  age: days => Math.sqrt(days) * -5,
  lastActive: days => Math.sqrt(days) * -10,
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
