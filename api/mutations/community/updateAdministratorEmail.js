// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { setCommunityPendingAdministratorEmail } from '../../models/community';
import isEmail from 'validator/lib/isEmail';
import { sendAdministratorEmailValidationEmailQueue } from 'shared/bull/queues';
import {
  isAuthedResolver as requireAuth,
  canAdministerCommunity,
} from '../../utils/permissions';

type Input = {
  input: {
    id: string,
    email: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { id: communityId, email } = args.input;
  const { loaders, user } = ctx;

  if (!email || !isEmail(email)) {
    return new UserError('Please enter a working email address');
  }

  if (!await canAdministerCommunity(user.id, communityId, loaders)) {
    return new UserError('You don’t have permission to manage this community');
  }

  return setCommunityPendingAdministratorEmail(communityId, email, user.id)
    .then(community => {
      sendAdministratorEmailValidationEmailQueue.add({
        email,
        userId: user.id,
        communityId,
        community,
      });
      return community;
    })
    .catch(
      () =>
        new UserError(
          "We weren't able to send a confirmation email. Please try again."
        )
    );
});
