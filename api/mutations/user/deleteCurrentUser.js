// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default async (_: any, __: any, { user }: GraphQLContext) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError('You must be signed in to delete your account');
  }

  return true;
};
