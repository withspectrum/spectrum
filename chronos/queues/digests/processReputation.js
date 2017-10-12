// @flow
const debug = require('debug')('chronos:queue:digest-process-reputation');
import {
  getReputationChangeInTimeframe,
  getTotalReputation,
} from '../../models/reputationEvent';
import type { User, Timeframe } from './types';

export default async (user: User, timeframe: Timeframe) => {
  const reputationGained = await getReputationChangeInTimeframe(
    user.userId,
    timeframe
  );
  const totalReputation = await getTotalReputation(user.userId);
  const hasGainedReputation = reputationGained > 0;
  const isFirstReputation = totalReputation === reputationGained;
  const reputationString = hasGainedReputation
    ? // user gained some reputation during the last timeframe range
      isFirstReputation
      ? // if the total reputation and reputation gained are the same amount, this means the user has gained their first bit of rep!
        timeframe === 'weekly'
        ? // if this is a weekly digest
          `Since last week you've gained ${reputationGained} rep! Your rep will keep growing as you start and join more conversations.`
        : `Since yesterday you've gained ${reputationGained} rep!`
      : // if the total reputation is greater than the reputation gained, it means this is an incremental amount of rep for the user
        timeframe === 'weekly'
        ? `Since last week you've gained ${reputationGained} rep. You're now sitting strong at ${totalReputation.toLocaleString()} - keep it up!`
        : `Since yesterday you've gained ${reputationGained} rep. You now have ${totalReputation.toLocaleString()} total rep across all of your communities - well done!`
    : // has not gained any reputation
      `You've been a little quiet this week – this week try joining some conversations, your community wants to hear from you!`;

  return reputationString;
};
