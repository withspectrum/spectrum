// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { threadInfoFragment } from '../fragments/thread/threadInfo';

const SEARCH_THREADS_QUERY = gql`
  query search(
    $queryString: String!
    $type: SearchType!
    $filter: SearchFilter
  ) {
    search(queryString: $queryString, type: $type, filter: $filter) {
      searchResultsConnection {
        edges {
          node {
            ... on Thread {
              ...threadInfo
            }
          }
        }
      }
    }
  }
  ${threadInfoFragment}
`;

const SEARCH_THREADS_OPTIONS = {
  props: ({ data: { fetchMore, error, loading, search, networkStatus } }) => ({
    data: {
      error,
      loading,
      networkStatus,
      fetchMore: () => {},
      threads: search ? search.searchResultsConnection.edges : [],
    },
  }),
  options: ({ queryString, filter }) => ({
    variables: {
      queryString,
      filter,
      type: 'THREADS',
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(SEARCH_THREADS_QUERY, SEARCH_THREADS_OPTIONS);
