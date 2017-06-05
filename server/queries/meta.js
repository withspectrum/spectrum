// @flow
import type { GraphQLContext } from '../';
import { getUserCount } from '../models/user';
import { getCommunityCount } from '../models/community';
import { getChannelCount } from '../models/channel';
import { getThreadCount } from '../models/thread';
import { isAdmin } from '../utils/permissions';

module.exports = {
  Query: {
    meta: () => ({}),
  },
  Meta: {
    userCount: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;
      return getUserCount();
    },
    communityCount: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;
      return getCommunityCount();
    },
    channelCount: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;
      return getChannelCount();
    },
    threadCount: (_: any, __: any, { user }: GraphQLContext) => {
      if (!isAdmin(user.id)) return null;
      return getThreadCount();
    },
  },
};
