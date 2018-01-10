// @flow
import type { GraphQLContext } from '../../';
import { getModeratorsInChannel } from '../../models/usersChannels';

export default ({ id }: { id: string }, _, { loaders }: GraphQLContext) => {
  return getModeratorsInChannel(id).then(users => loaders.user.loadMany(users));
};
