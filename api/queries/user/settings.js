// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';
import {
  getUsersSettings,
  createNewUsersSettings,
} from '../../models/usersSettings';
import UserError from '../../utils/UserError';

export default async (_: DBUser, __: any, { user }: GraphQLContext) => {
  if (!user) return new UserError('You must be signed in to continue.');
  const settings = await getUsersSettings(user.id);
  if (settings) return settings;
  return await createNewUsersSettings(user.id);
};
