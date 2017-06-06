// @flow
const { getNotificationsByUser } = require('../models/notification');
const { getMessage } = require('../models/message');
const { getChannels } = require('../models/channel');
import type { GraphQLContext } from '../';
import type { PaginationOptions } from '../utils/paginate-arrays';

module.exports = {
  Query: {
    notification: (_, { id }, { loaders }: GraphQLContext) =>
      loaders.notification.load(id),
    notifications: (_, { first = 10, after }: PaginationOptions, { user }) =>
      getNotificationsByUser(user.id, { first, after }),
  },
};
