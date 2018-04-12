// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { deleteUser } from '../../models/user';
import { removeUsersCommunityMemberships } from '../../models/usersCommunities';
import { removeUsersChannelMemberships } from '../../models/usersChannels';
import { disableAllThreadNotificationsForUser } from '../../models/usersThreads';

export default async (_: any, __: any, { user }: GraphQLContext) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError('You must be signed in to delete your account');
  }

  return Promise.all([
    deleteUser(user.id),
    removeUsersCommunityMemberships(user.id),
    removeUsersChannelMemberships(user.id),
    disableAllThreadNotificationsForUser(user.id),
  ])
    .then(() => true)
    .catch(err => new UserError(err.message));
};
