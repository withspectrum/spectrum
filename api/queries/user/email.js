// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';
import { isAdmin } from '../../utils/permissions';

export default async (
  { id }: DBUser,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  // Only admins and the user themselves can view the email
  if (!user || (id !== user.id && !isAdmin(user.id))) return null;
  const { email } = await loaders.user.load(id);
  return email;
};
