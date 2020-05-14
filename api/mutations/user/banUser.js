// @flow
import { isAuthedResolver, isAdmin } from '../../utils/permissions';
import UserError from '../../utils/UserError';
import type { GraphQLContext } from '../../';
import { banUser } from 'shared/db/queries/user';

type BanUserInput = {
  input: {
    userId: string,
    reason: string,
  },
};

export default isAuthedResolver(
  async (_: any, args: BanUserInput, ctx: GraphQLContext) => {
    const {
      input: { userId, reason },
    } = args;
    const { loaders, user: currentUser } = ctx;

    if (!isAdmin(currentUser.id)) {
      return new UserError('You don’t have permission to do that.');
    }

    if (currentUser.id === userId) {
      return new UserError('You cannot ban yourself.');
    }

    const reportedUser = await loaders.user.load(userId);

    if (!reportedUser) {
      return new UserError(`User with ID ${userId} does not exist.`);
    }

    if (reportedUser.bannedAt) {
      return new UserError('This user has already been banned');
    }

    return banUser({
      userId,
      reason,
      currentUserId: currentUser.id,
    })
      .then(() => {
        return true;
      })
      .catch(err => new UserError(err.message));
  }
);
