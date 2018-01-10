// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

import searchCommunities from './searchCommunities';
import searchUsers from './searchUsers';
import searchThreads from './searchThreads';

module.exports = {
  Query: {
    search: (_: any, { type, ...args }, { loaders, user }: GraphQLContext) => {
      switch (type) {
        case 'COMMUNITIES': {
          return searchCommunities(args, loaders);
        }
        case 'USERS': {
          return searchUsers(args, loaders);
        }
        case 'THREADS': {
          return searchThreads(args, loaders, user);
        }
        default: {
          return new UserError('Invalid searchType supplied to Search query');
        }
      }
    },
  },
  SearchResultNode: {
    __resolveType(obj) {
      if (obj.creatorId) {
        return 'Thread';
      }
      if (obj.slug) {
        return 'Community';
      }
      if (obj.username) {
        return 'User';
      }
    },
  },
};
