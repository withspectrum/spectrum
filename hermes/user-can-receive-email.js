// @flow
import { getUserById } from 'shared/db/queries/user';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';
import type { ToType } from './send-email';

type Props = {
  to: Array<ToType>,
  userId?: string,
};

export const userCanReceiveEmail = async ({ to, userId }: Props) => {
  if (!to) {
    if (userId) {
      trackQueue.add({
        userId: userId,
        event: events.EMAIL_BOUNCED,
        properties: { error: 'To field was not provided' },
      });
    }

    return false;
  }

  // qq.com email addresses are isp blocked, which raises our error rate
  // on sendgrid. prevent sending these emails at all
  to = to.filter(toType => {
    return toType.email.substr(to.length - 7) !== '@qq.com';
  });

  if (!userId) return false;
  if (!to || to.length === 0) return false;

  const user = await getUserById(userId);
  if (!user || user.bannedAt || user.deletedAt || !user.email) return false;

  return true;
};
