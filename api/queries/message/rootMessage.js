// @flow
import { getMessage } from '../../models/message';
import type { GraphQLContext } from '../../';

export default (_: any, { id }: { id: string }, { loaders }: GraphQLContext) =>
  loaders.message.load(id);
