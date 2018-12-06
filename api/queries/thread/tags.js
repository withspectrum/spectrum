// @flow
import { getThreadTags } from '../../models/threadTags';
import type { DBThread } from 'shared/types';
import type { GraphQLContext } from '../../';

export default (thread: DBThread, _: void, { loaders }: GraphQLContext) => {
  // TODO(@mxstbr): Use loader
  return getThreadTags(thread.tags);
};
