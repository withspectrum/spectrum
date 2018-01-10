// @flow
import type { GraphQLContext } from '../../';
import { getOwnersInChannel } from '../../models/usersChannels';

export default ({ id }: { id: string }, _, { loaders }: GraphQLContext) => {
  return getOwnersInChannel(id).then(users => loaders.user.loadMany(users));
};
