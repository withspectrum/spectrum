// @flow
import UserError from '../../utils/UserError';
import { removeSubscription } from '../../models/web-push-subscription';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

export default requireAuth(async (_: any, endpoint: string) => {
  return await removeSubscription(endpoint)
    .then(() => true)
    .catch(err => {
      return new UserError("Couldn't remove web push subscription.");
    });
});
