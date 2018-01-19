// @flow
const Search = /* GraphQL */ `
  enum SearchType {
    COMMUNITIES
    USERS
    THREADS
  }

  union SearchResultNode = Community | Thread | User

  type SearchResultEdge {
    cursor: String!
    node: SearchResultNode
  }

  type SearchResultsConnection {
    edges: [SearchResultEdge]
    pageInfo: PageInfo
  }

  input SearchFilter {
    communityId: ID
    channelId: ID
    creatorId: ID
    everythingFeed: Boolean
  }

  type SearchResults {
    searchResultsConnection: SearchResultsConnection
  }

	extend type Query {
		search (
      # Returns the first *n* results from the list
      first: Int,
      # Returns the elements in the list that come after the specified ID
      after: String,
      # Returns the last *n* results from the list
      last: Int,
      # Returns the elements in the list that come before the specified ID
      before: String,
      # The string typed by the user to search for
      queryString: String!,
      # The types of items that can be searched
      type: SearchType!
      # Optional ID to be used to filter search results by community, channel, user, etc.
      filter: SearchFilter
    ): SearchResults
	}
`;

module.exports = Search;
