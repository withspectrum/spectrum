// @flow
const debug = require('debug')('chronos:queue:digest-process-reputation');
import {
  getReputationChangeInTimeframe,
  getTotalReputation,
} from '../../models/reputationEvent';
import type { User, Timeframe } from './types';

export const getReputationString = ({
  totalReputation,
  reputationGained,
  timeframe,
}: {
  timeframe: Timeframe,
  totalReputation: number,
  reputationGained: number,
}) => {
  const hasGainedReputation = reputationGained > 0;
  const isFirstReputation = totalReputation === reputationGained;
  const during = timeframe === 'weekly' ? 'last week' : 'yesterday';

  let reputationString;
  if (!hasGainedReputation) {
    reputationString = `You were a little quiet ${during} and haven't gained any reputation – join some of the conversations below, your communities would love to hear from you!`;
  } else {
    reputationString = `You gained ${reputationGained} reputation ${during}. Awesome! 😍`;
  }

  if (isFirstReputation) {
    reputationString += ` Reputation is an indicator of how active and constructive you are across all your communities. The more great conversations you start or join, the more reputation you will have!`;
  } else {
    reputationString += ` You have a total of ${totalReputation} reputation across all of your communities${
      hasGainedReputation ? ' - well done!' : '.'
    }`;
  }

  return reputationString;
};

export default async (user: User, timeframe: Timeframe) => {
  const reputationGained = await getReputationChangeInTimeframe(
    user.userId,
    timeframe
  );
  const totalReputation = await getTotalReputation(user.userId);

  return getReputationString({ totalReputation, reputationGained, timeframe });
};
