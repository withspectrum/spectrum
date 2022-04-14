// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';

// Always return true for the current user
export default ({ isOnline, id }: DBUser, _: any, { user }: GraphQLContext) =>
  user && user.id === id ? true : isOnline;
