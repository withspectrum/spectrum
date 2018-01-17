// @flow
import type { PaginationOptions } from '../../utils/paginate-arrays';
import type { GraphQLContext } from '../../';
import { getUnreadDirectMessageNotifications } from '../../models/notification';
import { encode, decode } from '../../utils/base64';

export default (
  _: any,
  { first = 10, after }: PaginationOptions,
  { user }: GraphQLContext
) => {
  if (!user) return;
  // return an array of unread direct message notifications
  // $FlowFixMe
  return getUnreadDirectMessageNotifications(user.id, {
    first,
    after: after && parseInt(decode(after), 10),
  }).then(result => ({
    pageInfo: {
      hasNextPage: result.length >= first,
    },
    edges: result.map(notification => ({
      cursor: encode(String(notification.entityAddedAt.getTime())),
      node: notification,
    })),
  }));
};
