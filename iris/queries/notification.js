const { getNotificationsByUser } = require('../models/notification');
const { getMessage } = require('../models/message');
const { getChannels } = require('../models/channel');
import type { GraphQLContext } from '../';
import paginate from '../utils/paginate-arrays';
import { encode, decode } from '../utils/base64';
import type { PaginationOptions } from '../utils/paginate-arrays';
import UserError from '../utils/UserError';

module.exports = {
  Query: {
    notification: (_, { id }, { loaders }: GraphQLContext) =>
      loaders.notification.load(id),
    notifications: (
      _,
      { first = 10, after }: PaginationOptions,
      { user }: GraphQLContext
    ) => {
      const currentUser = user;
      if (!currentUser) return;

      return getNotificationsByUser(currentUser.id, {
        first,
        after: after && parseInt(decode(after), 10),
      }).then(result => ({
        pageInfo: {
          hasNextPage: result.length >= first,
        },
        edges: result.map((notification, index) => ({
          cursor: encode(String(notification.entityAddedAt.getTime())),
          node: notification,
        })),
      }));
    },
  },
};
