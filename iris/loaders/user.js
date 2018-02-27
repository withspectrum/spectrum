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

export const __createUserLoader = createLoader(users => getUsers(users));

export const __createUserByUsernameLoader = createLoader(
  users => getUsersByUsername(users),
  { indexField: 'username' }
);

export const __createUserThreadCountLoader = createLoader(users =>
  getUsersThreadCount(users)
);

export const __createUserRecurringPaymentsLoader = createLoader(
  users => getUsersRecurringPayments(users),
  { indexField: 'group' }
);

export const __createUserPermissionsInCommunityLoader = createLoader(
  usersCommunities => getUsersPermissionsInCommunities(usersCommunities),
  {
    indexField: input => `${input.userId}|${input.communityId}`,
    cacheKeyFn: key => (Array.isArray(key) ? `${key[0]}|${key[1]}` : key),
  }
);

export const __createUserTotalReputationLoader = createLoader(
  users => getUsersTotalReputation(users),
  { indexField: 'userId' }
);

export const __createUserPermissionsInChannelLoader = createLoader(
  usersChannels => getUsersPermissionsInChannels(usersChannels),
  {
    indexField: input => `${input.userId}|${input.channelId}`,
    cacheKeyFn: key => (Array.isArray(key) ? `${key[0]}|${key[1]}` : key),
  }
);

export const __createUserThreadNotificationStatusLoader = createLoader(
  usersThreads => getThreadsNotificationStatusForUsers(usersThreads),
  {
    indexField: input => `${input.userId}|${input.threadId}`,
    cacheKeyFn: key => (Array.isArray(key) ? `${key[0]}|${key[1]}` : key),
  }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
