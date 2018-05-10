// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { removeSubscription } from '../../models/web-push-subscription';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

export default (_: any, endpoint: string, { user }: GraphQLContext) => {
  if (!user || !user.id)
    throw new UserError(
      'Can only unsubscribe from web push notifications when logged in.'
    );

  trackQueue.add({
    userId: user.id,
    event: events.WEB_PUSH_NOTIFICATIONS_UNSUBSCRIBED,
  });

  return removeSubscription(endpoint)
    .then(() => true)
    .catch(err => {
      throw new UserError("Couldn't remove web push subscription.");
    });
};
