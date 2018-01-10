// @flow
import type { GraphQLContext } from '../../';
import type { Args } from './types';
type SearchTypes = 'COMMUNITIES' | 'USERS' | 'THREADS';
import UserError from '../../utils/UserError';
import searchCommunities from './searchCommunities';
import searchUsers from './searchUsers';
import searchThreads from './searchThreads';

export default (
  _: any,
  { type, ...args }: { type: SearchTypes, args: Args },
  { loaders, user }: GraphQLContext
) => {
  switch (type) {
    case 'COMMUNITIES': {
      return searchCommunities(args, { loaders });
    }
    case 'USERS': {
      return searchUsers(args, { loaders });
    }
    case 'THREADS': {
      return searchThreads(args, { loaders, user });
    }
    default: {
      return new UserError('Invalid searchType supplied to Search query');
    }
  }
};
