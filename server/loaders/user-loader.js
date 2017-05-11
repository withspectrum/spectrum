// @flow
import { getUsers, getUsersStoryCount } from '../models/user';
import createLoader from './create-loader';
import type { Loader } from './types';

export const __createUserLoader = () =>
  createLoader(users => getUsers(users), 'uid');

export const __createUserStoryCountLoader = () =>
  createLoader(users => getUsersStoryCount(users), 'uid');

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
