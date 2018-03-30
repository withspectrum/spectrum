// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default ({ id }: DBThread, _: any, { loaders }: GraphQLContext) => {
  return loaders.threadParticipants
    .load(id)
    .then(result => (result ? result.reduction : []));
};
