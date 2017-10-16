// @flow
import { getUsers, getUsersThreadCount } from '../models/user';
import { getUsersRecurringPayments } from '../models/recurringPayment';
import {
  getUsersPermissionsInCommunities,
  getUsersTotalReputation,
} from '../models/usersCommunities';
import createLoader from './create-loader';
import type { Loader } from './types';

export const __createUserLoader = () =>
  createLoader(users => getUsers(users), 'id');

export const __createUserThreadCountLoader = () =>
  createLoader(users => getUsersThreadCount(users), 'id');

export const __createUserRecurringPaymentsLoader = () =>
  createLoader(users => getUsersRecurringPayments(users), 'userId');

export const __createUserPermissionsInCommunityLoader = () =>
  createLoader(
    usersCommunities => getUsersPermissionsInCommunities(usersCommunities),
    input => `${input.userId}|${input.communityId}`,
    key => (Array.isArray(key) ? `${key[0]}|${key[1]}` : key)
  );

export const __createUserTotalReputationLoader = () =>
  createLoader(users => getUsersTotalReputation(users), 'userId');

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
