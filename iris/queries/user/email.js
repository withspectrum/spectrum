// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';
import { isAdmin } from '../../utils/permissions';

export default ({ id, email }: DBUser, _: any, { user }: GraphQLContext) => {
  // Only admins and the user themselves can view the email
  if (!user || (id !== user.id && !isAdmin(user.id))) return null;
  return email;
};
