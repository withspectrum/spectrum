// @flow
import type { GraphQLContext } from '../../';
import { getUserById } from 'shared/db/queries/user';

export default async (_: any, __: any, { user }: GraphQLContext) => {
  if (!user || !user.id) return null;
  const dbUser = await getUserById(user.id);
  if (!dbUser) return null;
  if (dbUser.bannedAt) return null;
  return dbUser;
};
