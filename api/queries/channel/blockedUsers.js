// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import UserError from '../../utils/UserError';
import { getBlockedUsersInChannel } from '../../models/usersChannels';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';

export default requireAuth(
  async ({ id }: DBChannel, _: any, { user, loaders }: GraphQLContext) => {
    if (!await canModerateChannel(user.id, id, loaders)) {
      return new UserError('You don’t have permission to manage this channel');
    }

    return getBlockedUsersInChannel(id).then(users =>
      loaders.user.loadMany(users)
    );
  }
);
