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

      return null;
    },
  },
};
