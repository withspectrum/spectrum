// @flow
import type { GraphQLContext } from '../../';

export default (_: any, __: any, { user }: GraphQLContext) =>
  user ? (user.bannedAt ? null : user) : null;
