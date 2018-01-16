// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import { getOwnersInChannel } from '../../models/usersChannels';

export default ({ id }: DBChannel, _: any, { loaders }: GraphQLContext) => {
  return getOwnersInChannel(id).then(users => loaders.user.loadMany(users));
};
