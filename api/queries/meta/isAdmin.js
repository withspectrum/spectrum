// @flow
import type { GraphQLContext } from '../../';
import { isAdmin } from '../../utils/permissions';

export default (_: any, __: any, { user }: GraphQLContext) => {
  if (!user || !isAdmin(user.id)) return false;
  return true;
};
