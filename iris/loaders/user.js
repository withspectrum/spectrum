// @flow
import {
  getUsers,
  getUsersThreadCount,
  getUsersByUsername,
} from '../models/user';
import { getUsersRecurringPayments } from '../models/recurringPayment';
import {
  getUsersPermissionsInCommunities,
  getUsersTotalReputation,
} from '../models/usersCommunities';
import { getUsersPermissionsInChannels } from '../models/usersChannels';
import { getThreadsNotificationStatusForUsers } from '../models/usersThreads';
import createLoader from './create-loader';
import type { Loader } from './types';

const THIRTY_MINUTES = 1800000;
const FIVE_MINUTES = 300000;

export const __createUserLoader = createLoader(users => getUsers(users));

export const __createUserByUsernameLoader = createLoader(
  users => getUsersByUsername(users),
  { getCacheKeyFromResult: 'username', cacheExpiryTime: FIVE_MINUTES }
);

export const __createUserThreadCountLoader = createLoader(
  users => getUsersThreadCount(users),
  { cacheExpiryTime: THIRTY_MINUTES }
);

export const __createUserRecurringPaymentsLoader = createLoader(
  users => getUsersRecurringPayments(users),
  { getCacheKeyFromResult: 'group' }
);

export const __createUserPermissionsInCommunityLoader = createLoader(
  usersCommunities => getUsersPermissionsInCommunities(usersCommunities),
  {
    getCacheKeyFromInput: input => input.toString(),
    getCacheKeyFromResult: result =>
      [result.userId, result.communityId].toString(),
  }
);

export const __createUserTotalReputationLoader = createLoader(
  users => getUsersTotalReputation(users),
  { getCacheKeyFromResult: 'userId' }
);

export const __createUserPermissionsInChannelLoader = createLoader(
  usersChannels => getUsersPermissionsInChannels(usersChannels),
  {
    getCacheKeyFromInput: input => input.toString(),
    getCacheKeyFromResult: result =>
      [result.userId, result.channelId].toString(),
  }
);

export const __createUserThreadNotificationStatusLoader = createLoader(
  usersThreads => getThreadsNotificationStatusForUsers(usersThreads),
  {
    getCacheKeyFromResult: result => [result.userId, result.threadId],
    cacheExpiryTime: 0,
  }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
