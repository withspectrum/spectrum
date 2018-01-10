// @flow
import type { GraphQLContext } from '../../';
import { getBlockedUsersInChannel } from '../../models/usersChannels';

export default ({ id }: { id: string }, _, { loaders }: GraphQLContext) => {
  return getBlockedUsersInChannel(id).then(users =>
    loaders.user.loadMany(users)
  );
};
