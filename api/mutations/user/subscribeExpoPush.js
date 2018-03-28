// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { storeExpoSubscription } from '../../models/expo-push-subscription';

export default (
  _: any,
  { token }: { token: string },
  { user }: GraphQLContext
) => {
  if (!user || !user.id)
    throw new UserError('Can only enable push notifications when logged in.');

  return storeExpoSubscription(token, user.id)
    .then(() => true)
    .catch(err => {
      throw new UserError(
        "Couldn't enable push notifications, please try again."
      );
    });
};
