// @flow
import { getThreadTags } from '../../models/threadTags';
import type { DBThread } from 'shared/types';
import type { GraphQLContext } from '../../';

export default (thread: DBThread, _: void, { loaders }: GraphQLContext) => {
  if (!Array.isArray(thread.tags) || thread.tags.length === 0) return [];
  return loaders.threadTags.loadMany(thread.tags);
};
