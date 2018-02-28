// @flow
import {
  getUsers,
  getUsersThreadCount,
  getUsersByUsername,
  getEverything,
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
import type { PaginationOptions } from '../utils/paginate-arrays';

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
    cacheExpiryTime: 0,
    getCacheKeyFromResult: result => [result.userId, result.communityId],
  }
);

export const __createUserTotalReputationLoader = createLoader(
  users => getUsersTotalReputation(users),
  { getCacheKeyFromResult: 'userId' }
);

export const __createUserPermissionsInChannelLoader = createLoader(
  usersChannels => getUsersPermissionsInChannels(usersChannels),
  {
    cacheExpiryTime: 0,
    getCacheKeyFromResult: result => [result.userId, result.channelId],
  }
);

export const __createUserThreadNotificationStatusLoader = createLoader(
  usersThreads => getThreadsNotificationStatusForUsers(usersThreads),
  {
    getCacheKeyFromResult: result => [result.userId, result.threadId],
  }
);

type EverythingLoaderArgs = [string, PaginationOptions];

export const __createUserEverythingLoader = createLoader(
  (input: Array<EverythingLoaderArgs>) =>
    Promise.all(input.map(args => getEverything(args[0], args[1]))),
  {
    getCacheKeyFromInput: (input: EverythingLoaderArgs) => input[0],
    getCacheKeyFromResult: 'userId',
    cacheExpiryTime: FIVE_MINUTES,
  }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
