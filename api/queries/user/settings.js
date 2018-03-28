// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';
import { getUsersSettings } from '../../models/usersSettings';
import UserError from '../../utils/UserError';

export default (_: DBUser, __: any, { user }: GraphQLContext) => {
  if (!user) return new UserError('You must be signed in to continue.');
  return getUsersSettings(user.id);
};
