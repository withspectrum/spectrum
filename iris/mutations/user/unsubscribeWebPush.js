// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { removeSubscription } from '../../models/web-push-subscription';

export default (_: any, endpoint: string, { user }: GraphQLContext) => {
  if (!user || !user.id)
    throw new UserError(
      'Can only unsubscribe from web push notifications when logged in.'
    );
  return removeSubscription(endpoint)
    .then(() => true)
    .catch(err => {
      throw new UserError("Couldn't remove web push subscription.");
    });
};
