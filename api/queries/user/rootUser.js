// @flow
import type { GraphQLContext } from '../../';

export default (
  _: any,
  args: { id?: string, username?: string } = {},
  { loaders }: GraphQLContext
) => {
  if (args.id) return loaders.user.load(args.id);
  if (args.username) return loaders.userByUsername.load(args.username);
  return null;
};
