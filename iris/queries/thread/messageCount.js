// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default ({ id }: DBThread, __: any, { loaders }: GraphQLContext) => {
  return loaders.threadMessageCount
    .load(id)
    .then(messageCount => (messageCount ? messageCount.reduction : 0));
};
