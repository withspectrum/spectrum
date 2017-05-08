// @flow
import { getUsers } from '../models/user';
import createLoader from './create-loader';
import type { Loader } from './types';

export const __createUserLoader = () =>
  createLoader(users => {
    return getUsers(users);
  }, 'uid');

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
