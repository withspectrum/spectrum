// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { encode } from '../../utils/base64';
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
  SearchResults: {
    searchResultConnection: results => {
      return {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
        edges: results.map(result => ({
          cursor: encode(result.id),
          node: result,
        })),
      };
    },
  },
  SearchResultNode: {
    __resolveType(root) {
      if (root.creatorId) {
        return 'Thread';
      }
      if (root.slug) {
        return 'Community';
      }
      if (root.username) {
        return 'User';
      }
      return null;
    },
  },
};
