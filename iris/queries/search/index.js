// @flow
import type { GraphQLContext } from '../../';
import type { Args } from './types';
import UserError from '../../utils/UserError';
import { encode } from '../../utils/base64';
import searchCommunities from './searchCommunities';
import searchUsers from './searchUsers';
import searchThreads from './searchThreads';

type SearchTypes = 'COMMUNITIES' | 'USERS' | 'THREADS';

module.exports = {
  Query: {
    search: (
      _: any,
      { type, ...args }: { type: SearchTypes, args: Args },
      { loaders, user }: GraphQLContext
    ) => {
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
    searchResultConnection: (results: Array<any>) => {
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
