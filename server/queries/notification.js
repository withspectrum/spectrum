// @flow
const { getNotificationsByUser } = require('../models/notification');
const { getMessage } = require('../models/message');
const { getChannels } = require('../models/channel');
import type { GraphQLContext } from '../';
import paginate from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import type { PaginationOptions } from '../utils/paginate-arrays';

module.exports = {
  Query: {
    notification: (_, { id }, { loaders }: GraphQLContext) =>
      loaders.notification.load(id),
    notifications: (
      _,
      { first = 10, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const cursor = decode(after);
      const currentUser = user;
      return getNotificationsByUser(currentUser.id, { first, after })
        .then(notifications =>
          paginate(
            notifications,
            { first, after: cursor },
            notification => notification.id === cursor
          )
        )
        .then(result => ({
          pageInfo: {
            hasNextPage: result.hasMoreItems,
          },
          edges: result.list.map(notification => ({
            cursor: encode(notification.id),
            node: notification,
          })),
        }));
    },
  },
};
