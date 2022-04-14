// @flow
import { getUserById } from 'shared/db/queries/user';
import type { ToType } from './send-email';

type Props = {
  to: Array<ToType>,
  userId?: string,
};

export const userCanReceiveEmail = async ({ to, userId }: Props) => {
  if (!to) {
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
