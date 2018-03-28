// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import { getModeratorsInChannel } from '../../models/usersChannels';

export default ({ id }: DBChannel, _: any, { loaders }: GraphQLContext) => {
  return getModeratorsInChannel(id).then(users => loaders.user.loadMany(users));
};
