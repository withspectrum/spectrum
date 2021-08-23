// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { deleteUser } from 'shared/db/queries/user';
import { removeUsersCommunityMemberships } from '../../models/usersCommunities';
import { removeUsersChannelMemberships } from '../../models/usersChannels';
import { disableAllUsersEmailSettings } from '../../models/usersSettings';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

export default requireAuth(async (_: any, __: any, ctx: GraphQLContext) => {
  const { user } = ctx;

  return Promise.all([
    deleteUser(user.id),
    disableAllUsersEmailSettings(user.id),
    removeUsersCommunityMemberships(user.id),
    removeUsersChannelMemberships(user.id),
  ])
    .then(() => true)
    .catch(err => new UserError(err.message));
});
