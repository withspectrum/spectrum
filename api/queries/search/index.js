// @flow
import search from './search';
import searchResultsConnection from './searchResultsConnection';

module.exports = {
  Query: {
    search,
  },
  SearchResults: {
    searchResultsConnection,
  },
  SearchResultNode: {
    __resolveType(root: any) {
      if (root.slug) {
        return 'Community';
      }

      if (root.creatorId) {
        return 'Thread';
      }
      if (root.hasOwnProperty('username')) {
        return 'User';
      }
      // we want to check for the existence of the field, not the value of it
      if (root.hasOwnProperty('reputation')) {
        return 'CommunityMember';
      }

      return null;
    },
  },
};
