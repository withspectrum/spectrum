// @flow
import type { GraphQLContext } from '../../';
import type { WebPushSubscription } from './';
import UserError from '../../utils/UserError';
import { storeSubscription } from '../../models/web-push-subscription';
import sendWebPushNotification from 'shared/send-web-push-notification';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

export default (
  _: any,
  { subscription }: { subscription: WebPushSubscription },
  { user }: GraphQLContext
) => {
  if (!user || !user.id)
    throw new UserError(
      'Can only subscribe to web push notifications when logged in.'
    );

  trackQueue.add({
    userId: user.id,
    event: events.WEB_PUSH_NOTIFICATIONS_SUBSCRIBED,
  });

  return storeSubscription(subscription, user.id)
    .then(() => {
      return sendWebPushNotification(
        subscription,
        {
          title: 'A notification from Spectrum',
          body: 'Yay, notifications are enabled! 🚀',
        },
        {
          TTL: 300, // If the user doesn't go online for five minutes don't send him this notification anymore
        }
      ).catch(err => {
        throw new UserError(
          "It seems like we can't send you web push notifications. Please ping @mxstbr with your browser and OS versions and he'll take a look!"
        );
      });
    })
    .then(() => true)
    .catch(err => {
      throw new UserError("Couldn't store web push subscription.");
    });
};
