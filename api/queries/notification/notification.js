// @flow
import type { GraphQLContext } from '../../';

export default (_: any, { id }: { id: string }, { loaders }: GraphQLContext) =>
  loaders.notification.load(id);
