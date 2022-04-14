// @flow
const Search = /* GraphQL */ `
  enum SearchType {
    COMMUNITIES
    USERS
    THREADS
    COMMUNITY_MEMBERS
  }

  union SearchResultNode = Community | Thread | User | CommunityMember

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

  type SearchResults @cacheControl(maxAge: 600) {
    searchResultsConnection: SearchResultsConnection
  }

  extend type Query {
    search(
      # Returns the first *n* results from the list
      first: Int
      # Returns the elements in the list that come after the specified ID
      after: String
      # Returns the last *n* results from the list
      last: Int
      # Returns the elements in the list that come before the specified ID
      before: String
      # The string typed by the user to search for
      queryString: String!
      # The types of items that can be searched
      type: SearchType!
      # Optional ID to be used to filter search results by community, channel, user, etc.
      filter: SearchFilter
    ): SearchResults @cost(complexity: 2, multipliers: ["first"])
  }
`;

module.exports = Search;
