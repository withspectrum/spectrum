// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { storeExpoSubscription } from '../../models/expo-push-subscription';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  token: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { token } = args;
  const { user } = ctx;

  return storeExpoSubscription(token, user.id)
    .then(() => true)
    .catch(err => {
      return new UserError(
        "Couldn't enable push notifications, please try again."
      );
    });
});
