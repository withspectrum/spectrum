// @flow
import type { GraphQLContext } from '../../';
import type { Args } from './types';
type SearchTypes = 'COMMUNITIES' | 'USERS' | 'THREADS';
import UserError from '../../utils/UserError';
import searchCommunities from './searchCommunities';
import searchUsers from './searchUsers';
import searchThreads from './searchThreads';
import searchCommunityMembers from './searchCommunityMembers';

type Input = {
  type: SearchTypes,
  ...Args,
};

export default (_: any, input: Input, ctx: GraphQLContext) => {
  const { type, first, after, last, before, queryString, filter } = input;
  if (!queryString) return new UserError('Please provide a search term.');
  const args = {
    first,
    after,
    last,
    before,
    queryString,
    filter,
  };
  switch (type) {
    case 'COMMUNITIES': {
      return searchCommunities(args, ctx);
    }
    case 'USERS': {
      return searchUsers(args, ctx);
    }
    case 'THREADS': {
      return searchThreads(args, ctx);
    }
    case 'COMMUNITY_MEMBERS': {
      return searchCommunityMembers(args, ctx);
    }
    default: {
      return new UserError('Invalid searchType supplied to Search query');
    }
  }
};
