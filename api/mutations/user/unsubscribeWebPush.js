// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { removeSubscription } from '../../models/web-push-subscription';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

export default requireAuth(
  async (_: any, endpoint: string, ctx: GraphQLContext) => {
    const { user } = ctx;

    trackQueue.add({
      userId: user.id,
      event: events.WEB_PUSH_NOTIFICATIONS_UNSUBSCRIBED,
    });

    return await removeSubscription(endpoint)
      .then(() => true)
      .catch(err => {
        return new UserError("Couldn't remove web push subscription.");
      });
  }
);
