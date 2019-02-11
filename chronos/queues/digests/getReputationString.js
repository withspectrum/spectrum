// @flow
import {
  getReputationChangeInTimeframe,
  getTotalReputation,
} from '../../models/reputationEvent';
import type { Timeframe } from 'chronos/types';

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
  if (hasGainedReputation) {
    reputationString = `You gained ${reputationGained} reputation ${during}.`;
  } else {
    reputationString = `You didn’t gain any reputation ${during}.`;
  }

  if (isFirstReputation) {
    reputationString += ` Reputation is an indicator of how active and constructive you are across all your communities. The more great conversations you start or join, the more reputation you will have.`;
  } else {
    reputationString += ` You have a total of ${totalReputation} reputation across all of your communities${
      hasGainedReputation ? ' - well done!' : '.'
    }`;
  }

  return reputationString;
};

export default async (userId: string, timeframe: Timeframe) => {
  const [reputationGained, totalReputation] = await Promise.all([
    getReputationChangeInTimeframe(userId, timeframe),
    getTotalReputation(userId),
  ]);

  return getReputationString({
    totalReputation: totalReputation.toLocaleString().toString(),
    reputationGained: reputationGained.toLocaleString().toString(),
    timeframe,
  });
};
