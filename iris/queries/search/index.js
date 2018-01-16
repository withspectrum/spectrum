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
