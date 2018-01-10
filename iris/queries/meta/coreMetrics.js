// @flow
import type { GraphQLContext } from '../../';
import { isAdmin } from '../../utils/permissions';
import { getCoreMetrics } from '../../models/utils';

export default (_: any, __: any, { user }: GraphQLContext) => {
  if (!isAdmin(user.id)) return null;
  return getCoreMetrics();
};
