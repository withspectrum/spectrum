// @flow
import type { DBMessage } from 'shared/types';
import type { GraphQLContext } from '../../';

export default (
  { parentId }: DBMessage,
  _: void,
  { loaders }: GraphQLContext
) => {
  if (!parentId) return null;
  return loaders.message.load(parentId);
};
