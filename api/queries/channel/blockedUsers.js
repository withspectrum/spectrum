// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import { getBlockedUsersInChannel } from '../../models/usersChannels';

export default ({ id }: DBChannel, _: any, { loaders }: GraphQLContext) => {
  return getBlockedUsersInChannel(id).then(users =>
    loaders.user.loadMany(users)
  );
};
